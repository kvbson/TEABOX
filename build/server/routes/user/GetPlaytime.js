import steamApi from '#server/clients/steamClients/steamApiClient';
import { Router } from 'express';
/**
  * Parameters:
  * @param steamId user steam id
  * @param appId steam game id
  */
export const getUserPlaytime = async (steamId, appId) => {
    const params = {
        steamid: steamId,
        appid: appId,
        format: 'json',
    };
    const { data } = await steamApi.get('IPlayerService/GetSingleGamePlaytime/v0001/', {
        params,
    });
    return data;
};
const userPlaytime = Router();
userPlaytime.get('/user/playtime', async (req, res) => {
    const { steamId, appId } = req.query;
    try {
        const data = await getUserPlaytime(String(steamId), String(appId));
        res.json({
            success: true,
            data,
        });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
export default userPlaytime;
