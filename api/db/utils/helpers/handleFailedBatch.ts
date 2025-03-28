import { BasicGameInfo } from '#types/allGames.types';
import { AllGamesList } from '#db/models/AllGames';
import { setTimeout } from 'timers/promises';

export async function handleFailedBatch(
  batch: BasicGameInfo[],
  initialDelay: number,
  maxRetries = 3,
  backoffFactor = 2,
) {
  let retryCount = 0;
  let currentDelay = initialDelay;
  const batchErrors = [];

  while (retryCount < maxRetries) {
    try {
      const bulkOps = batch.map(({ name, appid }) => ({
        updateOne: {
          filter: { steamAppId: appid },
          update: {
            $set: { name },
            $setOnInsert: { createdAt: new Date() },
          },
          upsert: true,
        },
      }));

      const result = await AllGamesList.bulkWrite(bulkOps, { ordered: false });
      return {
        success: true,
        upsertedCount: result.upsertedCount,
        modifiedCount: result.modifiedCount,
        retryCount,
      };
    } catch (error) {
      retryCount++;
      batchErrors.push({
        retry: retryCount,
        error: error instanceof Error ? error.message : String(error),
      });

      if (retryCount < maxRetries) {
        currentDelay *= backoffFactor;
        await setTimeout(currentDelay);
      }
    }
  }

  return {
    success: false,
    errors: batchErrors,
    sampleAppId: batch[0]?.appid,
  };
}