import { redisClient, setKeyWithTTL } from '#api/redis/redisClient';
import steamApi from '#server/clients/steamClients/steamApiClient';
import { GameInfo } from '#types/gameInfo.types';
import { Router } from 'express';
import { getMissingIds } from '../db/GetMissingIds.js';

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

  const cacheKey = `recentGames:${steamId}`;
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      const data: RecentGames = JSON.parse(cached);
      res.json({ success: true, data });
      return;
    }
    const data = await getUserRecentGames(steamId as string);

    const missingIds = (await getMissingIds()).map(el => el.appId);
    data.response.games = data.response.games.filter(game => !missingIds.includes(String(game.appid)));

    await setKeyWithTTL(cacheKey, JSON.stringify(data));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default userRecentGames;