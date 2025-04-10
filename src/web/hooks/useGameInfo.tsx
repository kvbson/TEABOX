// src/hooks/useGameInfo.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { GamesObj } from '../../../api/types/gameInfo.types';

export const useGameInfo = (appId: number | string) => {
  const [data, setData] = useState<GamesObj[string] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameInfo = async () => {
      try {
        setLoading(true);
        console.log('[GameInfo] Fetching for appId:', appId);
        const res = await axios.get<{ success: boolean; data: GamesObj }>('/api/steam/gameInfo', {
          params: { appId },
        });
        console.log('[GameInfo] API response:', res.data);
  
        setData(res.data.data[appId]);
      } catch (err: any) {
        console.error('[GameInfo] Fetch error:', err);
        setError(err.message || 'Error fetching game info');
      } finally {
        setLoading(false);
      }
    };
  
    if (appId) fetchGameInfo();
  }, [appId]);

  return { data, loading, error };
};