import { useState, useCallback, useEffect } from 'react';
import { callUser } from '../../api/webClients/callUser';

type LoginStatus = {
  type: 'success' | 'error';
  message: string;
};
interface UseAuthResult {
  currentUserId: number;
  currentUserSteamId: string;
  isLoggedIn: boolean;
  loginStatus: LoginStatus | null;
  handleLogin: (
    email: string,
    password: string,
        steamId?: string, //Only in register
    isRegister?: boolean,
  ) => Promise<void>;
  handleLogout: () => void;
}

export const useAuth = (): UseAuthResult => {
  const [currentUserId, setCurrentUserId] = useState(0);
  const [currentUserSteamId, setCurrentUserSteamId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginStatus, setLoginStatus] = useState<LoginStatus | null>(null);

  const checkSession = useCallback(async () => {
    try {
      const res = await callUser({
        mode: 'CHECK_USER_SESSION',
        method: 'GET',
      });
      const userId = res.data?.userId;
      const steamId = res.data?.steamId;

      if (userId && steamId && res.success) {
        setIsLoggedIn(true);
        setCurrentUserId(userId);
        setCurrentUserSteamId(steamId);
      } else {
        setIsLoggedIn(false);
        setCurrentUserId(0);
        setCurrentUserSteamId('');
        // setFiles([]);
      }
    } catch (err) {
      console.error('Session check failed', err);
      setIsLoggedIn(false);
      setCurrentUserId(0);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const handleLogout = useCallback(async () => {
    try {
      await callUser({ mode: 'LOGOUT_USER', method: 'GET' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggedIn(false);
      setCurrentUserId(0);
      setCurrentUserSteamId('');
      setLoginStatus({ type: 'success', message: 'Logged out.' });
    }
  }, []);

  const handleLogin = useCallback(
    async (email: string, password: string, steamId?: string, isRegister?: boolean) => {
      if (!email || !password) return;

      try {
        // Check if user exists
        const userCheck = await callUser({
          mode: 'GET_USER_BY_EMAIL',
          method: 'POST',
          email,
        });

        const userNotFound = !userCheck.success || userCheck.data?.length === 0;
        if (userNotFound && isRegister && steamId) {
          setLoginStatus({ type: 'success', message: 'Creating user...' });
          await callUser({
            mode: 'ADD_USER',
            method: 'POST',
            email,
            password,
            steamId,
          });
        }

        // Login
        const loginRes = await callUser({
          mode: 'LOGIN_USER',
          method: 'POST',
          email,
          password,
        });

        if (loginRes.success) {
          setIsLoggedIn(true);
          setCurrentUserId(loginRes.data.userId);
          setCurrentUserSteamId(loginRes.data.steamId);
          setLoginStatus({ type: 'success', message: 'Logged in.' });
        } else {
          setLoginStatus({
            type: 'error',
            message: 'Login failed.' + (loginRes.status === 401 ? ' Incorrect credentials.' : ''),
          });
        }
      } catch (err) {
        console.error(err);
        setLoginStatus({ type: 'error', message: 'Unexpected error' });
      }
    },
    [],
  );

  return {
    currentUserId,
    currentUserSteamId,
    isLoggedIn,
    loginStatus,
    handleLogin,
    handleLogout,
  };
};
