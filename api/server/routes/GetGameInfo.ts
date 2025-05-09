import { ExtendedGameInfo, GameDetailsResponse, GamesObj } from '#types/gameInfo.types';
import { Router } from 'express';
import steamStoreApi from '#server/clients/steamClients/steamStoreApiClient';
import { SteamReviewsResponse } from '#api/types/reviews.types';
import { handleFailedAppId } from '#api/db/models/other/MissingAppIds';
import { checkAppId } from './utils/checkAppId.js';

/**
 * Parameters.
 * @param appids - An array of game IDs.
 * @param filter - The sorting filter:
 *   - `recent` - Sorted by creation time (most recent first).
 *   - `updated` - Sorted by last update time.
 *   - `all` (default) - Sorted using a sliding window protocol.
 */

export const getReviews = async (appId: string | number) => {
  const reviewParams = {
    json: 1,
    filter: 'recent',
    num_per_page: 10,
    language: 'english',
    key: undefined,
  };

  const result = await steamStoreApi.get<SteamReviewsResponse>(`appreviews/${appId}`, { params: reviewParams });
  return result.data as unknown as SteamReviewsResponse;
};

export const getGameDetails = async (appId: string | number) => {
  const params = {
    appids: appId,
    format: 'json',
    key: undefined,
  };

  const result = await steamStoreApi.get<{ success: boolean, data: ExtendedGameInfo }>('api/appdetails', {
    params,
  });
  return Object.values(result.data)[0] as unknown as GameDetailsResponse;
};

const getGameInfo = async (appId: string | number): Promise<GamesObj> => {
  const [reviews, gameDetails] = await Promise.all([getReviews(appId), getGameDetails(appId)]);
  return { [String(appId)]: { reviews: reviews as any, gameDetails, appId } };
};

const gameInfo = Router();

gameInfo.get('/gameInfo', async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(404).json({ error: `Wrong appId: Received: ${appId}` }) as any;
  }

  const { action } = await checkAppId(String(appId));
  if (action === 'skip') {
    return res.status(403).json({ error: `AppId banned - too many failed requests. Received: ${appId}` });
  }
  try {
    const data = await getGameInfo(String(appId));

    if (!data[String(appId)].gameDetails.success) {
      handleFailedAppId(String(appId));
      return res.status(404).json({
        error: 'No game details from steam API. Will be automatically blocked after 10 retries.',
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleFailedAppId(String(appId));
    res.status(500).json({ error });
  }
});

export default gameInfo;