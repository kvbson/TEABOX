import { useEffect, useState, useMemo } from 'react';
import { callServer } from '../../api/webClients/callServer';
import { useBannedGamesWithInfo } from './useBannedGamesWithInfo';

export const useSortedGameInfo = (sidebarTags: string[], currentUserId: number) => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | Error | null>(null);

  const { data: bannedGames, loading: bannedLoading } = useBannedGamesWithInfo({ currentUserId });

  useEffect(() => {
    if (sidebarTags.length === 0 || bannedLoading) return;

    let isMounted = true;

    const fetchGameInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('[SortedGameInfo] Fetching for tags:', sidebarTags);
        const games = await callServer('sortedGameInfo', { sidebarTags });
        if (!isMounted) return;

        setData(games.data as any || []);
        console.log('[SortedGameInfo] Fetched games:', (games.data as any || []).slice(0, 20));
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    fetchGameInfo();

    return () => {
      isMounted = false;
    };
  }, [sidebarTags, bannedGames, bannedLoading]);

  const filteredData = useMemo(() => {
    if (!bannedGames || bannedGames.length === 0) return data;

    const bannedIds = new Set(bannedGames.map((game: Record<string, any>) => game.steamapp_id));
    return data.filter((game) => !bannedIds.has(game.steam_appid));
  }, [data, bannedGames]);

  return { data: filteredData, loading, error };
};
