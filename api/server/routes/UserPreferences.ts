import dotenv from 'dotenv';
import { Router } from 'express';
import fetch from 'node-fetch';

dotenv.config();
const userPreferences = Router();
const steamAPIKey = process.env.VITE_STEAM_API_KEY;

userPreferences.get('/recent/:steamId', async (req, res) => {
  const { steamId } = req.params;
  const url = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${steamAPIKey}&steamid=${steamId}&format=json`;
  try {
    const response = await fetch(url);
    const data = await response.json()
    res.json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default userPreferences;