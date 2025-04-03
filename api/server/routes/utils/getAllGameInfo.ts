import { GamesObj } from '#api/types/gameInfo.types';
// import PQueue from 'p-queue';
import { GameInfo, GameInfoSchemaType } from '#api/db/models/GameInfo';
import { Reviews, ReviewsSchemaType } from '#api/db/models/Reviews';
import { getGameParams } from '#api/db/utils/params/getGameParams';
import { parseReviewData } from '#api/db/utils/params/getReviewParams';
import Bottleneck from 'bottleneck';
import { AnyBulkWriteOperation } from 'mongoose';
import { getGameDetails, getReviews } from '../GetGameInfo.js';
import { handleFailedAppId, handleFailedReviewAppId, MissingApp, MissingReviewApp } from '#api/db/models/other/MissingAppIds';

const gameQueue = new Bottleneck({
  maxConcurrent: 5, // Allow up to 5 parallel game requests
  minTime: 1500, // Space out requests by at least 200ms
});

const reviewQueue = new Bottleneck({
  maxConcurrent: 5, // Allow up to 5 parallel review requests
  minTime: 1500, // Space out requests by at least 200ms
});

const failedIds = new Set<string | number>([]);

const getMissingDetails = async (missingGameIds: number[], missingReviewIds: number[]) => {
  return await Promise.all([
    // Fetch missing games
    Promise.all(missingGameIds.map(async (id) => {
      try {
        const gameDetails = await gameQueue.schedule(async () => {
          return retry(async () => { // Ensure this function returns a value
            const res = await getGameDetails(id);
            if (!res?.data || !res.success) {
              await handleFailedAppId(String(id));
              throw new Error(`Invalid response: ${JSON.stringify(res.data)}`);
            }
            return res.data;
          }, { retries: 2, minTimeout: 500, factor: 1 });
        });

        return { id: String(id), gameDetails };
      } catch (error) {
        console.error(`Failed game ${id}:`, error);
        failedIds.add(id);
        return null;
      }
    })),

    // Fetch missing reviews
    Promise.all(missingReviewIds.map(async (id) => {
      try {
        const reviews = await reviewQueue.schedule(async () => {
          return retry(async () => {
            const res = await getReviews(id);
            if (!res?.reviews || !res.success || res.query_summary?.num_reviews === 0) {
              handleFailedReviewAppId(String(id));
              throw new Error(`Invalid response: ${JSON.stringify(res)}`);
            }
            return res.reviews;
          }, { retries: 2, minTimeout: 500, factor: 1 });
        },
        );
        return { id: String(id), reviews };
      } catch (error) {
        console.error(`Failed reviews for game ${id}:`, error);
        failedIds.add(id);
        return null;
      }
    })),
  ]);
};
//FIXME: do weryfikacji brakujące id z steamApi
export const getAllGameInfo = async (ids: number[]): Promise<{
    games: GamesObj;
    failedIds: Set<string | number>;
  }> => {
  failedIds.clear();
  const results: GamesObj = {};
  const batchSize = 200;

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

    // not existing ids
    const bannedIds = [{ appId: 412020 }, { appId: 1449560 }];
    const notExistingAppIds = ([...await MissingApp.find({ confirmed: true }), ...bannedIds]).map(app => app.appId && String(app.appId)).filter(Boolean);
    const notExistingReviewAppIds = (await MissingReviewApp.find({ confirmed: true })).map(app => app.appId && String(app.appId)).filter(Boolean);

    // Find missing games & reviews
    const missingGameIds = batch.filter(id => !gamesMap.has(String(id)) && !notExistingAppIds.includes(String(id)));
    const missingReviewIds = batch.filter(id => !reviewsMap.has(String(id)) && !notExistingReviewAppIds.includes(String(id)));

    // Fetch missing games
    const [gamesToAdd, reviewsToAdd] = await getMissingDetails(missingGameIds, missingReviewIds);

    // Remove failed fetches
    const validGames = gamesToAdd.filter(g => {
      if (!g?.gameDetails && g?.id) {
        failedIds.add(g.id);
      }
      return !!g?.gameDetails;
    });
    const validReviews = reviewsToAdd.filter(r => {
      if (!r?.reviews.length && r?.id) {
        failedIds.add(r.id);
      }
      return !!r?.reviews.length;
    });

    // Insert new games & reviews
    if (validGames.length > 0) {
      const bulkOps = validGames.map(g => {
        if (!g) {
          return null;
        }
        return {
          updateOne: {
            filter: { steam_appid: g.id },
            update: { $set: g.gameDetails },
            upsert: true,
          },
        };
      }).filter(Boolean) as AnyBulkWriteOperation[];
      try {
        await GameInfo.bulkWrite(bulkOps, { ordered: false });
      } catch (err: any) {
        if (err?.code === 11000) {
          console.warn('Duplicate reviews detected, skipped insertion:', err.message);
        } else {
          throw err;
        }
      }
    }
    if (validReviews.length > 0) {
      try {
        const bulkOps = validReviews.flatMap(review => {
          if (!review?.reviews?.length) return [];

          return review.reviews.map(r => ({
            updateOne: {
              filter: {
                steam_appid: review.id,
                recommendationid: r.recommendationid,
              },
              update: { $set: parseReviewData(r, review.id) },
              upsert: true,
            },
          }));
        }).filter(Boolean);

        if (bulkOps.length > 0) {
          await Reviews.bulkWrite(bulkOps, { ordered: false });
        }
      } catch (err: any) {
        if (err?.code === 11000) {
          console.warn('Duplicate reviews detected, skipped insertion:', err.message);
        } else {
          throw err;
        }
      }
    }

    // Add existing games & reviews
    for (const game of existingGames) {
      const appId = String(game.steam_appid);
      results[appId] = {
        ...(results[appId] || {}),
        gameDetails: {
          data: getGameParams(game),
          success: true,
        },
        appId,
      };
    }

    // Process existing reviews
    const uniqueReviewAppIds = new Set(
      existingReviews.map(el => String(el.steam_appid)).filter(Boolean),
    );

    for (const appId of uniqueReviewAppIds) {
      if (!results[appId]) {
        results[appId] = { appId, gameDetails: { success: false }, reviews: { reviews: [], success: false } };
      }

      const reviewsForApp = existingReviews.filter(el =>
        String(el.steam_appid) === appId,
      );

      if (!results[appId].reviews?.reviews || results[appId].reviews.reviews.length === 0) {
        results[appId].reviews = {
          reviews: reviewsForApp,
          success: true,
        };
      } else {
        results[appId].reviews.reviews.push(...reviewsForApp);
      }
    }

    // Add newly fetched games
    for (const game of validGames) {
      if (!game) continue;

      if (!results[game.id]) {
        results[game.id] = {
          gameDetails: {
            success: true,
            data: game.gameDetails,
          },
          reviews: {
            success: false,
            reviews: [],
          },
          appId: game.id,
        };
      } else {
        results[game.id].gameDetails = {
          success: true,
          data: game.gameDetails,
        };
      }
    }

    // Add newly fetched reviews
    for (const review of validReviews) {
      if (!review) continue;

      if (!results[review.id]) {
        results[review.id] = {
          appId: review.id,
          reviews: {
            success: true,
            reviews: review.reviews,
          },
          gameDetails: { success: false },
        };
      } else {
        if (!results[review.id].reviews) {
          results[review.id].reviews = {
            success: true,
            reviews: review.reviews,
          };
        } else {
          results[review.id].reviews!.reviews.push(...review.reviews);
        }
      }
    }

    console.log(`Processed batch ${i / batchSize + 1}/${Math.ceil(ids.length / batchSize)}`);
    // await new Promise(resolve => setTimeout(resolve, 100));
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