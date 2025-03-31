import { GamesObj } from '#api/types/gameInfo.types';
import PQueue from 'p-queue';
import { getGameInfo } from '../GetGameInfo.js';

const getFullGameDetails = async (appid: number) => {
  if (!appid && appid !== 0) {
    return;
  }
  return await getGameInfo(appid);
};

export const mapGames = async (ids: number[]): Promise<{
    games: GamesObj;
    failedIds: number[];
  }> => {
  const results: GamesObj = {};
  const failedIds: number[] = [];
  const concurrency = 1;
  const batchSize = 100;

  const queue = new PQueue({
    interval: 2000,
    intervalCap: 1,
    carryoverConcurrencyCount: true,
    concurrency,
  });

  // Process in batches for better memory management
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);

    await Promise.allSettled(batch.map(async (id) => {
      try {
        const gameData = await queue.add(async () => {
          // Enhanced retry with exponential backoff
          return retry(async () => {
            const data = await getFullGameDetails(id);
            if (!data?.appId) throw new Error('Invalid response');
            return data;
          }, {
            retries: 3,
            minTimeout: 2000,
            factor: 2,
          });
        });
        if (gameData) results[gameData.appId] = gameData;
      } catch (error) {
        console.error(`Failed game ${id} after 3 retries:`, error);
        failedIds.push(id);
      }
    }));

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