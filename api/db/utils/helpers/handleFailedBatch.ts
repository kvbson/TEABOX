
import { setTimeout } from 'timers/promises';
import { AnyBulkWriteOperation } from 'mongoose';
import { BasicGameInfo } from '../../../types/allGames.types.js';
import { AllGamesList } from '../../models/AllGames.js';

export async function handleFailedBatch(
  batch: BasicGameInfo[],
  initialDelay = 4,
  maxRetries = 3,
  backoffFactor = 2, //backoffFactor - kara za opóźnienie po każdej złej próbie
) {
  let retryCount = 0;
  let currentDelay = initialDelay;
  const batchErrors = [];

  while (batch && batch.length === 0 && retryCount < maxRetries) {
    try {
      const bulkOps: AnyBulkWriteOperation[] = batch.map(({ name, appid }) => ({
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