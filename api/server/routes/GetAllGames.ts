import { Router } from 'express';
import { SteamAppListResponse } from '../../types/allGames.types.js';
import steamApi from '../clients/steamClients/steamApiClient.js';

export const getAllGames = async (limit = 10000) => {
  const params = {
    key: undefined,
    format: 'json',
    limit,
  };

  const { data } = await steamApi.get<SteamAppListResponse>('ISteamApps/GetAppList/v2/', { params });
  return data;
};

const allGames = Router();

allGames.get('/allGames', async (req, res) => {
  const limit = parseInt(String(req.query.limit), 10) || undefined;

  try {
    const data = await getAllGames(limit);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default allGames;