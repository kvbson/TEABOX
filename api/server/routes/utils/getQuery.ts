export type QueryType = 'bestPublishers' | 'mostRatedGenres' | 'bestReviewedGames';

export const getQuery: Record<QueryType, string> = {
  bestPublishers: `
    WITH ranked AS (
        SELECT
            p.publisher_name,
            COUNT(r.review) AS review_count,
            AVG(r.voted_up) AS avg_score,
            ROW_NUMBER() OVER (
                PARTITION BY AVG(r.voted_up)
                ORDER BY p.publisher_name
            ) AS rn
        FROM game_info g
        JOIN game_publishers p ON g.steam_appid = p.steam_appid
        JOIN game_reviews r ON g.steam_appid = r.steam_appid
        GROUP BY p.publisher_name
        HAVING review_count > 1000
    )
    SELECT
        publisher_name,
        review_count,
        avg_score
    FROM ranked
    WHERE rn = 1
        ORDER BY avg_score DESC
        LIMIT 30;
    `,
  mostRatedGenres: `
     WITH ranked AS (
    SELECT
        g.description AS genre,
        COUNT(r.review) AS review_count,
        AVG(r.voted_up) AS avg_score
    FROM game_genres g
    JOIN game_reviews r ON g.steam_appid = r.steam_appid
    GROUP BY g.description
    HAVING review_count > 1000
)
SELECT
    genre,
    review_count,
    avg_score
FROM ranked
ORDER BY avg_score DESC
LIMIT 30;
    `,
  bestReviewedGames: `
    WITH review_stats AS (
    SELECT
        steam_appid,
        COUNT(*) AS review_count,
        SUM(voted_up) AS upvotes,
        IF(COUNT(*) = 0, NULL, SUM(voted_up) / COUNT(*)) AS positive_ratio
    FROM game_reviews
    GROUP BY steam_appid
)
SELECT
    g.steam_appid,
    g.name,
    rs.review_count,
    rs.upvotes,
    rs.positive_ratio
FROM game_info g
JOIN review_stats rs
    ON g.steam_appid = rs.steam_appid
ORDER BY
    rs.review_count DESC,
    rs.positive_ratio DESC
LIMIT 30;
    `,
};