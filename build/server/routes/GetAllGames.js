import steamApi from '#server/clients/steamClients/steamApiClient';
import { Router } from 'express';
export const getAllGames = async (limit = 10000) => {
    const params = {
        key: undefined,
        format: 'json',
        limit,
    };
    const { data } = await steamApi.get('ISteamApps/GetAppList/v2/', { params });
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
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
export default allGames;
