import steamApi from '#server/clients/steamClients/steamApiClient';
import { Router } from 'express';

export type SteamLvl = Record<string, any>; //TODO: type to be fixed

/**
  * Parameters:
  * @param steamId user steam id
  */

export const getUserSteamLvl = async (steamId: string): Promise<SteamLvl> => {
  const params = {
    steamid: steamId,
    format: 'json',
  };

  const { data } = await steamApi.get('IPlayerService/GetSteamLevel/v0001/', {
    params,
  });
  return data;
};

const userSteamLvl = Router();

userSteamLvl.get('/user/steamLvl', async (req, res) => {
  const { steamId } = req.query;

  try {
    const data = await getUserSteamLvl(steamId as string);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default userSteamLvl;