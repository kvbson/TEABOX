import { Router } from 'express';
import { getMySqlPool } from '../../../../db/mysql/connections.js';
import { parse10Int } from '../../../../db/mysql/utils/functions.js';

const getUserWithId = Router();

export async function getUserById(userId: number) {
  const pool = await getMySqlPool();
  const [rows] = await pool.execute(
    'SELECT id, email FROM users WHERE id = ?',
    [userId],
  );
  return Array.isArray(rows) ? rows[0] : rows ?? null;
}

getUserWithId.post('/dbUser/get/id', async (req, res) => {
  const { userId } = req.body;
  const parsedId = parse10Int(userId);
  if (!parsedId && parsedId !== 0) {
    res.status(400).json({ success: false, message: 'User id is required' });
    return;
  }
  try {
    const { id } = await getUserById(userId) as Record<string, any>;
    if (!id) {
      res.status(404).json({ success: true, message: 'User not found', ok: true });
      return;
    }
    res.json({ success: true, message: `Sending user with id: ${id}`, data: id });
    return;
  } catch (err) {
    console.error('❌ Failed to get user', err);
    res.status(500).json({ success: false, message: 'Database error' });
    return;
  }

});

export default getUserWithId;