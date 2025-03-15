import { Router } from 'express';
import steamApi from '../../clients/steamClients/steamApiClient.js';

/**
  * Parameters:
  * @param steamId user steam id
  */

const userRecentGames = Router();

userRecentGames.get('/user/recentGames', async (req, res) => {
  const { steamId } = req.query;
  const params = {
    steamid: steamId,
    format: 'json',
  };
  try {
    const { data } = await steamApi.get('IPlayerService/GetRecentlyPlayedGames/v0001/', { params });
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default userRecentGames;