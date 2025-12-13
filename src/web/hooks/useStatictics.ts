import { useEffect, useState } from 'react';
import { callUser } from '../../api/webClients/callUser';
import { QueryType } from '../../api/types/user';

const CACHE_TTL = 60 * 60 * 1000;
const CACHE_KEY = (queryType: QueryType) => `statistics:${queryType}`;

type CachedData = {
  data: any[];
  timestamp: number;
};

export const useStatistics = (queryType: QueryType) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);

      const cachedRaw = sessionStorage.getItem(CACHE_KEY(queryType));
      if (cachedRaw) {
        try {
          const parsed: CachedData = JSON.parse(cachedRaw);
          if (Date.now() - parsed.timestamp < CACHE_TTL) {
            setData(parsed.data);
            setLoading(false);
            return;
          }
        } catch {
          sessionStorage.removeItem(CACHE_KEY(queryType));
        }
      }

      try {
        const { success, data: responseData, message } = await callUser({
          method: 'POST',
          mode: 'GET_STATICTICS',
          queryType,
        });

        if (success) {
          setData(responseData.data);

          sessionStorage.setItem(
            CACHE_KEY(queryType),
            JSON.stringify({ data: responseData.data, timestamp: Date.now() }),
          );
        } else {
          setError(message || 'Failed to fetch statistics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [queryType]);

  return { data, loading, error };
};
