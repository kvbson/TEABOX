import { Router } from 'express';
import steamApi from '#server/clients/steamClients/steamApiClient';
import { getMissingIds } from '../db/GetMissingIds.js';
/**
  * Parameters:
  * @param steamId user steam id
  */
export const getUserOwnedGames = async (steamId) => {
    const params = {
        steamid: steamId,
        format: 'json',
        include_played_free_games: 'true',
        include_appinfo: 'true',
    };
    const { data } = await steamApi.get('IPlayerService/GetOwnedGames/v0001/', {
        params,
    });
    return data;
};
const userOwnedGames = Router();
userOwnedGames.get('/user/ownedGames', async (req, res) => {
    const { steamId } = req.query;
    try {
        const data = await getUserOwnedGames(steamId);
        const missingIds = (await getMissingIds()).map(el => el.appId);
        data.response.games = data.response.games.filter(data => !missingIds.includes(String(data.appid)));
        res.json({
            success: true,
            data,
        });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
export default userOwnedGames;
