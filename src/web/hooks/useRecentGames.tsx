import { useEffect, useState } from 'react';
import { UseGamesResult, UserGame } from './useRecentGames.types.js';
import { callServer } from '../../api/webClients/callServer.js';

export const useRecentGames = (steamId: string): UseGamesResult => {
  const [recentGames, setRecentGames] = useState<UserGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await callServer<{response: { games: UserGame[] }}, any>('recentGames', { steamId });
        if (data?.response?.games && Array.isArray(data.response.games)) {
          setRecentGames(data.response.games);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        if (err) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [steamId]);

  return { recentGames, loading, error };
};