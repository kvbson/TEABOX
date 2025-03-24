import { Router } from 'express';
import steamStoreApi from '../clients/steamClients/steamStoreApiClient.js';

/**
  * Parameters:
  * @param appids game id
  */

export const getGameInfo = async (appId: string | number) => {
  const params = {
    appids: appId,
    format: 'json',
  };

  const { data } = await steamStoreApi.get('appdetails', {
    params,
  });
  return data;
};

const gameInfo = Router();

gameInfo.get('/gameInfo', async (req, res) => {
  const { appId } = req.query;

  try {
    const data = await getGameInfo(appId as string);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default gameInfo;