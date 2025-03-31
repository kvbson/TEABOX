import { GameInfo } from '../models/GameInfo.js';
import { ExtendedGameInfo } from '#api/types/gameInfo.types';
import { AnyBulkWriteOperation } from 'mongoose';

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
        try {
          const gameDoc = new GameInfo({
            steamAppId: game.steam_appid,
            name: game.name,
            platforms: game.platforms || {},
            shortDescription: game.short_description,
            detailedDescription: game.detailed_description,
            isFree: game.is_free || false,
            controllerSupport: game.controller_support,
            aboutTheGame: game.about_the_game,
            supportedLanguages: game.supported_languages,
            pcRequirements: game.pc_requirements || {},
            macRequirements: game.mac_requirements || {},
            linuxRequirements: game.linux_requirements || {},
            developers: game.developers || [],
            publishers: game.publishers || [],
            metacritic: game.metacritic || {},
            releaseDate: game.release_date.date ? new Date(game.release_date.date) : null,
            appUrl: game.app_url || `https://store.steampowered.com/app/${game.steam_appid}`,
            price: game.price_overview || {},
            categories: game.categories?.map(cat => ({ id: cat.id, description: cat.description })) || [],
            genres: game.genres?.map(genre => ({ id: genre.id, description: genre.description })) || [],
            screenshots: game.screenshots?.map(ss => ({ id: ss.id, pathThumbnail: ss.path_thumbnail, pathFull: ss.path_full })) || [],
            movies: game.movies?.map(movie => ({
              id: movie.id,
              name: movie.name,
              thumbnail: movie.thumbnail,
              webm: movie.webm || { '480': '', max: '' },
              mp4: movie.mp4 || { '480': '', max: '' },
            })) || [],
          });

          const updateDoc = gameDoc.toObject();

          bulkOps.push({
            updateOne: {
              filter: { steamAppId: game.steam_appid },
              update: {
                $set: updateDoc,
                $setOnInsert: { createdAt: new Date() },
                $currentDate: { updatedAt: true },
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
              console.log(failedOp);
              // if (!failedOp) {
                
              // }
              results.errors.push({
                steamAppId: failedOp?.updateOne.filter.steam_appid ?? null, //no type
                error: writeError.errmsg || 'Unknown bulk write error',
              });
              // handleFailedBatch([ { appid: failedOp?.updateOne.filter.steam_appid, name: failedOp?.updateOne.filter.name }], 100)
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