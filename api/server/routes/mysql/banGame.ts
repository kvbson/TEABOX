import { Router } from 'express';
import { getMySqlPool } from '../../../db/mysql/connections.js';

const banGame = Router();

banGame.post('/dbUser/banGame', async (req, res) => {
  const { currentUserId, steamapp_id } = req.body;
  if (!currentUserId) {
    res.status(400).json({ success: false, message: 'User ID is required' });
    return;
  }

  if (!steamapp_id) {
    res.status(400).json({ success: false, message: 'Game ID is required' });
    return;
  }

  try {
    const pool = await getMySqlPool();
    await pool.execute(
      'INSERT INTO banned_games (USER_ID, STEAMAPP_ID) VALUES (?, ?)',
      [currentUserId, steamapp_id],
    );

  } catch (err) {
    console.error('❌ Failed to ban game:', err);
    res.status(500).json({ success: false, message: 'Database error' });
    return;
  }

  res.json({
    success: true,
    message: '✅ Game successfully banned.',
    params: {},
  });
});

export default banGame;