import { Router } from 'express';
import { fetchSteamData } from '../../utils/fetchSteamData';

 /**
  * Parameters:
  * @param steamId user steam id
  * @param appId game id
  */

const userPlaytime = Router();

userPlaytime.get('/user/playtime/:steamId/:appId', async (req, res) => {
  const { steamId, appId } = req.params;
  const params = {
    steamid: steamId,
    appid: appId,
    format: 'json',
  };

  try {
    const data = await fetchSteamData('IPlayerService/GetSingleGamePlaytime/v0001/', params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default userPlaytime;