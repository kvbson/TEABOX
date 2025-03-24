export interface UserGame {
    appid: number;
    name: string;
    playtime_forever: number;
    playtime_2weeks?: number;
    img_icon_url: string;
  }

export type UseGamesResult = {
    recentGames: UserGame[];
    loading: boolean;
    error: string | null;
  };