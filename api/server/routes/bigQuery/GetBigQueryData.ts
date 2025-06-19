import { BigQuery } from '@google-cloud/bigquery';
import { Router } from 'express';
import fs from 'node:fs';
import { BigQueryTypes } from '../../../types/bigQuery.types.js';
import { queries } from './queries.js';

const bigQueryData = Router();

const bigQueryAccount = fs.existsSync('api/certs/bigquery-acc.json') && JSON.parse(fs.readFileSync('api/certs/bigquery-acc.json', 'utf-8'));
const bigQuery = new BigQuery(
  process.env.NODE_ENV === 'development' && bigQueryAccount ? {
    projectId: bigQueryAccount.project_id,
    keyFilename: 'api/certs/bigquery-acc.json',
  } : {});

const getBigQueryData = async (bigQueryType: BigQueryTypes, limit?: number) => {
  const [rows] = await bigQuery.query({ query: queries(limit)[bigQueryType] });
  return rows;
};

bigQueryData.get('/queries', async (req, res) => {
  const bigQueryType = req.query.bigQueryType as BigQueryTypes;
  const limit = req.query.limit;

  try {
    const data = await getBigQueryData(bigQueryType, !isNaN(Number(limit)) ? Number(limit) : undefined);

    res.json({ success: true, data });
  } catch (error) {
    console.error('BigQuery error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

export default bigQueryData;
