import { getMySqlPool } from '../connections.js';
import { normalizeValue, parse10Int } from '../utils/functions.js';
import { getOutId } from '../utils/getOutId.js';

export type UserSchemaType = {
  email: string;
  password_hash: string;
  steamId: string;
}

export async function insertUser(user: UserSchemaType) {
  if (!user || user.email == null || user.password_hash == null || user.steamId == null) {
    console.warn('Skipping invalid user info:', user);
    return;
  }

  const pool = await getMySqlPool();
  const response = await pool.query(
    'INSERT INTO users SET ?',
    [{
      email: normalizeValue(user.email),
      password_hash: normalizeValue(user.password_hash),
      steamId: parse10Int(user.steamId),
    }],
  );
  const outId = getOutId(response);
  return outId;
}
