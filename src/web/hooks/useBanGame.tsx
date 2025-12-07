import { useCallback } from 'react';
import { callUser } from '../../api/webClients/callUser';

export const useBanGame = () => {

  const handleBanGame = useCallback(async ({ currentUserId, steamapp_id }: { currentUserId: number, steamapp_id: number }) => {
    try {
      await callUser({ mode: 'BAN_GAME', method: 'POST', currentUserId, steamapp_id });
    } catch (err) {
      console.error(err);
    }
  }, []);

  return { handleBanGame };
};
