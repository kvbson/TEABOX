export interface ModeParams {
    recentGames: { steamId: string };
    ownedGames: { steamId: string };
    playtime: { steamId: string; appId: number };
    profileData: { steamId: string };
    gameInfo: { appId: number | string };
    tags: object; //no params needed
}

export interface ApiResponse<T> {
    data: T;
    status?: number;
    error?: string;
}