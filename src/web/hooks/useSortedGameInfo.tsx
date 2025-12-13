import { useEffect, useState, useMemo } from 'react';
import { callServer } from '../../api/webClients/callServer';
import { useBannedGamesWithInfo } from './useBannedGamesWithInfo';

const SORTED_GAMES_CACHE_KEY = (
  tags: string[],
  quick?: boolean,
) =>
  `sortedGameInfo:${tags.sort().join('|')}:quick=${!!quick}`;

type CachedGames = {
  data: any[];
  timestamp: number;
};

export const useSortedGameInfo = (
  sidebarTags: string[],
  currentUserId: number,
  quickRecommendations?: boolean,
) => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | Error | null>(null);

  const { data: bannedGames, loading: bannedLoading } =
    useBannedGamesWithInfo({ currentUserId });

  useEffect(() => {
    if (sidebarTags.length === 0 || bannedLoading) return;

    let isMounted = true;
    const TTL = 60 * 60 * 1000;
    const cacheKey = SORTED_GAMES_CACHE_KEY(
      sidebarTags,
      quickRecommendations,
    );

    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsed: CachedGames = JSON.parse(cached);

        if (Date.now() - parsed.timestamp < TTL) {
          setData(parsed.data);
          setLoading(false);
          return;
        }
      } catch {
        sessionStorage.removeItem(cacheKey);
      }
    }

    const fetchGameInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('[SortedGameInfo] Fetching for tags:', sidebarTags);

        const games = await callServer('sortedGameInfo', { sidebarTags });
        if (!isMounted) return;

        let fetchedData = (games.data as any[]) || [];

        if (quickRecommendations) {
          fetchedData = fetchedData.slice(0, 10);
        }

        setData(fetchedData);

        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: fetchedData,
            timestamp: Date.now(),
          }),
        );
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGameInfo();

    return () => {
      isMounted = false;
    };
  }, [sidebarTags, bannedLoading, quickRecommendations]);

  const filteredData = useMemo(() => {
    if (!bannedGames || bannedGames.length === 0) return data;

    const bannedIds = new Set(
      bannedGames.map((g: Record<string, any>) => g.steamapp_id),
    );

    return data.filter(
      (game) => !bannedIds.has(game.steam_appid),
    );
  }, [data, bannedGames]);

  return { data: filteredData, loading, error };
};