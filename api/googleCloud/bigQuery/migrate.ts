import { BigQuery, Table } from '@google-cloud/bigquery';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'node:fs';
import { cleanForFirestore } from '../firestore/connections.js';
import { GameInfo } from '#api/db/models/GameInfo';
import sanitizeHtml from 'sanitize-html';

dotenv.config();

const serviceAccount = JSON.parse(fs.readFileSync('api/certs/firestore-acc.json', 'utf-8'));

const bigquery = new BigQuery({
  projectId: serviceAccount.project_id,
  keyFilename: 'api/certs/firestore-acc.json',
});

// Schemat tabeli w BigQuery
const schema = [
  { name: 'steam_appid', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'name', type: 'STRING', mode: 'REQUIRED' },
  { name: 'platforms', type: 'RECORD', mode: 'NULLABLE', fields: [
    { name: 'windows', type: 'BOOLEAN' },
    { name: 'mac', type: 'BOOLEAN' },
    { name: 'linux', type: 'BOOLEAN' },
  ] },
  { name: 'short_description', type: 'STRING' },
  { name: 'detailed_description', type: 'STRING' },
  { name: 'is_free', type: 'BOOLEAN' },
  { name: 'cons', type: 'STRING', mode: 'REPEATED' },
  { name: 'pros', type: 'STRING', mode: 'REPEATED' },
  { name: 'controller_support', type: 'STRING' },
  { name: 'about_the_game', type: 'STRING' },
  { name: 'supported_languages', type: 'STRING' },
  { name: 'background', type: 'STRING' },
  { name: 'pc_requirements', type: 'RECORD', fields: [
    { name: 'minimum', type: 'STRING' },
    { name: 'recommended', type: 'STRING' },
  ] },
  { name: 'mac_requirements', type: 'RECORD', fields: [
    { name: 'minimum', type: 'STRING' },
    { name: 'recommended', type: 'STRING' },
  ] },
  { name: 'linux_requirements', type: 'RECORD', fields: [
    { name: 'minimum', type: 'STRING' },
    { name: 'recommended', type: 'STRING' },
  ] },
  { name: 'developers', type: 'STRING', mode: 'REPEATED' },
  { name: 'publishers', type: 'STRING', mode: 'REPEATED' },
  { name: 'metacritic', type: 'RECORD', mode: 'REPEATED', fields: [
    { name: 'score', type: 'INTEGER' },
    { name: 'url', type: 'STRING' },
  ] },
  { name: 'categories', type: 'RECORD', mode: 'REPEATED', fields: [
    { name: 'id', type: 'INTEGER' },
    { name: 'description', type: 'STRING' },
  ] },
  { name: 'genres', type: 'RECORD', mode: 'REPEATED', fields: [
    { name: 'id', type: 'INTEGER' },
    { name: 'description', type: 'STRING' },
  ] },
  { name: 'required_age', type: 'STRING' },
  // { name: 'release_date', type: 'RECORD', fields: [
  //   { name: 'coming_soon', type: 'BOOLEAN' },
  //   { name: 'date', type: 'TIMESTAMP' },
  // ] },
];

export async function migrateData() {
  try {

    // Pobranie wszystkich dokumentów
    const games = cleanForFirestore(await GameInfo.find().lean().exec());
    const sanitize = (str: string) => sanitizeHtml(str, { allowedTags: [], allowedAttributes: {} });
    // console.log(games[0]);
    // return;
    console.log(`Found ${games.length} games to migrate`);
    // Przygotowanie danych dla BigQuery
    const rows = games.filter((game: any) => !!game.steam_appid).map((game: any) => ({
      steam_appid: game.steam_appid,
      name: game.name || null,
      is_free: game.is_free || false,
      controller_support: game.controller_support || null,
      about_the_game: sanitize(game.about_the_game) || null,
      supported_languages: game.supported_languages || null,
      background: game.background || null,
      required_age: game.required_age || null,
      platforms: {
        windows: !!game.platforms?.windows || false,
        mac: !!game.platforms?.mac || false,
        linux: !!game.platforms?.linux || false,
      },
      short_description: sanitize(game.short_description),
      detailed_description: sanitize(game.detailed_description),
      cons: game.cons || [],
      pros: game.pros || [],
      pc_requirements: {
        minimum: sanitize(game.pc_requirements?.minimum || ''),
        recommended: sanitize(game.pc_requirements?.recommended || ''),
      },
      mac_requirements: {
        minimum: sanitize(game.mac_requirements?.minimum || ''),
        recommended: sanitize(game.mac_requirements?.recommended || ''),
      },
      linux_requirements: {
        minimum: sanitize(game.linux_requirements?.minimum || ''),
        recommended: sanitize(game.linux_requirements?.recommended || ''),
      },
      developers: game.developers || [],
      publishers: game.publishers || [],
      metacritic: game.metacritic ? [{
        score: game.metacritic.score || null,
        url: game.metacritic.url || '',
      }] : [],
      categories: (game.categories || []).map((cat: any) => ({
        id: cat.id,
        description: cat.description,
      })),
      genres: (game.genres || []).map((gen: any) => ({
        id: gen.id,
        description: gen.description,
      })),
      // release_date: game.release_date,
    }));
    console.log(rows[0]);
    // return;

    const datasetId = 'steam_games';
    const tableId = 'game_info_test_8';

    const [dataset] = await bigquery.dataset(datasetId).get({ autoCreate: true });

    const [tableExists] = await dataset.table(tableId).exists();
    console.log(`Table ${tableId} exists: ${tableExists}`);

    if (!tableExists) {
      await dataset.createTable(tableId, { schema });
    }
    const [table] = await dataset.table(tableId).get();
    console.log(`Using table: ${table.id}`);

    const batchSize = 50;
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.ceil(i / batchSize) + 1} of ${Math.ceil(rows.length / batchSize)}`);
      const [job] = await (table as Table).insert(batch);
      console.log(`Inserted rows. Job ID: ${job.kind}`);
    }

    await mongoose.disconnect();
    console.log('Migration completed successfully');
  } catch (error: any) {
    (error as any)?.errors?.forEach((err: any) => console.log(err.err));
    console.error('Migration failed:', error);
    process.exit(1);
  }
}