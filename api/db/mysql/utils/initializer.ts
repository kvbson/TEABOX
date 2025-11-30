import { getMySqlConnection } from '../connections.js';
import { prepareGameInfoSchema } from './prepareSchema.js';

export const initializeMySqlDB = async () => {
  const conn = await getMySqlConnection();
  const schemaName = 'main_schema';

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${schemaName}\`;`);
  await conn.query(`USE \`${schemaName}\`;`);
  console.log('✅ Using schema:', schemaName);
  await prepareGameInfoSchema();

};