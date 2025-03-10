import { Router } from 'express';
import fetch from 'node-fetch';

const gameData = Router();

gameData.get('/game-data/:gameId', async (req, res) => {
  const { gameId } = req.params;
  const url = `https://store.steampowered.com/api/appdetails?appids=${gameId}`;
  try {
    const response = await fetch(url);
    const data = await response.json()
    res.json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default gameData;