import { GameInfo } from '#api/db/models/GameInfo';
import { redisClient, setKeyWithTTL } from '#api/redis/redisClient';
import { Router } from 'express';
import { sortGameInfo } from '../utils/sortGameInfo.js';

const sortedGameInfo = Router();

export async function getSortedGameInfo(sidebarTags: string[]) {
  const games = await GameInfo.find({
    'genres.description': { $in: sidebarTags },
    //get games only with either some pros or cons
    $or: [
      { $expr: { $gt: [{ $size: { $ifNull: ['$pros', []] } }, 0] } },
      { $expr: { $gt: [{ $size: { $ifNull: ['$cons', []] } }, 0] } },
    ],
  });
  const sortedGames = sortGameInfo(games, sidebarTags);
  return sortedGames;
}

/*@ts-expect-error type error */
sortedGameInfo.get('/sortedGameInfo', async (req, res) => {
  if (!req.query.sidebarTags) {
    return res.status(400).json({
      success: false,
      message: `Invalid sidebarTags query parameter. Received: ${req.query.sidebarTags}`,
    });
  }

  const sidebarTags = decodeURIComponent(req.query.sidebarTags?.toString() ?? '');

  try {
    const parsedData = JSON.parse(sidebarTags);
    if (!Array.isArray(parsedData)) {
      return res.status(400).json({
        success: false,
        message: `Wrong type of sidebarTags parameter. Received: ${typeof parsedData}`,
      });
    }

    const cacheKey = `sortedGameInfo:${sidebarTags}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      res.json({ success: true, data });
      return;
    }

    const data = await getSortedGameInfo(parsedData);
    await setKeyWithTTL(cacheKey, JSON.stringify(data));

    if (data.length > 0) {
      return res.json({ success: true, data });
    }

    return res.status(404).json({
      success: false,
      message: 'No games found matching the selected genres',
      suggestion: 'Try different genre filters',
    });

  } catch (error) {
    console.error('Error fetching sorted game info:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default sortedGameInfo;