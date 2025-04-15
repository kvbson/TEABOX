// src/hooks/useGameInfo.ts
import { useEffect, useState } from 'react';
import { GamesObj } from '../../../api/types/gameInfo.types';
import { callServer } from '../../api/webClients/callServer';

export const useGameInfo = (appId: number | string) => {
  const [data, setData] = useState<GamesObj[string] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameInfo = async () => {
      setLoading(true);
      console.log('[GameInfo] Fetching for appId:', appId);
      const { data, error } = await callServer<GamesObj, any>('gameInfo', { appId });
      console.log('[GameInfo] API response:', data);
      if (error) {
        console.log(`[GameInfo] Failed fetching game. Error: ${error.message}`);
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