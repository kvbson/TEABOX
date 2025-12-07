import { useState, useEffect } from 'react';
import { useBannedGames } from './useBannedGames';
import { callServer } from '../../api/webClients/callServer';

export const useBannedGamesWithInfo = ({ currentUserId }: { currentUserId: number }) => {
  const { data: bannedGames, loading: bannedLoading, error: bannedError } = useBannedGames({ currentUserId });
  const [combinedData, setCombinedData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameInfos = async () => {
      if (!bannedGames || bannedGames.length === 0) {
        setCombinedData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const promises = bannedGames.map(async (game) => {
          const { data } = await fetchGameInfo(game.steamapp_id);
          const gameName = data.gameDetails.data.name;
          const capsuleImage = data.gameDetails.data.capsule_image;
          return { id: game.id, ban_date: game.created_date, gameName, capsuleImage };
        });

        const results = await Promise.all(promises);
        setCombinedData(results);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchGameInfos();
  }, [bannedGames]);

  return { data: combinedData, loading: loading || bannedLoading, error: error || bannedError };
};

const fetchGameInfo = async (appId: number | string) => {
  try {
    const { data, error } = await callServer('gameInfo', { appId }) as Record<string, any>;
    return { data: data?.[appId] ?? null, error };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : String(err) };
  }
};
