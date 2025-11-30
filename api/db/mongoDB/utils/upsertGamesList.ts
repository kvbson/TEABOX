import { GameInfo } from '../models/GameInfo.js';
import { AnyBulkWriteOperation } from 'mongoose';
import { parseGameData } from './params/parseGameData.js';
import { handleFailedBatch } from './helpers/handleFailedBatch.js';
import { ExtendedGameInfo } from '../../types/gameInfo.types.js';

export async function bulkUpsertGames(gamesArray: ExtendedGameInfo[], batchSize = 50) {
  try {
    const results: Record<string, any> = {
      totalProcessed: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [],
    };

    for (let i = 0; i < gamesArray.length; i += batchSize) {
      const batch = gamesArray.slice(i, i + batchSize);
      const bulkOps: AnyBulkWriteOperation[] = [];

      for (const game of batch) {
        const gameParams = parseGameData(game, 'db');
        try {
          const gameDoc = new GameInfo(gameParams);

          const updateDoc = gameDoc.toObject();

          bulkOps.push({
            updateOne: {
              filter: { steam_appid: game.steam_appid },
              update: {
                $set: updateDoc,
              },
              upsert: true,
            },
          });
        } catch (error: any) {
          results.errors.push({
            steamAppId: game.steam_appid,
            error: error.message || 'Unknown error',
          });
          results.skipped++;
        }
      }

      if (bulkOps.length > 0) {
        try {
          const batchResult = await GameInfo.bulkWrite(bulkOps, { ordered: false });
          if (batchResult.hasWriteErrors()) {
            console.log(batchResult.getWriteErrors());
            batchResult.getWriteErrors().forEach((writeError) => {
              const failedOp = bulkOps[writeError.index] as any;
              console.log(failedOp); //TODO: finish
              // if (!failedOp) {

              // }
              results.errors.push({
                steamAppId: failedOp?.updateOne.filter.steam_appid ?? null, //no type
                error: writeError.errmsg || 'Unknown bulk write error',
              });
              handleFailedBatch([ { appid: failedOp?.updateOne.filter.steam_appid, name: failedOp?.updateOne.filter.name }], 100);
              results.skipped++;
            });
          }

          results.created += batchResult.upsertedCount;
          results.updated += batchResult.modifiedCount;
          results.totalProcessed += bulkOps.length;
        } catch (error: any) {
          console.error('Batch upsert failed:', error);
          results.errors.push({
            error: error.message || 'Unknown batch error',
            code: 'BATCH_OPERATION_FAILED',
          });
          results.skipped += bulkOps.length;
        }
      }
    }

    return {
      success: results.errors.length === 0,
      ...results,
      processedCount: results.created + results.updated,
    };
  } catch (error) {
    console.error('Bulk upsert failed:', error);
    return {
      success: false,
      error: (error as any)?.message || 'Unknown DB bulk upsert error',
      code: 'BULK_UPSERT_FAILED',
    };
  }
}