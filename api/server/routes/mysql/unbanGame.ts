import { Router } from 'express';
import { getMySqlPool } from '../../../db/mysql/connections.js';

const unbanGame = Router();

unbanGame.post('/dbUser/unbanGame', async (req, res) => {
  const { currentUserId, gameId } = req.body;
  if (!currentUserId) {
    res.status(400).json({ success: false, message: 'User ID is required' });
    return;
  }

  if (!gameId) {
    res.status(400).json({ success: false, message: 'Game ID is required' });
    return;
  }

  try {
    const pool = await getMySqlPool();
    await pool.execute(
      'DELETE FROM banned_games WHERE user_id = ? AND id = ?',
      [currentUserId, gameId],
    );

  } catch (err) {
    console.error('❌ Failed to unban game:', err);
    res.status(500).json({ success: false, message: 'Database error' });
    return;
  }

  res.json({
    success: true,
    message: '✅ Game successfully unbanned.',
    params: {},
  });
});

export default unbanGame;