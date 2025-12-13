export type QueryType = 'bestPublishers' | 'mostRatedGenres' | 'bestReviewedGames';
export type Response = {
  success: true;
  message: string;
  params: Record<string, any>;
}

export type ErrorResponse = {
  success: false;
  status: number;
  message: string;
}

export type ParamsUserAdd = {
  mode: 'ADD_USER';
  method: 'POST';
  email: string;
  password: string;
  steamId: string;
}

export type ParamsUserGetEmail = {
  mode: 'GET_USER_BY_EMAIL';
  method: 'POST';
  email: string;
}

export type ParamsUserGetId = {
  mode: 'GET_USER_BY_ID';
  method: 'POST';
  email: string;
}

export type ParamsUserDelete = {
  mode: 'DELETE_USER';
  method: 'POST';
  userId: number;
}

export type ParamsUserLogin = {
  mode: 'LOGIN_USER';
  method: 'POST';
  email: string;
  password: string;
}

export type ParamsUserLogout = {
  mode: 'LOGOUT_USER';
  method: 'GET';
}

export type ParamsUserCheckUserSess = {
  mode: 'CHECK_USER_SESSION';
  method: 'GET';
}

export type ParamsUserGetBannedGames = {
  mode: 'GET_BANNED_GAMES';
  method: 'POST';
  currentUserId: number;
}

export type ParamsUserBanGame = {
  mode: 'BAN_GAME';
  method: 'POST';
  currentUserId: number;
  steamapp_id: number;
}

export type ParamsUserUnbanGame = {
  mode: 'UNBAN_GAME';
  method: 'POST';
  currentUserId: number;
  gameId: number;
}

export type ParamsGetStatictics= {
  mode: 'GET_STATICTICS';
  method: 'POST';
  queryType: QueryType;
}

/*Union type for all possible parameter types*/
export type CallUserParams = ParamsUserAdd | ParamsUserGetId | ParamsUserGetEmail | ParamsUserLogout | ParamsUserDelete | ParamsUserLogin | ParamsUserCheckUserSess | ParamsUserGetBannedGames | ParamsUserBanGame | ParamsUserUnbanGame | ParamsGetStatictics;