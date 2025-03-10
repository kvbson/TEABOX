import cors from 'cors';
import express from "express";
import gameData from './routes/GameData';
import userPlaytime from './routes/user/GetPlaytime';
import userRecentGames from './routes/user/GetRecentGames';
import userOwnedGames from './routes/user/GetOwnedGames';
const app = express();
const PORT = 5000;
const prefix = '/api/steam';

app.use(cors());
app.use(express.json());

//ROUTES
app.use(prefix, userPlaytime);
app.use(prefix, gameData);
app.use(prefix, userRecentGames);
app.use(prefix, userOwnedGames);

//SERVER
const server = app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})

const shutdown = () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
