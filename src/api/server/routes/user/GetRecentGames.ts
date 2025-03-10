import { Router } from 'express';
import steamApi from '../../clients/steamApiClient';

/**
  * Parameters:
  * @param steamId user steam id
  */

const userRecentGames = Router();

userRecentGames.get('/user/recentGames/:steamId', async (req, res) => {
  const { steamId } = req.params;
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