import cors from 'cors';
import express from 'express';
import https from 'https';
import fs from 'fs';
import gameData from './routes/GameData';
import userRecentGames from './routes/user/GetRecentGames';
import userOwnedGames from './routes/user/GetOwnedGames';
import userPlaytime from './routes/user/GetPlaytime';
import { execSync } from 'child_process';

const app = express();
export const PORT = 5000;
const PREFIX = '/api/steam';
const CERTS_DIR = './api/server/certs';

app.use(cors());
app.use(express.json());

//ROUTES
app.use(PREFIX, userPlaytime);
app.use(PREFIX, gameData);
app.use(PREFIX, userRecentGames);
app.use(PREFIX, userOwnedGames);

//check if certs exist; if not, generate them
//only for local development; for production we can use Lets encrypt


if (!fs.existsSync(`${CERTS_DIR}/localhost.pem`) || !fs.existsSync(`${CERTS_DIR}//localhost-key.pem`)) {
  execSync(`npx tsx ${CERTS_DIR}/setupCerts.ts`, { stdio: 'inherit' });
}


//SERVER OPTIONS
const options = {
  cert: fs.readFileSync(`${CERTS_DIR}/localhost.pem`),
  key: fs.readFileSync(`${CERTS_DIR}/localhost-key.pem`),
};

//SERVER
const server = https.createServer(options, app);
server.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
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
