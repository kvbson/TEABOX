import { CallUserParams } from '../types/user';

const PATHS: Record<CallUserParams['mode'], string> = {
  ADD_USER: '/dbUser/add',
  LOGIN_USER: '/dbUser/login',
  GET_USER_BY_ID: '/dbUser/get/id',
  GET_USER_BY_EMAIL: '/dbUser/get/email',
  DELETE_USER: '/dbUser/delete',
  LOGOUT_USER: '/dbUser/logout',
  CHECK_USER_SESSION: '/dbUser/me',
  GET_BANNED_GAMES: '/dbUser/get/bannedGames',
  BAN_GAME: '/dbUser/banGame',
  UNBAN_GAME: '/dbUser/unbanGame',
} as const;

const REQUIRED_FIELDS: Record<CallUserParams['mode'], string[]> = {
  ADD_USER: ['email', 'password', 'steamId'],
  LOGIN_USER: ['email', 'password'],
  GET_USER_BY_EMAIL: ['email'],
  GET_USER_BY_ID: ['userId'],
  DELETE_USER: ['userId'],
  LOGOUT_USER: [],
  CHECK_USER_SESSION: [],
  GET_BANNED_GAMES: ['currentUserId'],
  BAN_GAME: ['currentUserId', 'steamapp_id'],
  UNBAN_GAME: ['currentUserId', 'gameId'],
};

const expressServerUrl = import.meta.env.VITE_SERVER_URL || 'https://localhost:8080';

export async function callUser(
  params: CallUserParams,
): Promise<{ success: boolean; status: number; data?: any; message?: string }> {
  const url = new URL(PATHS[params.mode], expressServerUrl);

  // Validate required fields
  for (const field of REQUIRED_FIELDS[params.mode]) {
    if (params[field as keyof CallUserParams] === undefined) {
      throw new Error(`${field} is required for ${params.mode}`);
    }
  }

  const headers: Record<string, string> = {};
  let body: FormData | string | undefined;

  headers['Content-Type'] = 'application/json';

  const { method, mode, ...rest } = params;
  if (Object.keys(rest).length > 0 && method !== 'GET') {
    body = JSON.stringify(rest);
  }

  try {
    const response = await fetch(url.toString(), {
      method,
      headers,
      body,
      credentials: 'include',
    });

    const json = await response.json().catch(() => ({}));
    return {
      success: response.ok,
      status: response.status,
      data: json,
      message: response.ok
        ? '✅ Request succeeded'
        : `❌ ${mode} failed (${response.status} ${response.statusText})`,
    };
  } catch (err) {
    return {
      success: false,
      status: 0,
      message: err instanceof Error ? err.message : 'Network error',
    };
  }
}
