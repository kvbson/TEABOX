import { getAllGames } from '#server/routes/GetAllGames';
import { SteamAppListResponse } from '#types/allGames.types';
import { AllGamesList } from '#db/models/AllGames';
import { handleFailedBatch } from '#db/utils/helpers/handleFailedBatch';
import { setTimeout } from 'node:timers/promises';

type UpsertAllGamesListParams = {
  limit: number;
  batchSize: number;
}

export async function upsertAllGamesList({ limit, batchSize = 150 }: UpsertAllGamesListParams) {
  const games = await getAllGames(limit);
  const result = await bulkUpsertAllGamesList({ batchSize, games });
  console.log(`Processed: ${result.totalProcessed};\n Upserted: ${result.upsertedCount};\n Modified ${result.modifiedCount};\n Errors: ${result.errorCount}`);
}

async function bulkUpsertAllGamesList({ batchSize, games: { applist: { apps } } }: Omit<UpsertAllGamesListParams, 'limit'> & { games: SteamAppListResponse },
) {
  let processed = 0;
  let upserted = 0;
  let modified = 0;
  let lastLogged = 0;
  const errors = [];

  for (let i = 0; i < apps.length; i += batchSize) {
    const batch = apps.slice(i, i + batchSize);

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

      processed += batch.length;
      upserted += result.upsertedCount;
      modified += result.modifiedCount;

      if (processed - lastLogged >= 5000 || i + batchSize >= apps.length) {
        const percent = ((i + batchSize) / apps.length * 100).toFixed(1);
        console.log(`Processed ${i + batchSize}/${apps.length} (${percent}%)`);
        lastLogged = processed;
      }
      if (i + batchSize < apps.length) {
        await setTimeout();
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      const retryResult = await handleFailedBatch(batch);
      if (!retryResult.success) {
        errors.push({
          batchRange: `${i}-${Math.min(i + batchSize, apps.length)}`,
          error: `Final failure after retries: ${errorMsg}`,
          retryErrors: retryResult.errors,
          sampleAppId: batch[0]?.appid,
        });
      } else {
        processed += batch.length;
        upserted += retryResult?.upsertedCount ?? 0;
        modified += retryResult?.modifiedCount ?? 0;
      }
    }
  }

  return {
    totalProcessed: processed,
    upsertedCount: upserted,
    modifiedCount: modified,
    errorCount: errors.length,
    errors,
  };
}