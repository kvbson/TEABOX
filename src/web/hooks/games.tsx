import { useEffect, useState } from 'react';
import { callServer } from '../utils/callServer';

interface UserGame {
    appid: number;
    name: string;
    playtime_forever: number;
    playtime_2weeks?: number;
  }

type UseGamesResult = {
  recentGames: UserGame[];
  loading: boolean;
  error: string | null;
};

function useRecentGames(steamId: string): UseGamesResult {
  const [recentGames, setRecentGames] = useState<UserGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await callServer('recentGames', { steamId });
        if (!data) {
            throw new Error('Recent games fetch failed')
        }
        if (Array.isArray(data.response.games)) {
            setRecentGames(data.response.games);
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

export { useRecentGames };