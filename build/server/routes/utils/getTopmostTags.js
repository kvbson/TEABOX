import { Router } from 'express';
import { GameInfo } from '#api/db/models/GameInfo';
export async function getTopmostTags({ limit = 15 } = {}) {
    const pipeline = [
        { $unwind: '$genres' },
        { $group: { _id: '$genres.description', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
    ];
    const topGenres = await GameInfo.aggregate(pipeline);
    return topGenres.map(el => !el._id ? null : el._id).filter(el => el !== null);
}
const topmostTags = Router();
topmostTags.get('/topmostTags', async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    try {
        const tags = await getTopmostTags({ limit });
        res.json({
            success: true,
            data: tags,
        });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
export default topmostTags;
