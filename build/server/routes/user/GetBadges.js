import steamApi from '#server/clients/steamClients/steamApiClient';
import { Router } from 'express';
/**
  * Parameters:
  * @param steamId user steam id
  */
export const getUserBadges = async (steamId) => {
    const params = {
        steamid: steamId,
        format: 'json',
    };
    const { data } = await steamApi.get('IPlayerService/GetBadges/v0001/', {
        params,
    });
    return data;
};
const userBadges = Router();
userBadges.get('/user/badges', async (req, res) => {
    const { steamId } = req.query;
    try {
        const data = await getUserBadges(steamId);
        res.json({
            success: true,
            data,
        });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
export default userBadges;
