import cors from 'cors';
import express from 'express';
import https from 'https';
import fs from 'fs';
import gameData from './routes/GameData';
import userRecentGames from './routes/user/GetRecentGames';
import userOwnedGames from './routes/user/GetOwnedGames';
import userPlaytime from './routes/user/GetPlaytime';
import { checkForCerts } from './certs/setupCerts';

const app = express();
const PREFIX = '/api/steam';
export const PORT = 5000;
export const CERTS_DIR = './src/api/server/certs/';

// Certificate filenames
const CERT_FILE = 'localhost.pem';
const KEY_FILE = 'localhost-key.pem';

app.use(cors());
app.use(express.json());

//ROUTES
app.use(PREFIX, userPlaytime);
app.use(PREFIX, gameData);
app.use(PREFIX, userRecentGames);
app.use(PREFIX, userOwnedGames);

//check if certs exist; if not, generate them
//only for local development; for production we can use Lets encrypt
async function startServer() {
  // Check if certs exist; if not, generate them
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