import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import fs from 'node:fs';
import https from 'node:https';
import gameData from './routes/GameData.js';
import userOwnedGames from './routes/user/GetOwnedGames.js';
import userPlaytime from './routes/user/GetPlaytime.js';
import userRecentGames from './routes/user/GetRecentGames.js';
import { CERT_FILE, CERTS_DIR, checkForCerts, KEY_FILE } from '../certs/setupCerts.js';
import userProfileData from './routes/user/GetProfileData.js';

const app = express();
const PREFIX = '/api/steam';
export const PORT = 5000;

app.use(cors({
  origin: 'https://localhost:5173', //vite client url
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(helmet());

//ROUTES
app.use(PREFIX, userPlaytime);
app.use(PREFIX, gameData);
app.use(PREFIX, userRecentGames);
app.use(PREFIX, userOwnedGames);
app.use(PREFIX, userProfileData);

async function startServer() {
  // check if certs exist; if not, generate them
  // only for local development; for production we can use Lets encrypt
  if (!fs.existsSync(`${CERTS_DIR}${CERT_FILE}`) || !fs.existsSync(`${CERTS_DIR}${KEY_FILE}`)) {
    await checkForCerts(KEY_FILE, CERT_FILE);
  }

  // SERVER OPTIONS
  const options = {
    cert: fs.readFileSync(`${CERTS_DIR}${CERT_FILE}`),
    key: fs.readFileSync(`${CERTS_DIR}${KEY_FILE}`),
  };

  // SERVER
  const server = https.createServer(options, app);
  server.listen(PORT, () => {
    console.log(`Server running at https://localhost:${PORT}`);
  });

  const shutdown = () => {
    console.log('Shutting down server...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });

    // Force exit if server is not shut down within 5 seconds
    setTimeout(() => {
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