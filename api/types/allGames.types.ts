type BasicGameInfo = {
    appid: string;
    name: string;
}

type SteamAppListResponse = {
    applist: {
     apps: BasicGameInfo[];
    };
}

export type { SteamAppListResponse, BasicGameInfo };