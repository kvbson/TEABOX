import { Router } from 'express';
import fetch from 'node-fetch';

 /**
  * Parameters:
  * @param appId game id
  */

const gameData = Router();

gameData.get('/gameData/:appId', async (req, res) => {
  const { appId } = req.params;
  const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;
  try {
    const response = await fetch(url);
    const data = await response.json()
    res.json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default gameData;