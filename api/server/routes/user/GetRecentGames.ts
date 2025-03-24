import { Router } from 'express';
import steamApi from '../../clients/steamClients/steamApiClient.js';

/**
  * Parameters:
  * @param steamId user steam id
  */

export const getUserRecentGames = async (steamId: string) => {
  const params = {
    steamid: steamId,
    format: 'json',
  };

  const { data } = await steamApi.get('IPlayerService/GetRecentlyPlayedGames/v0001/', {
    params,
  });
  return data;
};

const userRecentGames = Router();

userRecentGames.get('/user/recentGames', async (req, res) => {
  const { steamId } = req.query;

  try {
    const data = await getUserRecentGames(steamId as string);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default userRecentGames;