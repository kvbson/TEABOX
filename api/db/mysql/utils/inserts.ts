import { GameInfoSchemaType } from '../../mongoDB/models/GameInfo.js';
import { getMySqlConnection } from '../connections.js';

export async function insertGameInfo(game: GameInfoSchemaType) {
  const conn = await getMySqlConnection();

  // 1. main table
  await conn.query(
    'REPLACE INTO game_info SET ?',
    [{
      steam_appid: game.steam_appid,
      name: game.name,
      short_description: game.short_description,
      detailed_description: game.detailed_description,
      is_free: game.is_free,
      platform_windows: game.platforms?.windows,
      platform_mac: game.platforms?.mac,
      platform_linux: game.platforms?.linux,
      header_image: game.header_image,
      capsule_image: game.capsule_image,
      blur_image: game.blur_image,
      website: game.website,
      controller_support: game.controller_support,
      about_the_game: game.about_the_game,
      supported_languages: game.supported_languages,
      background: game.background,
      required_age: game.required_age,
      pc_minimum: game.pc_requirements?.minimum,
      pc_recommended: game.pc_requirements?.recommended,
      mac_minimum: game.mac_requirements?.minimum,
      mac_recommended: game.mac_requirements?.recommended,
      linux_minimum: game.linux_requirements?.minimum,
      linux_recommended: game.linux_requirements?.recommended,
      release_coming_soon: game.release_date?.coming_soon,
      release_date: game.release_date?.date,
      app_url: game.app_url,
      price_currency: game.price_overview?.currency,
      price_initial: game.price_overview?.initial,
      price_final: game.price_overview?.final,
      price_initial_formatted: game.price_overview?.initial_formatted,
      price_final_formatted: game.price_overview?.final_formatted,
      price_discount_percent: game.price_overview?.discount_percent,
    }],
  );

  // 2. child tables (clear → reinsert)
  await conn.query('DELETE FROM game_categories WHERE appid = ?', [game.steam_appid]);
  await conn.query('DELETE FROM game_genres WHERE appid = ?', [game.steam_appid]);
  await conn.query('DELETE FROM game_screenshots WHERE appid = ?', [game.steam_appid]);
  await conn.query('DELETE FROM game_movies WHERE appid = ?', [game.steam_appid]);

  // Insert arrays
  for (const cat of game.categories || [])
    await conn.query('INSERT INTO game_categories SET ?', [{ appid: game.steam_appid, category_id: cat.id, description: cat.description }]);

  for (const g of game.genres || [])
    await conn.query('INSERT INTO game_genres SET ?', [{ appid: game.steam_appid, genre_id: g.id, description: g.description }]);

  for (const sc of game.screenshots || [])
    await conn.query('INSERT INTO game_screenshots SET ?', [{
      appid: game.steam_appid,
      screenshot_id: sc.id,
      path_thumbnail: sc.path_thumbnail,
      path_full: sc.path_full,
    }]);

  for (const m of game.movies || [])
    await conn.query('INSERT INTO game_movies SET ?', [{
      appid: game.steam_appid,
      movie_id: m.id,
      name: m.name,
      thumbnail: m.thumbnail,
      webm_480: m.webm?.['480'],
      webm_max: m.webm?.max,
      mp4_480: m.mp4?.['480'],
      mp4_max: m.mp4?.max,
      highlight: m.highlight,
    }]);
}
