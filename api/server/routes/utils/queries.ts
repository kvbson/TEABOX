import { QueryTypes } from '../../../types/query.types.js';

// TODO: maybe switch to mongoose queries??

export const queries = (limit?: number): Record<QueryTypes, string> => {
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
          COUNT(r.review) AS review_count,
          AVG(CAST(r.voted_up AS INT64)) AS avg_score
      FROM \`emerald-water-462206-d0.steam_games.game_info\` g
      CROSS JOIN UNNEST(g.genres) AS genre
      JOIN \`emerald-water-462206-d0.steam_games.reviews_1\` r ON g.steam_appid = r.steam_appid
      GROUP BY genre
      ORDER BY review_count DESC
      ${limitCondition}`,

    bestReviewedGames: `
      WITH review_stats AS (
        SELECT
          steam_appid,
          COUNT(*) AS review_count,
          SUM(CAST(voted_up AS INT64)) AS upvotes,
          SAFE_DIVIDE(SUM(CAST(voted_up AS INT64)), COUNT(*)) AS positive_ratio
        FROM \`emerald-water-462206-d0.steam_games.reviews_1\`
        GROUP BY steam_appid
      )
        
      SELECT
        g.steam_appid,
        g.name,
        rs.review_count,
        rs.upvotes,
        rs.positive_ratio
      FROM \`emerald-water-462206-d0.steam_games.game_info\` g
      JOIN review_stats rs
        ON g.steam_appid = rs.steam_appid
      ORDER BY
        rs.review_count DESC,         -- Most reviews first
        rs.positive_ratio DESC         -- Then highest rating
      LIMIT 30`,
  };
};