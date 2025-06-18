import { BigQuery } from '@google-cloud/bigquery';
import { Router } from 'express';
import fs from 'node:fs';

export type BigQueryTypes = 'bestPublishers' |'mostRatedGenres'

const bigQueryData = Router();

const bigQueryAccount = fs.existsSync('api/certs/bigquery-acc.json') && JSON.parse(fs.readFileSync('api/certs/bigquery-acc.json', 'utf-8'));
const bigQuery = new BigQuery(
  process.env.NODE_ENV === 'development' && bigQueryAccount ? {
    projectId: bigQueryAccount.project_id || 'emerald-water-462206-d0',
    keyFilename: 'api/certs/bigquery-acc.json',
  } : {});

const queries: Record<BigQueryTypes, string> = {
  bestPublishers: ` SELECT 
  publisher,
  COUNT(r.review) AS review_count,
  AVG(CAST(r.voted_up AS INT64)) AS avg_score
FROM \`emerald-water-462206-d0.steam_games.game_info\` g,
UNNEST(g.publishers) AS publisher
JOIN \`emerald-water-462206-d0.steam_games.reviews_1\` r
  ON g.steam_appid = r.steam_appid
GROUP BY publisher
HAVING review_count > 50
ORDER BY avg_score DESC
LIMIT 30`,
  mostRatedGenres: `SELECT
  genre.description AS genre,
  COUNT(r.review) AS review_count
FROM \`emerald-water-462206-d0.steam_games.game_info\` g
CROSS JOIN UNNEST(g.genres) AS genre
JOIN \`emerald-water-462206-d0.steam_games.reviews_1\` r
  ON g.steam_appid = r.steam_appid
GROUP BY genre
ORDER BY review_count DESC`,

};

const getBigQueryData = async (bigQueryType: BigQueryTypes) => {
  const [rows] = await bigQuery.query({ query: queries[bigQueryType] });
  return rows;
};

bigQueryData.get('/queries', async (req, res) => {
  const bigQueryType = req.query.bigQueryType as BigQueryTypes;

  try {
    const data = await getBigQueryData(bigQueryType);

    res.json({ success: true, data });
  } catch (error) {
    console.error('BigQuery error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

export default bigQueryData;
