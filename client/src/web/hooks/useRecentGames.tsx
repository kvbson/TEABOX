import { useEffect, useState } from 'react';
import { UseGamesResult, UserGame } from './useRecentGames.types';
import { callServer } from '../../../../api/clients/webClients/callServer.js';

const useRecentGames = (steamId: string): UseGamesResult => {
  const [recentGames, setRecentGames] = useState<UserGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await callServer('recentGames', { steamId });

        if (data?.response?.games && Array.isArray(data.response.games)) {
          setRecentGames(data.response.games);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [steamId]);

  return { recentGames, loading, error };
};

export default useRecentGames;