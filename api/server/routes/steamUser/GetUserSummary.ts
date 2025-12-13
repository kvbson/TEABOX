import { Router } from 'express';
import steamApi from '../../clients/steamClients/steamApiClient.js';

export type SteamUserSummary = {
  personaname: string;
  avatarfull: string;
  profileurl: string;
};

export const getUserSummary = async (steamId: string) => {
  const params = {
    steamids: steamId,
    format: 'json',
  };

  const { data } = await steamApi.get('ISteamUser/GetPlayerSummaries/v2/', {
    params,
  });
  const player = data?.response?.players?.[0];
  if (!player) return null;
  return {
    personaname: player.personaname,
    avatarfull: player.avatarfull,
    profileurl: player.profileurl,
  };
};

const userSummary = Router();

userSummary.get('/user/summary', async (req, res) => {
  const { steamId } = req.query;

  try {
    const data = await getUserSummary (String(steamId));
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default userSummary;