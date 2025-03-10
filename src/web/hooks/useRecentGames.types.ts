export interface UserGame {
    appid: number;
    name: string;
    playtime_forever: number;
    playtime_2weeks?: number;
  }
  
export type UseGamesResult = {
    recentGames: UserGame[];
    loading: boolean;
    error: string | null;
  };