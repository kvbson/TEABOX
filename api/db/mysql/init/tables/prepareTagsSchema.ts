import { getMySqlPool } from '../../connections.js';

export async function prepareTagsSchema() {
  const pool = await getMySqlPool();
  console.log('🔧 Preparing Tags schema...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tags (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tag_name VARCHAR(100) UNIQUE NOT NULL
    );
  `);

  console.log('✅ Tags schema prepared.');
}