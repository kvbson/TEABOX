import { useEffect, useState } from 'react';
import { callServer } from '../../api/webClients/callServer.js';

const useProfileData = (steamId: string) => {
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loc = localStorage.getItem('profileData');
        console.log(loc);
        if (loc) {
          return setProfileData(JSON.parse(loc));
        }
        const { data } = await callServer('profileData', { steamId });
        console.log(data);
        if (data?.response?.games && Array.isArray(data.response.games)) {
          localStorage.setItem('profileData', JSON.stringify(data));
          setProfileData(data);
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

  return { profileData, loading, error };
};

export default useProfileData;