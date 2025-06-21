export interface ModeParams {
    recentGames: { steamId: string };
    ownedGames: { steamId: string };
    playtime: { steamId: string; appId: number };
    profileData: { steamId: string, dataLimit: number };
    gameInfo: { appId: number | string };
    missingIds: object;
    tags: object; //no params needed
    topmostTags: { limit?: number };
    sortedGameInfo: { sidebarTags: string | string[] };
    prosNCons: { appId: string };
}

export interface ApiResponse<T> {
    data: T;
    status?: number;
    error?: string;
}
