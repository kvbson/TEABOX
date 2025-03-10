import cors from 'cors';
import express from "express";
import gameData from './routes/GameData';
import userPreferences from './routes/UserPreferences';
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/steam', userPreferences);
app.use('/api/steam', gameData);

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
