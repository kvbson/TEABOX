// import { useState, useCallback, useEffect } from 'react';
// import { callServer } from '../../api/clients/callServer';

// interface UseAuthResult {
//   currentUserId: number;
//   isLoggedIn: boolean;
//   loginStatus: string;
//   files: string[];
//   handleLogin: (
//     username: string,
//     password: string,
//     isRegister?: boolean
//   ) => Promise<void>;
//   fetchFiles: () => Promise<void>;
// }

// export const useAuth = (): UseAuthResult => {
//   const [currentUserId, setCurrentUserId] = useState(0);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loginStatus, setLoginStatus] = useState('');
//   const [files, setFiles] = useState<string[]>([]);

//   const fetchFiles = useCallback(async () => {
//     if (!isLoggedIn) {
//       setFiles([]);
//       return;
//     }

//     try {
//       const response = await callServer({ mode: 'LIST_FILES', method: 'GET' });
//       console.log(response);
//       if (response.success && Array.isArray(response.data.params.files)) {
//         setFiles(response.data.params.files);
//       }
//     } catch (error) {
//       console.error('Failed to fetch files:', error);
//     }
//   }, [isLoggedIn]);

//   const checkSession = useCallback(async () => {
//     try {
//       const res = await callServer({
//         mode: 'CHECK_USER_SESSION',
//         method: 'GET',
//       });
//       const userId = res.data?.userId;

//       if (userId && res.success) {
//         setIsLoggedIn(true);
//         setCurrentUserId(userId);
//       } else {
//         setIsLoggedIn(false);
//         setCurrentUserId(0);
//         setFiles([]);
//       }
//     } catch (err) {
//       console.error('Session check failed', err);
//       setIsLoggedIn(false);
//       setCurrentUserId(0);
//     }
//   }, []);

//   const handleLogin = useCallback(
//     async (username: string, password: string, isRegister?: boolean) => {
//       if (isLoggedIn) {
//         // Logout
//         await callServer({ mode: 'LOGOUT_USER', method: 'GET' });
//         setIsLoggedIn(false);
//         setCurrentUserId(0);
//         setLoginStatus('✅ Logged out.');
//         setFiles([]);
//         return;
//       }

//       if (!username || !password) return;

//       setLoginStatus('Logging in...');

//       try {
//         // Check if user exists
//         const userCheck = await callServer({
//           mode: 'GET_USER',
//           method: 'POST',
//           login: username,
//         });

//         const userNotFound = !userCheck.success || userCheck.data?.length === 0;

//         if (userNotFound && isRegister) {
//           setLoginStatus('Creating user...');
//           await callServer({
//             mode: 'ADD_USER',
//             method: 'POST',
//             login: username,
//             password,
//           });
//         }

//         // Login
//         const loginRes = await callServer({
//           mode: 'LOGIN_USER',
//           method: 'POST',
//           login: username,
//           password,
//         });

//         if (loginRes.success) {
//           setIsLoggedIn(true);
//           setCurrentUserId(loginRes.data.userId);
//           setLoginStatus('✅ Logged in.');
//         } else {
//           setLoginStatus(
//             '❌ Login failed.' +
//               (loginRes.status === 401 ? ' Incorrect credentials.' : '')
//           );
//         }
//       } catch (err) {
//         console.error(err);
//         setLoginStatus('❌ Unexpected error');
//       }
//     },
//     [isLoggedIn]
//   );

//   useEffect(() => {
//     checkSession();
//   }, [checkSession]);

//   return {
//     currentUserId,
//     isLoggedIn,
//     loginStatus,
//     files,
//     handleLogin,
//     fetchFiles,
//   };
// };
