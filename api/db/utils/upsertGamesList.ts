// import { ExtendedGameInfo } from '@api/types/gameInfo.types.js';
// import { GameInfo } from '../models/GameInfo.js';
// import { DBResult } from './types/db.types.js';

// export async function bulkUpsertGames(gamesArray: ExtendedGameInfo[], batchSize = 50) {
//   try {
//     const results: DBResult = {
//       totalProcessed: 0,
//       created: 0,
//       updated: 0,
//       skipped: 0,
//       errors: [],
//     };

//     for (let i = 0; i < gamesArray.length; i += batchSize) {
//       const batch = gamesArray.slice(i, i + batchSize);
//       const bulkOps = [];

//       for (const game of batch) {
//         try {
//           const gameDoc = new GameInfo({
//             steamAppId: game.steam_appid,
//             name: game.name,
//             platforms: game.platforms || {},
//             shortDescription: game.short_description,
//             detailedDescription: game.detailed_description,
//             isFree: game.is_free || false,
//             controllerSupport: game.controller_support,
//             aboutTheGame: game.about_the_game,
//             supportedLanguages: game.supported_languages,
//             pcRequirements: game.pc_requirements || {},
//             macRequirements: game.mac_requirements || {},
//             linuxRequirements: game.linux_requirements || {},
//             developers: game.developers || [],
//             publishers: game.publishers || [],
//             metacritic: game.metacritic || {},
//             releaseDate: game.release_date.date ? new Date(game.release_date.date) : null,
//             appUrl: game.app_url || `https://store.steampowered.com/app/${game.steam_appid}`,
//             price: game.price_overview || {},
//             categories: game.categories?.map(cat => ({ id: cat.id, description: cat.description })) || [],
//             genres: game.genres?.map(genre => ({ id: genre.id, description: genre.description })) || [],
//             screenshots: game.screenshots?.map(ss => ({ id: ss.id, pathThumbnail: ss.path_thumbnail, pathFull: ss.path_full })) || [],
//             movies: game.movies?.map(movie => ({
//               id: movie.id,
//               name: movie.name,
//               thumbnail: movie.thumbnail,
//               webm: movie.webm || { '480': '', max: '' },
//               mp4: movie.mp4 || { '480': '', max: '' },
//             })) || [],
//           });

//           const updateDoc = gameDoc.toObject();

//           bulkOps.push({
//             updateOne: {
//               filter: { steamAppId: game.steam_appid },
//               update: { $set: updateDoc, $setOnInsert: { createdAt: new Date() } },
//               upsert: true,
//             },
//           });
//         } catch (error: any) {
//           results.errors.push({
//             steamAppId: game.steam_appid,
//             error: error.message ?? 'Unknown error',
//           });
//           results.skipped++;
//         }
//       }

//       // Execute bulk operation
//       if (bulkOps.length > 0) {
//         const batchResult = await GameInfo.bulkWrite(bulkOps as any, {
//           ordered: false,
//         });
//         results.created += batchResult.upsertedCount;
//         results.updated += batchResult.modifiedCount;
//         results.totalProcessed += bulkOps.length;
//       }
//     }

//     return {
//       success: results.errors.length === 0,
//       ...results,
//       processedCount: results.created + results.updated,
//     };
//   } catch (error) {
//     console.error('Bulk upsert failed:', error);
//     return {
//       success: false,
//       error: (error as any)?.message || 'Unknown DB bulk upsert error',
//       code: 'BULK_UPSERT_FAILED',
//     };
//   }
// }



// export async function syncGamesWithSteamAPI(
//   games: ExtendedGameInfo[],
//   batchSize = 50
// ): Promise<UpdateResult> {
//   const result: UpdateResult = {
//     success: true,
//     gameInfoStats: { created: 0, updated: 0, skipped: 0 },
//     allGamesListStats: { created: 0, skipped: 0 },
//     errors: [],
//   };

//   for (let i = 0; i < games.length; i += batchSize) {
//     const batch = games.slice(i, i + batchSize);
    
//     try {
//       // Process GameInfo updates first
//       const gameInfoUpdates = batch.map(game => ({
//         updateOne: {
//           filter: { steamAppId: game.steam_appid },
//           update: {
//             $set: {
//               name: game.name,
//               shortDescription: game.short_description,
//               // ... other fields from your existing bulkUpsertGames
//             },
//             $setOnInsert: { createdAt: new Date() }
//           },
//           upsert: true
//         }
//       }));

//       const gameInfoResult = await GameInfo.bulkWrite(gameInfoUpdates, { ordered: false });
//       result.gameInfoStats.created += gameInfoResult.upsertedCount;
//       result.gameInfoStats.updated += gameInfoResult.modifiedCount;

//       // Now process AllGamesList relationships
//       const gameInfoDocs = await GameInfo.find(
//         { steamAppId: { $in: batch.map(g => g.steam_appid) } },
//         { _id: 1, steamAppId: 1 }
//       );

//       const allGamesListUpdates = gameInfoDocs.map(gameInfo => ({
//         updateOne: {
//           filter: { steamAppId: gameInfo.steamAppId },
//           update: {
//             $setOnInsert: {
//               gameRef: gameInfo._id,
//               steamAppId: gameInfo.steamAppId,
//               createdAt: new Date()
//             }
//           },
//           upsert: true
//         }
//       }));

//       const allGamesListResult = await AllGamesList.bulkWrite(allGamesListUpdates, { ordered: false });
//       result.allGamesListStats.created += allGamesListResult.upsertedCount;

//     } catch (error) {
//       result.success = false;
//       result.errors.push({
//         steamAppId: 0, // or get from current game if available
//         error: error instanceof Error ? error.message : 'Unknown error'
//       });
//     }
//   }

//   return result;
// }