import { BigQueryTypes } from '../../../types/bigQuery.types.js';

export const queries = (limit?: number): Record<BigQueryTypes, string> => {
  const limitCondition = limit ? `LIMIT ${limit}` : '';

  return {
    bestPublishers: `
      SELECT 
          publisher,
          COUNT(r.review) AS review_count,
          AVG(CAST(r.voted_up AS INT64)) AS avg_score
      FROM \`emerald-water-462206-d0.steam_games.game_info\` g,
      UNNEST(g.publishers) AS publisher
      JOIN \`emerald-water-462206-d0.steam_games.reviews_1\` r ON g.steam_appid = r.steam_appid
      GROUP BY publisher
      HAVING review_count > 50
      ORDER BY avg_score DESC
      ${limitCondition}`,

    mostRatedGenres: `
      SELECT
          genre.description AS genre,
          COUNT(r.review) AS review_count
      FROM \`emerald-water-462206-d0.steam_games.game_info\` g
      CROSS JOIN UNNEST(g.genres) AS genre
      JOIN \`emerald-water-462206-d0.steam_games.reviews_1\` r ON g.steam_appid = r.steam_appid
      GROUP BY genre
      ORDER BY review_count DESC
      ${limitCondition}`,
  };
};