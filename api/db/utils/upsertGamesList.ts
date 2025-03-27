import { ExtendedGameInfo } from '@api/types/routes.types.js';
import { InferSchemaType } from 'mongoose';
import { GameInfo } from '../models/GameInfo.js';
import { DBResult } from './types/db.types.js';

export async function bulkUpsertGames(gamesArray: ExtendedGameInfo[], batchSize = 50) {
  try {
    const results: DBResult = {
      totalProcessed: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [],
    };

    for (let i = 0; i < gamesArray.length; i += batchSize) {
      const batch = gamesArray.slice(i, i + batchSize);
      const bulkOps = [];

      for (const game of batch) {
        try {
          const updateDoc: {
              $set: InferSchemaType<typeof GameInfo>,
              $setOnInsert: {
                  createdAt: Date,
              }
          } = {
            $set: {
              name: game.name,
              platforms: {
                windows: game.platforms?.windows || false,
                mac: game.platforms?.mac || false,
                linux: game.platforms?.linux || false,
              },
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
            },
            $setOnInsert: {
              createdAt: new Date(),
            },
          };

          // Handle nested arrays with proper schema structure
          if (game.categories) {
            (updateDoc.$set as any).categories = game.categories.map(cat => ({
              id: cat.id,
              description: cat.description,
            }));
          }

          if (game.genres) {
            (updateDoc.$set as any).genres = game.genres.map(genre => ({
              id: genre.id,
              description: genre.description,
            }));
          }

          if (game.screenshots) {
            (updateDoc.$set as any).screenshots = game.screenshots.map(ss => ({
              id: ss.id,
              pathThumbnail: ss.path_thumbnail,
              pathFull: ss.path_full,
            }));
          }

          if (game.movies) {
            (updateDoc.$set as any).movies = game.movies.map(movie => ({ //FIXME: improve types here
              id: movie.id,
              name: movie.name,
              thumbnail: movie.thumbnail,
              webm: movie.webm || { '480': '', max: '' },
              mp4: movie.mp4 || { '480': '', max: '' },
            }));
          }

          bulkOps.push({
            updateOne: {
              filter: { steamAppId: game.steam_appid },
              update: updateDoc,
              upsert: true,
            },
          });
        } catch (error: any) {
          results.errors.push({
            steamAppId: game.steam_appid,
            error: error.message ? error.message : 'Unknown error',
          });
          results.skipped++;
        }
      }

      // Execute bulk operation
      if (bulkOps.length > 0) {
        const batchResult = await GameInfo.bulkWrite(bulkOps as any, {
          ordered: false,
        });
        results.created += batchResult.upsertedCount;
        results.updated += batchResult.modifiedCount;
        results.totalProcessed += bulkOps.length;
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