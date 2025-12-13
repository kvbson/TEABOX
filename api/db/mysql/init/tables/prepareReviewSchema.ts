import { getMySqlPool } from '../../connections.js';

export async function prepareReviewsSchema() {
  const pool = await getMySqlPool();
  console.log('🔧 Preparing Reviews schema...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS game_reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      steam_appid INT NOT NULL,
      recommendation_id INT,
      language VARCHAR(100),
      review TEXT,
      voted_up BOOLEAN,
      votes_up INT,
      votes_funny INT,
      weighted_vote_score FLOAT,
      steam_purchase BOOLEAN,
      received_for_free BOOLEAN,
      written_during_early_access BOOLEAN,
      primarily_steam_deck BOOLEAN,
      comment_count INT,
      timestamp_created DATETIME,
      timestamp_updated DATETIME,
      FOREIGN KEY (steam_appid) REFERENCES game_info(steam_appid)
    );
  `);

  console.log('✅ Reviews schema prepared.');
}