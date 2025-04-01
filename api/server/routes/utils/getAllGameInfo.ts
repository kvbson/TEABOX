import { GamesObj } from '#api/types/gameInfo.types';
// import PQueue from 'p-queue';
import { getGameDetails, getReviews } from '../GetGameInfo.js';
import { GameInfo, GameInfoSchemaType } from '#api/db/models/GameInfo';
import { Reviews, ReviewsSchemaType } from '#api/db/models/Reviews';
import Bottleneck from 'bottleneck';
import { getGameParams } from '#api/db/utils/params/getGameParams';
import { parseReviewData } from '#api/db/utils/params/getReviewParams';

const gameQueue = new Bottleneck({
  maxConcurrent: 5, // Allow up to 5 parallel game requests
  minTime: 1500, // Space out requests by at least 200ms
});

const reviewQueue = new Bottleneck({
  maxConcurrent: 5, // Allow up to 5 parallel review requests
  minTime: 1500, // Space out requests by at least 200ms
});

// const concurrency = 2;
const failedIds = [];
// const queue = new PQueue({
//   interval: 2000,
//   intervalCap: 1,
//   carryoverConcurrencyCount: true,
//   concurrency,
// });

const getMissingDetails = async (missingGameIds: number[], missingReviewIds: number[]) => {
  return await Promise.all([
    // Fetch missing games
    Promise.all(missingGameIds.map(async (id) => {
      try {
        const gameDetails = await gameQueue.schedule(() =>
          retry(async () => {
            const res = await getGameDetails(id);
            if (!res?.data || !res.success) throw new Error(`Invalid response: ${JSON.stringify(res.data)}`);
            return res.data;
          }, { retries: 3, minTimeout: 2000, factor: 2 }),
        );
        return { id: String(id), gameDetails };
      } catch (error) {
        console.error(`Failed game ${id} after 3 retries:`, error);
        failedIds.push(id);
        return null;
      }
    })),

    // Fetch missing reviews
    Promise.all(missingReviewIds.map(async (id) => {
      try {
        const reviews = await reviewQueue.schedule(() =>
          retry(async () => {
            const res = await getReviews(id);
            if (!res?.reviews || !res.success) throw new Error(`Invalid response: ${JSON.stringify(res)}`);
            return res.reviews;
          }, { retries: 3, minTimeout: 2000, factor: 2 }),
        );
        return { id: String(id), reviews };
      } catch (error) {
        console.error(`Failed reviews for game ${id} after 3 retries:`, error);
        failedIds.push(id);
        return null;
      }
    })),
  ]);
};

export const getAllGameInfo = async (ids: number[]): Promise<{
    games: GamesObj;
    failedIds: number[];
  }> => {
  const results: GamesObj = {};
  const failedIds: number[] = [];
  const batchSize = 100;

  // Process in batches for better memory management
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    // Search for game in DB if not found create it
    const [existingGames, existingReviews] = await Promise.all([
      GameInfo.find({ steam_appid: { $in: batch } }) as Promise<GameInfoSchemaType[]>,
      Reviews.find({ steam_appid: { $in: batch } }) as Promise<ReviewsSchemaType[]>,
    ]);

    // Create maps for quick lookup
    const gamesMap = new Map(existingGames.map(g => [String(g.steam_appid), g]));
    const reviewsMap = new Map(existingReviews.map(r => [String(r.steam_appid), r]));

    // Find missing games & reviews
    const missingGameIds = batch.filter(id => !gamesMap.has(String(id)));
    const missingReviewIds = batch.filter(id => !reviewsMap.has(String(id)));

    // Fetch missing games
    const [gamesToAdd, reviewsToAdd] = await getMissingDetails(missingGameIds, missingReviewIds);

    // Remove failed fetches
    const validGames = gamesToAdd.filter(g => !!g?.gameDetails);
    const validReviews = reviewsToAdd.filter(r => !!r?.reviews);
    //FIXME: zły typ w validReviews zły obiekt wysyłany
    // Insert new games & reviews
    if (validGames.length > 0) await GameInfo.insertMany(validGames.map(g => g!.gameDetails));
    if (validReviews.length > 0) await Reviews.insertMany(validReviews.map(r => parseReviewData(r?.reviews, r!.id)));

    // Add existing games & reviews
    for (const game of existingGames) {
      const appId = String(game.steam_appid);
      results[appId] = {
        ...results[appId],
        gameDetails: {
          data: getGameParams(game),
          success: true,
        },
        appId,
      };
    }

    const uniqueReviewAppIds = new Set(existingReviews.map(el => String(el.steam_appid)).filter(Boolean));
    for (const appId of uniqueReviewAppIds) {
      const reviewsForApp = existingReviews.filter(el => String(el.steam_appid) === appId);
      // Initialize reviews if not already present
      if (!results[appId]) {
        results[appId] = { appId, gameDetails: { success: false }, reviews: { reviews: reviewsForApp, success: true } };
      } else {
        results[appId].reviews.reviews.push(...reviewsForApp);
      }
    }

    // Add newly fetched games & reviews
    for (const game of validGames) {
      if (!game) {
        continue;
      }
      if (!results[game.id]) {
        results[game.id] = { gameDetails: { success: true, data: game.gameDetails }, reviews: { success: false, reviews: [] }, appId: game.id };
      } else {
        results[game.id].gameDetails = { success: true, data: game.gameDetails };
      }
    }
    // Add newly fetched games & reviews
    for (const review of validReviews) {
      if (!review) {
        continue;
      }
      if (!results[review.id]) {
        results[review.id] = { gameDetails: { success: false }, reviews: { success: true, reviews: review.reviews }, appId: review.id };
      } else {
        results[review.id].reviews.reviews.push(...review.reviews);
      }
    }

    console.log(`Processed batch ${i / batchSize + 1}/${Math.ceil(ids.length / batchSize)}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return { games: results, failedIds };
};

const retry = async <T>(
  fn: () => Promise<T>,
  options: { retries: number; minTimeout: number; factor: number },
) => {
  let attempt = 0;
  while (attempt <= options.retries) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === options.retries) throw error;
      const timeout = options.minTimeout * (options.factor ** attempt);
      await new Promise(resolve => setTimeout(resolve, timeout));
      attempt++;
    }
  }
  throw new Error('Max retries exceeded');
};