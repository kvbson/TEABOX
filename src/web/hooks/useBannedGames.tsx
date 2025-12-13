import { useEffect, useState } from 'react';
import { callUser } from '../../api/webClients/callUser';

export const useBannedGames = ({ currentUserId }: { currentUserId: number }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBannedGames = async () => {
      setLoading(true);
      try {
        const { success, data, message } = await callUser({
          method: 'POST',
          mode: 'GET_BANNED_GAMES',
          currentUserId,
        });

        if (success) {

          setData(data.data);
        } else {
          setError(message || 'Failed to fetch banned games');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchBannedGames();
  }, [currentUserId]);

  return { data, loading, error };
};
