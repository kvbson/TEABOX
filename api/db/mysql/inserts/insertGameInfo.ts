import { GameInfoSchemaType } from '../../mongoDB/models/GameInfo.js';
import { getMySqlPool } from '../connections.js';
import { insertInBatches } from '../utils/batchingLoop.js';
import { normalizeValue, boolToInt, parse10Int } from '../utils/functions.js';

export async function insertGameInfo(game: GameInfoSchemaType) {
  if (!game || game.steam_appid == null) {
    console.warn('Skipping invalid game info:', game);
    return;
  }
  const pool = await getMySqlPool();
  // 1. Main table
  await pool.query(
    'REPLACE INTO game_info SET ?',
    [{
      steam_appid: parse10Int(game.steam_appid),
      name: normalizeValue(game.name),
      short_description: normalizeValue(game.short_description),
      detailed_description: normalizeValue(game.detailed_description),
      is_free: boolToInt(game.is_free),
      platform_windows: boolToInt(game.platforms?.windows),
      platform_mac: boolToInt(game.platforms?.mac),
      platform_linux: boolToInt(game.platforms?.linux),
      header_image: normalizeValue(game.header_image),
      capsule_image: normalizeValue(game.capsule_image),
      blur_image: normalizeValue(game.blur_image),
      website: normalizeValue(game.website),
      controller_support: normalizeValue(game.controller_support),
      about_the_game: normalizeValue(game.about_the_game),
      supported_languages: normalizeValue(game.supported_languages),
      background: normalizeValue(game.background),
      required_age: normalizeValue(game.required_age),
      pc_minimum: normalizeValue(game.pc_requirements?.minimum),
      pc_recommended: normalizeValue(game.pc_requirements?.recommended),
      mac_minimum: normalizeValue(game.mac_requirements?.minimum),
      mac_recommended: normalizeValue(game.mac_requirements?.recommended),
      linux_minimum: normalizeValue(game.linux_requirements?.minimum),
      linux_recommended: normalizeValue(game.linux_requirements?.recommended),
      release_coming_soon: boolToInt(game.release_date?.coming_soon),
      release_date: game.release_date?.date ? new Date(game.release_date.date) : null,
      app_url: normalizeValue(game.app_url),
      price_currency: normalizeValue(game.price_overview?.currency),
      price_initial: normalizeValue(parse10Int(game.price_overview?.initial)),
      price_final: normalizeValue(parse10Int(game.price_overview?.final)),
      price_initial_formatted: normalizeValue(game.price_overview?.initial_formatted),
      price_final_formatted: normalizeValue(game.price_overview?.final_formatted),
      price_discount_percent: normalizeValue(game.price_overview?.discount_percent),
    }],
  );

  // 2. Child tables (delete old → insert new)
  await pool.query('DELETE FROM game_categories WHERE steam_appid = ?', [game.steam_appid]);
  await pool.query('DELETE FROM game_genres WHERE steam_appid = ?', [game.steam_appid]);
  await pool.query('DELETE FROM game_screenshots WHERE steam_appid = ?', [game.steam_appid]);
  await pool.query('DELETE FROM game_movies WHERE steam_appid = ?', [game.steam_appid]);
  await pool.query('DELETE FROM game_publishers WHERE steam_appid = ?', [game.steam_appid]);

  const childrensBatchSize = 10;
  // Categories
  await insertInBatches(game.categories || [], childrensBatchSize, cat =>
    pool.query('INSERT INTO game_categories SET ?', [{
      steam_appid: game.steam_appid,
      category_id: normalizeValue(cat.id),
      description: normalizeValue(cat.description),
    }]),
  );

  // Genres
  await insertInBatches(game.genres || [], childrensBatchSize, g =>
    pool.query('INSERT INTO game_genres SET ?', [{
      steam_appid: game.steam_appid,
      genre_id: normalizeValue(g.id),
      description: normalizeValue(g.description),
    }]),
  );

  // Screenshots
  await insertInBatches(game.screenshots || [], childrensBatchSize, sc =>
    pool.query('INSERT INTO game_screenshots SET ?', [{
      steam_appid: game.steam_appid,
      screenshot_id: normalizeValue(sc.id),
      path_thumbnail: normalizeValue(sc.path_thumbnail),
      path_full: normalizeValue(sc.path_full),
    }]),
  );

  // Movies
  await insertInBatches(game.movies || [], childrensBatchSize, m =>
    pool.query('INSERT INTO game_movies SET ?', [{
      steam_appid: game.steam_appid,
      movie_id: normalizeValue(m.id),
      name: normalizeValue(m.name),
      thumbnail: normalizeValue(m.thumbnail),
      webm_480: normalizeValue(m.webm?.['480']),
      webm_max: normalizeValue(m.webm?.max),
      mp4_480: normalizeValue(m.mp4?.['480']),
      mp4_max: normalizeValue(m.mp4?.max),
    }]),
  );

  // Publishers
  await insertInBatches(game.publishers || [], childrensBatchSize, publisherName => {
    if (!publisherName) return Promise.resolve();
    return pool.query('INSERT INTO game_publishers SET ?', [{
      steam_appid: game.steam_appid,
      publisher_name: normalizeValue(publisherName),
    }]);
  },
  );

}
