import { Router } from 'express';
import steamApi from '../../clients/steamClients/steamApiClient';

/**
  * Parameters:
  * @param steamId user steam id
  * @param appId game id
  */

const userPlaytime = Router();

userPlaytime.get('/user/playtime', async (req, res) => {
  const { steamId, appId } = req.query;
  const params = {
    steamid: steamId,
    appid: appId,
    format: 'json',
  };

  try {
    const { data } = await steamApi.get('IPlayerService/GetSingleGamePlaytime/v0001/', { params });
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default userPlaytime;