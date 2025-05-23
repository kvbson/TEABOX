// src/hooks/useSortedGameInfo.ts
import { useEffect, useState } from 'react';
import { callServer } from '../../api/webClients/callServer';

export const useSortedGameInfo = (sidebarTags: string[]) => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | Error | null>(null);

  useEffect(() => {
    const fetchGameInfo = async () => {
      if (sidebarTags.length > 0) {
        setLoading(true);
        console.log('[SortedGameInfo] Fetching for tags:', sidebarTags);
        const games = await callServer('sortedGameInfo', { sidebarTags });
        console.log('[SortedGameInfo] API response:', (games.data as any || []).slice(0, 20));
        if (error) {
          console.log(`[SortedGameInfo] Failed fetching games info. Error: ${error instanceof Error ? error.message : String(error)}`);
          setError(error);
        }
        if (games.data) {
          setData(games.data as any[]);
        }
        setLoading(false);
      }

    };

    fetchGameInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarTags]);

  return { data, loading, error };
};