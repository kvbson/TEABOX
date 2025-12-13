export const TOAST_ID = 'error-toast';

export const API_ENDPOINTS = {
  recentGames: '/api/steam/user/recentGames/',
  playtime: '/api/steam/user/playtime/',
  summary: '/api/steam/user/summary/',
  ownedGames: '/api/steam/user/ownedGames/',
  profileData: '/api/steam/user/profileData/',
  gameInfo: '/api/steam/gameInfo/',
  missingIds: '/api/steam/missingIds',
  tags: '/api/steam/tags/',
  topmostTags: '/api/steam/topmostTags/',
  sortedGameInfo: '/api/steam/sortedGameInfo/',
  bigQueryData: '/api/bigquery/queries/',
} as const;