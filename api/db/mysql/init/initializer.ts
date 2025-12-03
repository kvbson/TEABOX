import { Pool } from 'mysql2/promise';
import { prepareGameInfoSchema } from './tables/prepareGameInfoSchema.js';
import { prepareReviewsSchema } from './tables/prepareReviewSchema.js';
import { prepareUserSchema } from './tables/prepareUserSchema.js';
import { prepareTagsSchema } from './tables/prepareTagsSchema.js';

export const tableNames = {
  gameInfo: 'game_info',
  reviews: 'game_reviews',
  users: 'users',
  tags: 'tags',
};

export const initializeMySqlDB = async (pool: Pool, schemaName: string) => {
  const { gameInfo, reviews, users, tags } = tableNames;

  await pool.query(`CREATE DATABASE IF NOT EXISTS \`${schemaName}\`;`);
  await pool.query(`USE \`${schemaName}\`;`);
  console.log('✅ Using schema:', schemaName);
  const checkTable = async (tableName: string) => await tableExists(pool, tableName);
  if (!await checkTable(gameInfo)) {
    await prepareGameInfoSchema();
  }
  if (!await checkTable(reviews)) {
    await prepareReviewsSchema();
  }
  if (!await checkTable(users)) {
    await prepareUserSchema();
  }
  if (!await checkTable(tags)) {
    await prepareTagsSchema();
  }
};

async function tableExists(pool: Pool, tableName: string) {
  try {
    const query = `SELECT 1 FROM ${tableName} LIMIT 1;`;
    await pool.execute(query);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    console.log(`ℹ️ Table "${tableName}" does not exist.`);
    return false;
  }
}
