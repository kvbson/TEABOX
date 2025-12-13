import { useCallback } from 'react';
import { callUser } from '../../api/webClients/callUser';

export const useUnbanGame = () => {

  const handleUnbanGame = useCallback(async ({ currentUserId, gameId }: { currentUserId: number, gameId: number }) => {
    try {
      await callUser({ mode: 'UNBAN_GAME', method: 'POST', currentUserId, gameId });
    } catch (err) {
      console.error(err);
    }
  }, []);

  return { handleUnbanGame };
};
