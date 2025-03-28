type GameInfo = {
    appid: number;
    name: string;
    playtime_forever: number;
    playtime_2weeks?: number;
    img_icon_url: string;
}

type ExtendedGameInfo = {
    type: 'game' | 'software';
    name: string;
    steam_appid: number;
    required_age: number;
    is_free: boolean;
    controller_support?: 'full' | 'partial';
    dlc?: number[];
    detailed_description: string;
    about_the_game: string;
    short_description: string;
    supported_languages: string;
    reviews?: string;
    header_image: string;
    capsule_image: string;
    capsule_imagev5?: string;
    website?: string;
    pc_requirements?: Record<string, any>;
    mac_requirements?: Record<string, any>;
    linux_requirements?: Record<string, any>;
    legal_notice?: string;
    developers: string[];
    publishers: string[];
    price_overview?: {
      currency: string;
      initial: number;
      final: number;
      discount_percent: number;
    };
    packages?: number[];
    package_groups?: any[];
    platforms: {
      windows: boolean;
      mac: boolean;
      linux: boolean;
    };
    metacritic?: {
      score: number;
      url: string;
    };
    categories?: { id: number; description: string }[];
    genres?: { id: string; description: string }[];
    screenshots?: { id: number; path_thumbnail: string; path_full: string }[];
    movies?: { id: number; name: string; thumbnail: string; webm: any; mp4: any }[];
    recommendations?: { total: number };
    achievements?: { total: number; highlighted: any[] };
    release_date: { coming_soon: boolean; date: string };
    support_info: { url: string; email: string };
    background: string;
    background_raw: string;
    content_descriptors?: { ids: number[]; notes: string };
    ratings?: Record<string, any>;
    app_url?: string;
  };

export type { GameInfo, ExtendedGameInfo };