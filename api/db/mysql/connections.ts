import mysql from 'mysql2/promise';
import fs from 'node:fs';
import path from 'node:path';
import { AIVEN_FILE } from '../../certs/setupCerts.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { initializeMySqlDB } from './utils/initializer.js';

dotenv.config();

let connection: mysql.Connection | null = null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getMySqlConnection = async () => {
  if (connection) return connection;

  try {
    const fullPath = path.join(__dirname, '../../certs/', AIVEN_FILE);

    const ca = fs.readFileSync(fullPath, 'utf8');

    const user = process.env.AIVEN_USER!;
    const password = process.env.AIVEN_PASSWORD!;
    const host = process.env.AIVEN_HOST!;
    const port = Number(process.env.AIVEN_PORT || 3306);

    console.log('🔌 Connecting to Aiven MySQL...');

    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database: 'defaultdb',
      ssl: {
        rejectUnauthorized: true,
        ca,
      },
    });

    console.log('✅ Connected to MySQL!');

    // TEST QUERY
    const [rows] = await connection.query('SELECT NOW() AS now');
    console.log('⏱ Test query result:', rows);

    initializeMySqlDB();

    return connection;
  } catch (err) {
    console.error('❌ Failed to connect to MySQL:', err);
    throw err;
  }
};

export default { getMySqlConnection };
