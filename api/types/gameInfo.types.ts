import { SteamReviewsResponse } from './reviews.types.js';

type GamesObj = Record<string, { reviews: SteamReviewsResponse; gameDetails: GameDetailsResponse; appId: string | number; name?: string; playtime_forever?: number; playtime_2weeks?: number }>;

export type GameDetailsResponse = { success: boolean; data?: ExtendedGameInfo; };

type GameInfo = {
    appid: number;
    name: string;
    playtime_forever: number;
    playtime_2weeks?: number;
    img_icon_url: string;
}

type ExtendedGameInfo = {
    name: string;
    steam_appid: number;
    required_age?: number | null;
    is_free: boolean;
    controller_support?: 'full' | 'partial' | null;
    dlc?: number[];
    detailed_description?: string | null;
    about_the_game?: string | null;
    short_description?: string | null;
    supported_languages?: string | null;
    reviews?: string;
    website?: string;
    pc_requirements?: Record<string, any>;
    mac_requirements?: Record<string, any>;
    linux_requirements?: Record<string, any>;
    legal_notice?: string;
    developers: string[];
    publishers: string[];
    price_overview?: {
      currency?: string | null;
      initial?: number | null;
      final?: number | null;
      discount_percent?: number | null;
    };
    packages?: number[];
    package_groups?: any[];
    platforms?: {
      windows?: boolean | null;
      mac?: boolean | null;
      linux?: boolean | null;
    };
    metacritic?: {
      score?: number | null;
      url?: string | null;
    };
    categories?: { id?: number | null; description?: string | null }[];
    genres?: { id?: number | null; description?: string | null }[];
    screenshots?: { id?: number | null; path_thumbnail?: string | null; path_full?: string | null }[];
    movies?: { id?: number | null; name?: string | null; thumbnail?: string | null; webm?: {
      '480'?: string | null,
      max?: string | null,
    } | null; mp4?: {
      '480'?: string | null,
      max?: string | null,
    } | null}[];
    recommendations?: { total: number };
    achievements?: { total: number; highlighted: any[] };
    release_date?: { coming_soon: boolean; date: string | Date } | null;
    content_descriptors?: { ids: number[]; notes: string };
    ratings?: Record<string, any>;
    app_url?: string;
};

export type { GameInfo, ExtendedGameInfo, GamesObj };