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

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})