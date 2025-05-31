export type GameInfo = {
  steam_appid: number;
  name: string;
  platforms: {
    windows: boolean,
    mac: boolean,
    linux: boolean,
  },
  short_description: string,
  detailed_description: string,
  is_free: boolean,
  header_image: string,
  capsule_image: string,
  website: string,
  controller_support: string,
  about_the_game: string,
  supported_languages: string,
  background: string,
  pc_requirements: {
    minimum: string,
    recommended: string,
  },
  mac_requirements: {
    minimum: string,
    recommended: string,
  },
  linux_requirements: {
    minimum: string,
    recommended: string,
    developers: string[],
},
  publishers: string[],
  metacritic: {
    score: number,
    url: string,
  },
  categories: {
    id: number;
    description: string;
  }[],
  genres: {
    id: number;
    description: string;
  }[],
  screenshots: {
    path_full: string;
    path_thumbnail: string;
    id: number;
  }[],
  movies: {
    id: number;
  name: string;
  thumbnail: string;
  webm: {
    '480': string;
    max: string;
  };
  mp4: {
    '480': string;
    max: string;
  },
  highlight: boolean;
  }[],
  release_date: {
    coming_soon: boolean,
    date: Date,
  },
  app_url: string,
  required_age: number,
  price_overview: {
    currency: string;
    initial: string;
    final: number,
    initial_formatted: string,
    final_formatted: string,
    discount_percent: number,
  }
}