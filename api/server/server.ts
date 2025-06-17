import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fs from 'node:fs';
import https from 'node:https';
import { connectDB, mongoose } from '../db/connections.js';
import gameInfo from './routes/GetGameInfo.js';
import tags from './routes/GetTags.js';
import userBadges from './routes/user/GetBadges.js';
import userOwnedGames from './routes/user/GetOwnedGames.js';
import userPlaytime from './routes/user/GetPlaytime.js';
import userProfileData from './routes/user/GetProfileData.js';
import userRecentGames from './routes/user/GetRecentGames.js';
import missingIds from './routes/db/GetMissingIds.js';
import topmostTags from './routes/utils/getTopmostTags.js';
import sortedGameInfo from './routes/db/GetSortedGameInfo.js';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { CERT_FILE, CERTS_DIR, checkForCerts, KEY_FILE } from '../certs/setupCerts.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PREFIX = '/api/steam';
const PORT = process.env.PORT || 8081;

app.set('trust proxy', true);
app.use(cors({
  origin: ['https://localhost:5173', 'http://localhost:4173', 'http://localhost:8081', 'http://localhost:5000', 'https://emerald-water-462206-d0.lm.r.appspot.com'], //[vite client url, vite preview client url]
  methods: ['GET', 'POST'],
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

connectDB();

//ROUTES
const routes = [userPlaytime, userRecentGames, userOwnedGames, userProfileData, userBadges, gameInfo, missingIds, tags, topmostTags, sortedGameInfo];
for (const route of routes) {
  app.use(PREFIX, route);
}

//HEALTH CHECK
app.get('/_ah/health', (_, res) => {
  res.status(200).json({ status: 'OK', dbState: mongoose.connection.readyState });
});

//SERVE STATIC FILES
if (process.env.NODE_ENV === 'production') {
  // const staticPath = path.join(__dirname, '../../'); // Changed from 'src' to 'dist'
  // app.use('/assets', express.static(
  //   path.join(staticPath, 'assets').replace(/\\/g, '/'),
  //   {
  //   // Cache settings (optional)
  //     maxAge: '1y',
  //     immutable: true,
  //     // Fallthrough: false (ensure 404 if file missing)
  //     fallthrough: false,
  //   },
  // ));
  // console.log('[DEBUG] Static path:', staticPath); // Add this line
  // console.log('[DEBUG] Assets path:', path.join(staticPath, 'assets')); // Add this line
  // app.use(express.static(staticPath));
  // app.use(express.static(path.join(__dirname, '../../src')));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html'));
  });
}

//MIDDLEWARE
// app.use((err: Error, _: express.Request, res: express.Response) => {
// console.error(err);
// res.status(500).json({ error: 'Something went wrong!' });
// });

async function startServer() {

  console.log(`[ENV] NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[ENV] PORT: ${PORT}`);
  console.log(`[DB] Connection state: ${mongoose.connection.readyState}`);

  if (process.env.NODE_ENV !== 'production') {
    if (!fs.existsSync(`${CERTS_DIR}${CERT_FILE}`) || !fs.existsSync(`${CERTS_DIR}${KEY_FILE}`)) {
      await checkForCerts(KEY_FILE, CERT_FILE);
    }
  }

  const server = process.env.NODE_ENV === 'production'
    ? app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    })
    : https.createServer({
      cert: fs.readFileSync(`${CERTS_DIR}${CERT_FILE}`),
      key: fs.readFileSync(`${CERTS_DIR}${KEY_FILE}`),
    }, app).listen(PORT, () => {
      console.log(`🔐 Dev server running at https://localhost:${PORT}`);
    });

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
