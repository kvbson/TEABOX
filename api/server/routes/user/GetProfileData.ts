import { GamesObj } from '#api/types/gameInfo.types';
import { Router } from 'express';
import { getTags } from '../GetTags.js';
import { getAllGameInfo } from '../utils/getAllGameInfo.js';
import { BadgeStats, getUserBadges } from './GetBadges.js';
import { getUserOwnedGames } from './GetOwnedGames.js';
import { getUserRecentGames } from './GetRecentGames.js';

export type UserProfileData = {
    recentGames: GamesObj;
    ownedGames: GamesObj;
    tags: string[];
    badges: BadgeStats['response'];
    errors: any[];
}

export const NOT_EXISTING_APP_IDS = [397080, 205100, 202090, 200110];

const getUserProfileData = async (steamId: string, dataLimit: number): Promise<UserProfileData | undefined> => {
  try {
    const profileData: UserProfileData = {
      ownedGames: {},
      recentGames: {},
      tags: [],
      errors: [],
      badges: {},
    };
    const [recentGames, ownedGames] = await Promise.all([
      getUserRecentGames(steamId),
      getUserOwnedGames(steamId),
    ]);
    const allAppIds = [
      ...new Set<number>([
        ...(recentGames?.response.games?.map(g => g?.appid) ?? []),
        ...(ownedGames?.response.games?.map(g => g?.appid) ?? []),
      ]),
    ].slice(0, dataLimit > 0 ? dataLimit : undefined).filter((id): id is number => Number.isInteger(id) && !NOT_EXISTING_APP_IDS.includes(Number(id)));

    if (allAppIds.length === 0) {
      return { ...profileData, errors: ['No valid app IDs found'] };
    }

    //recent/owned games
    const { games } = await getAllGameInfo(allAppIds);

    for (const [appId, game] of Object.entries(games ?? {})) {
      const possibleRecentGame = recentGames.response.games?.find(el => String(el.appid) === String(appId));
      if (possibleRecentGame) {
        profileData.recentGames[appId] = {
          ...game,
          playtime_forever: possibleRecentGame.playtime_forever,
          playtime_2weeks: possibleRecentGame.playtime_2weeks,
          name: possibleRecentGame.name,
        };
      }
      const possibleOwnedGame = ownedGames.response.games?.find(el => String(el.appid) === String(appId));
      if (possibleOwnedGame) {
        profileData.ownedGames[appId] = {
          ...game,
          playtime_2weeks: possibleOwnedGame.playtime_2weeks,
          playtime_forever: possibleOwnedGame.playtime_forever,
          name: possibleOwnedGame.name,
        };
      }
    }

    //tags
    profileData.tags = await getTags() as string[];

    //steamLvl and badges
    profileData.badges = (await getUserBadges(steamId)).response;

    return profileData;

  } catch (err) {
    console.log(err);
    return undefined;
  }
};

const userProfileData = Router();

userProfileData.get('/user/profileData', async (req, res) => {
  const { steamId, dataLimit = 100 } = req.query;

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

  if (!dataLimit || isNaN(Number(dataLimit))) {
    res.status(400).json({ error: `Invalid dataLimit. Received: ${dataLimit}` });
    return;
  }

  try {
    const data = await getUserProfileData(steamId, Number(dataLimit));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default userProfileData;
