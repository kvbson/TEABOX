import { Router } from 'express';
import { getUserRecentGames } from './GetRecentGames.js';
import { getUserOwnedGames } from './GetOwnedGames.js';
import { getGameInfo } from '../GetGameInfo.js';
import { ExtendedGameInfo } from '@api/types/routes.types.js';
import PQueue from 'p-queue';

// Configure rate limiting: 1 request per 1.5 seconds
const steamApiQueue = new PQueue({
  interval: 1500,
  intervalCap: 1,
  carryoverConcurrencyCount: true,
});

export type UserProfileData = {
    recentGames: Record<string, ExtendedGameInfo>;
    ownedGames: Record<string, ExtendedGameInfo>;
}

const getUserProfileData = async (steamId: string): Promise<UserProfileData | undefined> => {
  try {
    const [recentGames, ownedGames] = await Promise.all([
      getUserRecentGames(steamId),
      getUserOwnedGames(steamId),
    ]);

    // Get unique app IDs from both lists
    const allAppIds = [
      ...new Set([
        ...recentGames.response.games.map(g => g?.appid),
        ...ownedGames.response.games.map(g => g?.appid),
      ]),
    ].filter(Boolean) as number[];

    // Fetch game details with rate limiting
    const gameInfoMap: Record<number, ExtendedGameInfo> = {};

    await Promise.all(
      allAppIds.map(appId =>
        steamApiQueue.add(async () => {
          try {
            gameInfoMap[appId] = await getGameInfo(appId);
          } catch (err) {
            console.error(`Failed to fetch app ${appId}:`, err);
          }
        }),
      ),
    );

    return {
      recentGames: recentGames.response.games.reduce((acc, game) => {
        if (game?.appid) acc[game.appid] = gameInfoMap[game.appid];
        return acc;
      }, {} as Record<string, ExtendedGameInfo>),

      ownedGames: ownedGames.response.games.reduce((acc, game) => {
        if (game?.appid) acc[game.appid] = gameInfoMap[game.appid];
        return acc;
      }, {} as Record<string, ExtendedGameInfo>),
    };

  } catch (err) {
    console.log(err);
    return undefined;
  }
};

const userProfileData = Router();

userProfileData.get('/user/profileData', async (req, res) => {
  const { steamId } = req.query;

  if (!steamId) {
    res.status(400).json({ error: `Invalid steamId. Received: ${steamId}` });
    return;
  }

  if (typeof steamId !== 'string') {
    res.status(422).json({
      error: `Wrong type of steamId parameter. Passed type: ${typeof steamId}`,
    });
    return;
  }

  try {
    const data = await getUserProfileData(steamId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default userProfileData;