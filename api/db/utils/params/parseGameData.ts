import { ExtendedGameInfo } from "../../../types/gameInfo.types.js";
import { GameInfoSchemaType } from "../../models/GameInfo.js";


export const parseGameData = (game: ExtendedGameInfo | GameInfoSchemaType, mode: 'db' | 'app') => {
  if (!game.name) throw new Error(`Missing required field: name. Recieved: ${game.name}`);
  if (!game.steam_appid) throw new Error(`Missing required field: steam_appid. Recieved: ${game.steam_appid}`);

  const additionalProps = mode === 'db' ? { createdAt: new Date(), updatedAt: new Date() } : {};
  return {
    ...additionalProps,
    steam_appid: game.steam_appid,
    name: game.name,
    required_age: game.required_age,
    platforms: game.platforms || {},
    short_description: game.short_description,
    detailed_description: game.detailed_description,
    is_free: game.is_free || false,
    controller_support: game.controller_support,
    about_the_game: game.about_the_game,
    supported_languages: game.supported_languages,
    background: game.background ?? '',
    website: game.website ?? '',
    capsule_image: game.capsule_image ?? '',
    header_image: game.header_image ?? '',
    pc_requirements: game.pc_requirements || {},
    mac_requirements: game.mac_requirements || {},
    linux_requirements: game.linux_requirements || {},
    developers: game.developers || [],
    publishers: game.publishers || [],
    metacritic: game.metacritic || {},
    release_date: game.release_date?.date ?
      {
        date: mode === 'db' ? new Date(game.release_date.date) : new Date(game.release_date.date).toLocaleDateString('es-CL'),
        coming_soon: !!game.release_date?.coming_soon,
      }
      : null,
    app_url: game.app_url || `https://store.steampowered.com/app/${game.steam_appid}`,
    price_overview: game.price_overview || {},
    categories: (game.categories || []) as GameInfoSchemaType['categories'],
    genres: (game.genres || []) as GameInfoSchemaType['genres'],
    screenshots: (game.screenshots || []) as GameInfoSchemaType['screenshots'],
    movies: (game.movies?.map(movie => ({
      id: movie.id,
      name: movie.name,
      thumbnail: movie.thumbnail,
      webm: movie.webm || { '480': '', max: '' },
      mp4: movie.mp4 || { '480': '', max: '' },
    })) || []) as GameInfoSchemaType['movies'],
    pros: game.pros || [],
    cons: game.cons || [],
    blur_image: game.blur_image ?? undefined,
  };
};