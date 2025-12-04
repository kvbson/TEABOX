import { Router } from 'express';
import { getMySqlPool } from '../../../db/mysql/connections.js';
import { parse10Int } from '../../../db/mysql/utils/functions.js';

const getUser = Router();

export async function getUserByEmail(email: string) {
  const pool = await getMySqlPool();
  const [rows] = await pool.execute(
    'SELECT id, password_hash, email FROM users WHERE email = ?',
    [email],
  );
  return Array.isArray(rows) ? rows[0] : rows ?? null;
}

export async function getUserById(userId: number) {
  const pool = await getMySqlPool();
  const [rows] = await pool.execute(
    'SELECT id, password_hash, email FROM users WHERE id = ?',
    [userId],
  );
  return Array.isArray(rows) ? rows[0] : rows ?? null;
}

getUser.post('/dbUser/get', async (req, res) => {
  const { userId } = req.body;
  const parsedId = parse10Int(userId);
  if (!parsedId && parsedId !== 0) {
    res.status(400).json({ success: false, message: 'User id is required' });
    return;
  }
  try {
    const user = await getUserById(userId) as any[];
    if (!user) {
      res.status(404).json({ success: true, message: 'User not found', ok: true });
      return;
    }
    res.json({ success: true, message: `Sending user with userId: ${userId}`, data: user[0] });
    return;
  } catch (err) {
    console.error(`❌ Failed to get user: ${userId}`, err);
    res.status(500).json({ success: false, message: 'Database error' });
    return;
  }

});

export default getUser;