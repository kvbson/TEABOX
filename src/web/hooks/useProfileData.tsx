import { useEffect, useState } from 'react';
import { callServer } from '../../api/webClients/callServer.js';

const CACHE_TTL = 60 * 60 * 1000;
const PROFILE_CACHE_KEY = (steamId: string) =>
  `profileData:${steamId}`;

type CachedProfile = {
  data: any;
  timestamp: number;
};

export const useProfileData = (steamId: string, dataLimit?: number) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const cacheKey = PROFILE_CACHE_KEY(steamId);

    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsed: CachedProfile = JSON.parse(cached);

        if (Date.now() - parsed.timestamp < CACHE_TTL) {
          setProfileData(parsed.data);
          setLoading(false);
          return;
        }
      } catch {
        sessionStorage.removeItem(cacheKey);
      }
    }

    const fetchData = async () => {
      try {
        const { data } = await callServer('profileData', {
          steamId,
          dataLimit: dataLimit || 200,
        });

        if (!isMounted) return;

        setProfileData(data);

        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          }),
        );
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [steamId, dataLimit]);

  return { profileData, loading, error };
};