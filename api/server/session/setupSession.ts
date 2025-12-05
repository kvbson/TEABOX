import session, { Store } from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';
import { getMySqlPool } from '../../db/mysql/connections.js';

export const sessionName = 'logged_in_session';

export async function createMySQLSessionStore() {
  const MySQLStore = MySQLStoreFactory(session);
  const pool = await getMySqlPool();

  const sessionStore = new MySQLStore(
    {
      expiration: 1000 * 60 * 60 * 24, // 1 day
      createDatabaseTable: true,
      schema: {
        tableName: 'sessions',
        columnNames: {
          session_id: 'session_id',
          expires: 'expires',
          data: 'data',
        },
      },
    },
    pool as any,
  );

  return sessionStore;
}

export const cookieParams = {
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: <const>'lax',
};

export function setupSession(sessionStore: Store) {
  return session({
    name: sessionName,
    secret: process.env.SESSION_SECRET!,
    store: sessionStore ?? undefined,
    resave: false,
    saveUninitialized: false,
    cookie: { ...cookieParams, maxAge: 24 * 60 * 60 * 1000 },
  });
}
