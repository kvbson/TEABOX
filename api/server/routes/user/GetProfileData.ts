import { Router } from 'express';
import { getUserRecentGames } from './GetRecentGames.js';
import { getUserOwnedGames } from './GetOwnedGames.js';

type GameInfo = {
    appid: number;
    name: string;
    playtime_forever: number;
    playtime_2weeks?: number;
    img_icon_url: string;
}

//TODO: typ do dokończenia
type UserProfileData = {
    recentGames: { response: { total_count: number, games: GameInfo[] }};
    ownedGames: { response: { game_count: number, games: GameInfo[] }};
}

/**
  * Parameters:
  * @param steamId user steam id
  */

const getUserProfileData = async (steamId: string): Promise<UserProfileData | undefined> => {
  try {
    const [recentGames, ownedGames] = await Promise.all([getUserRecentGames(steamId), getUserOwnedGames(steamId)]);
    return {
      ownedGames,
      recentGames,
    };
  } catch (err) {
    console.log(err);
  }

};

const userProfileData = Router();

userProfileData.get('/user/profileData', async (req, res) => {
  const { steamId } = req.query;

  if (!steamId) {
    res.status(400).json({ error: `Invalid steamId. Recieved: ${steamId}` });
    return;
  }
  if (typeof steamId !== 'string') {
    res.status(422).json({ error: `Wrong type of steamId parameter.
       Passed parameter type: ${typeof steamId}. Value: ${steamId}` });
    return;
  }

  try {
    const data = await getUserProfileData(steamId as string);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default userProfileData;