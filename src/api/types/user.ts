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

/*Union type for all possible parameter types*/
export type CallUserParams = ParamsUserAdd | ParamsUserGetId | ParamsUserGetEmail | ParamsUserLogout | ParamsUserDelete | ParamsUserLogin | ParamsUserCheckUserSess;