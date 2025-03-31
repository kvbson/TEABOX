import { ExtendedGameInfo } from '#types/gameInfo.types';
import { SteamReviewsResponse } from '#types/reviews.types';
import { Router } from 'express';
import steamStoreApi from '#server/clients/steamClients/steamStoreApiClient';

/**
 * Parameters.
 * @param appids - An array of game IDs.
 * @param filter - The sorting filter:
 *   - `recent` - Sorted by creation time (most recent first).
 *   - `updated` - Sorted by last update time.
 *   - `all` (default) - Sorted using a sliding window protocol.
 */

const getReviews = async (appId: string | number) => {
  const reviewParams = {
    json: 1,
    filter: 'recent',
    num_per_page: 200,
    language: 'english',
    key: undefined,
  };

  return await steamStoreApi.get<SteamReviewsResponse>(`appreviews/${appId}`, { params: reviewParams });
};

const getGameDetails = async (appId: string | number) => {
  const params = {
    appids: appId,
    format: 'json',
    key: undefined,
  };

  return await steamStoreApi.get<{ success: boolean, data: ExtendedGameInfo }>('api/appdetails', {
    params,
  });
};

export const getGameInfo = async (appId: string | number) => {
  const [reviews, gameDetails] = await Promise.all([getReviews(appId), getGameDetails(appId)]);
  return { reviews: reviews, gameDetails: gameDetails, appId };
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