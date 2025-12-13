import { Router } from 'express';
import { getMySqlPool } from '../../../../db/mysql/connections.js';

export async function getBannedGames({ currentUserId }: { currentUserId: number }) {
  const pool = await getMySqlPool();
  const [rows] = await pool.execute(
    'SELECT id, steamapp_id, created_date FROM banned_games WHERE user_id = ?',
    [currentUserId],
  );

  return Array.isArray(rows) ? rows : [];
}

const bannedGames = Router();

bannedGames.post('/dbUser/get/bannedGames', async (req, res) => {
  const currentUserId = req.body.currentUserId ? Number(req.body.currentUserId) : undefined;

  if (!currentUserId) return;
  try {
    const bannedGames = await getBannedGames({ currentUserId });
    res.json({
      success: true,
      data: bannedGames,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default bannedGames;
