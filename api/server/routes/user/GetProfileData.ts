import { Tag } from '#api/db/models/Tags';
import { GamesObj } from '#api/types/gameInfo.types';
import { scrapeTags } from '#api/utils/scrapeTags';
import { Router } from 'express';
import { getAllGameInfo } from '../utils/getAllGameInfo.js';
import { getUserOwnedGames } from './GetOwnedGames.js';
import { getUserRecentGames } from './GetRecentGames.js';

export type UserProfileData = {
    recentGames: GamesObj;
    ownedGames: GamesObj;
    tags: string[];
    errors: any[];
}

const getTags = async () => {
  const tags = await Tag.find({}, { _id: 0, name: 1 });
  if (tags.length === 0) {
    return await scrapeTags() || [];
  }
  return tags;
};

const getUserProfileData = async (steamId: string): Promise<UserProfileData | undefined> => {
  try {
    const profileData: UserProfileData = {
      ownedGames: {},
      recentGames: {},
      tags: [],
      errors: [],
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
    ].filter((id): id is number => Number.isInteger(id));

    if (allAppIds.length === 0) {
      return { ...profileData, errors: ['No valid app IDs found'] };
    }

    //recent/owned games
    const { games } = await getAllGameInfo(allAppIds);

    for (const [appId, game] of Object.entries(games ?? {})) {
      const possibleRecentGame = recentGames.response.games.find(el => String(el.appid) === String(appId));
      if (possibleRecentGame) {
        profileData.recentGames[appId] = { ...game, ...possibleRecentGame };
      }
      const possibleOwnedGame = ownedGames.response.games.find(el => String(el.appid) === String(appId));
      if (possibleOwnedGame) {
        profileData.ownedGames[appId] = { ...game, ...possibleOwnedGame };
      }
    }

    //tags
    profileData.tags = await getTags() as string[];

    return profileData;

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
