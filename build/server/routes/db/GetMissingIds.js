import { MissingApp } from '#api/db/models/other/MissingAppIds';
import { Router } from 'express';
const missingIds = Router();
export const getMissingIds = async () => await MissingApp.find({ confirmed: true });
missingIds.get('/missingIds', async (_, res) => {
    try {
        const data = await getMissingIds();
        if (data.length > 0) {
            res.json({
                success: true,
                data,
            });
        }
        else {
            res.status(404).json({ error: 'No missing ids found' });
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
export default missingIds;
