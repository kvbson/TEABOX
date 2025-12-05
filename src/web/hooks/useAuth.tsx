import { useState, useCallback, useEffect } from 'react';
import { callUser } from '../../api/webClients/callUser';

interface UseAuthResult {
  currentUserId: number;
  isLoggedIn: boolean;
  loginStatus: string;
  handleLogin: (
    email: string,
    password: string,
    isRegister?: boolean
  ) => Promise<void>;
}

export const useAuth = (): UseAuthResult => {
  const [currentUserId, setCurrentUserId] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginStatus, setLoginStatus] = useState('');
  // const [files, setFiles] = useState<string[]>([]);

  // const fetchFiles = useCallback(async () => {
  //   if (!isLoggedIn) {
  //     setFiles([]);
  //     return;
  //   }

  //   try {
  //     const response = await callUser({ mode: 'LIST_FILES', method: 'GET' });
  //     console.log(response);
  //     if (response.success && Array.isArray(response.data.params.files)) {
  //       setFiles(response.data.params.files);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch files:', error);
  //   }
  // }, [isLoggedIn]);

  const checkSession = useCallback(async () => {
    try {
      const res = await callUser({
        mode: 'CHECK_USER_SESSION',
        method: 'GET',
      });
      const userId = res.data?.userId;

      if (userId && res.success) {
        setIsLoggedIn(true);
        setCurrentUserId(userId);
      } else {
        setIsLoggedIn(false);
        setCurrentUserId(0);
        // setFiles([]);
      }
    } catch (err) {
      console.error('Session check failed', err);
      setIsLoggedIn(false);
      setCurrentUserId(0);
    }
  }, []);

  const handleLogin = useCallback(
    async (email: string, password: string, isRegister?: boolean) => {
      if (isLoggedIn) {
        // Logout
        await callUser({ mode: 'LOGOUT_USER', method: 'GET' });
        setIsLoggedIn(false);
        setCurrentUserId(0);
        setLoginStatus('✅ Logged out.');
        // setFiles([]);
        return;
      }

      if (!email || !password) return;

      //       setLoginStatus('Logging in...');

      try {
        // Check if user exists
        const userCheck = await callUser({
          mode: 'GET_USER_BY_EMAIL',
          method: 'POST',
          email,
        });

        //         const userNotFound = !userCheck.success || userCheck.data?.length === 0;

        if (userNotFound && isRegister) {
          setLoginStatus('Creating user...');
          await callUser({
            mode: 'ADD_USER',
            method: 'POST',
            email,
            password,
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
          setLoginStatus('✅ Logged in.');
        } else {
          setLoginStatus(
            '❌ Login failed.' +
              (loginRes.status === 401 ? ' Incorrect credentials.' : '')
          );
        }
      } catch (err) {
        console.error(err);
        setLoginStatus('❌ Unexpected error');
      }
    },
    [isLoggedIn]
  );

  //   useEffect(() => {
  //     checkSession();
  //   }, [checkSession]);

  return {
    currentUserId,
    isLoggedIn,
    loginStatus,
    handleLogin,
  };
};
