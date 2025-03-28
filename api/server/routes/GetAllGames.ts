import { SteamAppListResponse } from '#types/allGames.types';
import steamApi from '#server/clients/steamClients/steamApiClient';

export const getAllGames = async ()=> {
  const params = {
    key: undefined,
    format: 'json',
  };

  const { data } = await steamApi.get<SteamAppListResponse>('ISteamApps/GetAppList/v2/', { params });
  return data;
};
