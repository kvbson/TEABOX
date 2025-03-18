import { Router } from 'express';
import steamStoreApi from '../clients/steamClients/steamStoreApiClient.js';

/**
  * Parameters:
  * @param appId game id
  */

const gameData = Router();

gameData.get('/gameData/:appId', async (req, res) => {
  const { appId } = req.params;
  const params = {
    appid: appId,
  };
  const url = '/appdetails';
  try {
    const data = await steamStoreApi.get(url, { params });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default gameData;