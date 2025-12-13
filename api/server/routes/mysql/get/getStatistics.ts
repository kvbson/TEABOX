import { Router } from 'express';
import { getMySqlPool } from '../../../../db/mysql/connections.js';
import { getQuery, QueryType } from '../../utils/getQuery.js';

export async function getStatistics(queryType: QueryType) {
  const pool = await getMySqlPool();
  const [rows] = await pool.query(getQuery[queryType]);

  return Array.isArray(rows) ? rows : [];
}

const statistics = Router();

statistics.post('/dbUser/get/statistics', async (req, res) => {
  const queryType = req.body.queryType;

  if (!queryType) return;
  try {
    const bannedGames = await getStatistics(queryType);
    res.json({
      success: true,
      data: bannedGames,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default statistics;
