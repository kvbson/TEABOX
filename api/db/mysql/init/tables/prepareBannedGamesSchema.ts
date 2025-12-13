import { getMySqlPool } from '../../connections.js';

export async function prepareBannedGamesSchema() {
  const pool = await getMySqlPool();
  console.log('🔧 Preparing Tags schema...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS banned_games (
       id INT AUTO_INCREMENT PRIMARY KEY,
       user_id INT NOT NULL,
       steamapp_id INT NOT NULL,
       created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ Tags schema prepared.');
}