import { PORT } from '../../../../api/server/server';

export const SERVER_URL = `http://localhost:${PORT}`;
export const TOAST_ID = 'error-toast';

export const API_ENDPOINTS = {
  recentGames: '/api/steam/user/recentGames/',
  playtime: '/api/steam/user/playtime/',
  gameData: '/api/steam/gameData/',
  ownedGames: '/api/steam/user/ownedGames/',
};