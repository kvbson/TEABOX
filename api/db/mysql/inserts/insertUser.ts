import { getMySqlPool } from '../connections.js';
import { normalizeValue, parse10Int } from '../utils/functions.js';

export type UserSchemaType = {
    steam_appid: number | null;
    email: string;
    password_hash: string;
}

export async function insertUser(user: UserSchemaType) {
  if (!user || user.email == null || user.password_hash == null) {
    console.warn('Skipping invalid user info:', user);
    return;
  }

  const pool = await getMySqlPool();
  await pool.query(
    'REPLACE INTO users SET ?',
    [{
      steam_appid: parse10Int(user.steam_appid),
      email: normalizeValue(user.email),
      password_hash: normalizeValue(user.password_hash),
    }],
  );
}
