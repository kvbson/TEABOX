import { Router } from 'express';
import { getMissingIds } from '../db/GetMissingIds.js';
import { GameInfo } from '../../../types/gameInfo.types.js';
import steamApi from '../../clients/steamClients/steamApiClient.js';

export type RecentGames = { response: { total_count: number, games: GameInfo[] }};

/**
  * Parameters:
  * @param steamId user steam id
  */

export const getUserRecentGames = async (steamId: string): Promise<RecentGames> => {
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
    const missingIds = (await getMissingIds()).map(el => el.appId);
    data.response.games = data.response.games.filter(data => !missingIds.includes(String(data.appid)));
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default userRecentGames;