import { getMySqlPool } from '../../connections.js';

export async function prepareUserSchema() {
  const pool = await getMySqlPool();
  console.log('🔧 Preparing User schema...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      steam_appid INT,
      email VARCHAR(255),
      password_hash VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ User schema prepared.');
}