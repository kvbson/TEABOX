import { useEffect, useState } from 'react';
import { callServer } from '../../api/webClients/callServer.js';

const useProfileData = (steamId: string) => {
//   const [profileData, setProfileData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await callServer('profileData', { steamId });
        if (data?.response?.games && Array.isArray(data.response.games)) {
            console.log(data.response);
        //   setProfileData(data.response.games);
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

  return { profileData: [], loading, error };
};

export default useProfileData;