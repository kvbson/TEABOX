import mysql from 'mysql2/promise';
import fs from 'node:fs';
import path from 'node:path';
import { AIVEN_FILE } from '../../certs/setupCerts.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { initializeMySqlDB } from './init/initializer.js';

dotenv.config();

let pool: mysql.Pool | null = null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaName = 'main_schema';

export const getMySqlPool = async () => {
  if (pool) return pool;

  try {
    const fullPath = path.join(__dirname, '../../certs/', AIVEN_FILE);

    const ca = fs.readFileSync(fullPath, 'utf8');

    const user = process.env.AIVEN_USER;
    const password = process.env.AIVEN_PASSWORD;
    const host = process.env.AIVEN_HOST;
    const port = Number(process.env.AIVEN_PORT || 3306);

    if (!user || !password || !host) {
      throw new Error('Missing Aiven MySQL connection environment variables.');
    }

    console.log('🔌 Connecting to Aiven MySQL...');

    pool = await mysql.createPool({
      host,
      port,
      user,
      password,
      database: schemaName,
      ssl: {
        rejectUnauthorized: true,
        ca,
      },
      waitForConnections: true,
      connectionLimit: 10, // ⬅️ aiven safe restricts to 10 pools
      queueLimit: 0,
    });

    console.log('✅ Connected to MySQL!');

    // TEST QUERY
    const [rows] = await pool.query('SELECT NOW() AS now');
    console.log('⏱ Test query result:', rows);

    await initializeMySqlDB(pool, schemaName);
    // console.log('✅ MySQL DB initialized! Starting migration...');
    /* Later for deleting - initializing MongoDb and sending data to MySQL */
    // await connectDB();
    // const gamesInfo = await GameInfo.find();
    // await new Promise(() => {
    //   batch(gamesInfo, 10, insertGameInfo);
    // });
    // console.log('✅ Game info migration completed!');
    // const reviews = await Reviews.find();
    // await new Promise((resolve, reject) => {
    //   batch(reviews, 10, insertReview)
    //     .then(() => resolve(undefined))
    //     .catch(reject);
    // });

    // console.log('✅ Reviews migration completed!');
    // const tags = await Tag.find();
    // await new Promise((resolve, reject) => {
    //   batch(tags, 10, insertTag)
    //     .then(() => resolve(undefined))
    //     .catch(reject);
    // });
    return pool;
  } catch (err) {
    console.error('❌ Failed to connect to MySQL:', err);
    throw err;
  }
};

export default { getMySqlPool };