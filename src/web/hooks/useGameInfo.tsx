// src/hooks/useGameInfo.ts
import { useEffect, useState } from 'react';
import { callServer } from '../../api/webClients/callServer';

export const useGameInfo = (appId: number | string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameInfo = async () => {
      setLoading(true);
      console.log('[GameInfo] Fetching for appId:', appId);
      const { data, error } = await callServer('gameInfo', { appId }) as any;
      console.log('[GameInfo] API response:', data);
      if (error) {
        console.log(`[GameInfo] Failed fetching game. Error: ${error instanceof Error ? error.message : String(error)}`);
        setError(error);
      }
      if (data?.[appId]) {
        setData(data[appId]);
      }
      setLoading(false);

    };

    if (appId) fetchGameInfo();
  }, [appId]);

  return { data, loading, error };
};