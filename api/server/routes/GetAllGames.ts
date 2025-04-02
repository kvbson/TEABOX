import steamApi from '#server/clients/steamClients/steamApiClient';
import { SteamAppListResponse } from '#types/allGames.types';
import { Router } from 'express';

export const getAllGames = async ()=> {
  const params = {
    key: undefined,
    format: 'json',
  };

  const { data } = await steamApi.get<SteamAppListResponse>('ISteamApps/GetAppList/v2/', { params });
  return data;
};

const allGames = Router();

allGames.get('/allGames', async (_, res) => {
  try {
    const data = await getAllGames();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default allGames;