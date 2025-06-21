import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CERT_FILE, CERTS_DIR, checkForCerts, KEY_FILE } from '../certs/setupCerts.js';
import { connectDB, mongoose } from '../db/connections.js';
import bigQueryData from './routes/bigQuery/GetBigQueryData.js';
import missingIds from './routes/db/GetMissingIds.js';
import sortedGameInfo from './routes/db/GetSortedGameInfo.js';
import gameInfo from './routes/GetGameInfo.js';
import tags from './routes/GetTags.js';
import userBadges from './routes/user/GetBadges.js';
import userOwnedGames from './routes/user/GetOwnedGames.js';
import userPlaytime from './routes/user/GetPlaytime.js';
import userProfileData from './routes/user/GetProfileData.js';
import userRecentGames from './routes/user/GetRecentGames.js';
import errorHandler from './routes/utils/errorHandler.js';
import topmostTags from './routes/utils/getTopmostTags.js';
import prosNCons from './routes/other/prosNCons.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PREFIX = '/api/steam';
const PORT = process.env.PORT || 8080;
const allowedOrigins =
  process.env.NODE_ENV === 'development'
    ? ['https://localhost:5173'] //vite dev server
    : ['https://emerald-water-462206-d0.lm.r.appspot.com', ...(process.env.DOMAIN ? [process.env.DOMAIN] : [])];

app.set('trust proxy', true);
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'img-src': ["'self'", 'https: data:'],
    },
  }),
);

//ROUTES
const routes = [userPlaytime, userRecentGames, userOwnedGames, userProfileData, userBadges, gameInfo, missingIds, tags, topmostTags, sortedGameInfo, prosNCons];
for (const route of routes) {
  app.use(PREFIX, route);
}

//HEALTH CHECK
app.get('/_ah/health', (_, res) => {
  console.log('Server status - OK');
  res.status(200).json({ status: 'OK', dbState: mongoose.connection.readyState });
});

app.use('/api/bigquery', bigQueryData);

//SERVE STATIC FILES
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, '../../');

  console.log('[DEBUG] Static path:', staticPath);
  console.log('[DEBUG] Assets path:', path.join(staticPath, 'assets'));

  app.use(express.static(staticPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-store');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  }));

  //index.html without cahce
  app.get('/', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.sendFile(path.join(staticPath, 'index.html'));
  });

  // Catch-all route to serve index.html for all paths other than API requests (used by SPA in web React app)
  app.get('/*splat', (req, res, next) => {
    if (req.path.startsWith('/api')) return next(); // let API requests pass through
    res.set('Cache-Control', 'no-store');
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

app.use(errorHandler);

async function startServer() {

  console.log(`[ENV] NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[ENV] PORT: ${PORT}`);

  if (process.env.NODE_ENV !== 'production' && (!fs.existsSync(`${CERTS_DIR}${CERT_FILE}`) || !fs.existsSync(`${CERTS_DIR}${KEY_FILE}`))) {
    await checkForCerts(KEY_FILE, CERT_FILE);
  }
  // using 0.0.0.0 because server is behing reverse proxy (e.g. GCP App Engine)
  const server = process.env.NODE_ENV === 'production'
    ? app.listen(Number(PORT), '0.0.0.0', () => {
      connectDB();
      console.log(`✅ Server running on port ${PORT}`);
    })
    : https.createServer({
      cert: fs.readFileSync(`${CERTS_DIR}${CERT_FILE}`),
      key: fs.readFileSync(`${CERTS_DIR}${KEY_FILE}`),
    }, app).listen(PORT, () => {
      connectDB();
      console.log(`🔐 Dev server running at https://localhost:${PORT}`);
    });

  // Set server timeouts
  server.timeout = 70000; // 70 seconds
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;

  const shutdown = () => {
    console.log('Shutting down server...');
    mongoose.connection.close(false);
    console.log('ℹ️  MongoDB connection closed');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });

    // Force exit if server is not shut down within 5 seconds
    setTimeout(async () => {
      await mongoose.connection.close(true);
      console.log('Forcefully shutting down the server.');
      process.exit(1);
    }, 5000);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// Start the server
startServer().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
