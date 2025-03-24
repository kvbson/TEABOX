export interface ModeParams {
    recentGames: { steamId: string };
    ownedGames: { steamId: string };
    gameData: { appId: number };
    playtime: { steamId: string; appId: number };
    profileData: { steamId: string };
}

export interface ApiResponse<T> {
    data: T;
    status?: number;
    error?: string;
}