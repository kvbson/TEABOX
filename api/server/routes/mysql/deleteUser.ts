import { Router } from 'express';
import { OkPacketParams } from 'mysql2';
import { getMySqlPool } from '../../../db/mysql/connections.js';

const deleteUser = Router();

deleteUser.post('/dbUser/delete', async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(400).json({ success: false, message: 'User id is required' });
    return;
  }

  try {
    const pool = await getMySqlPool();
    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [userId],
    );

    if ((result as OkPacketParams)?.affectedRows === 0) {
      res.status(400).json({ success: false, message: '⚠️ No user found with that ID.' });
      return;
    }

  } catch (err) {
    console.error('❌ Failed to delete user:', err);
    res.status(500).json({ success: false, message: 'Database error' });
    return;
  }

  res.json({
    success: true,
    message: `🗑️ Deleted user with ID: ${userId}`,
    params: {},
  });
});

export default deleteUser;