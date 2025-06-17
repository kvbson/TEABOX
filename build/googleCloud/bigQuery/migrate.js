import { BigQuery } from '@google-cloud/bigquery';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'node:fs';
import { cleanForFirestore } from '../firestore/connections.js';
import { GameInfo } from '#api/db/models/GameInfo';
import sanitizeHtml from 'sanitize-html';
import { Reviews } from '#api/db/models/Reviews';
dotenv.config();
const serviceAccount = JSON.parse(fs.readFileSync('api/certs/firestore-acc.json', 'utf-8'));
const bigquery = new BigQuery({
    projectId: serviceAccount.project_id,
    keyFilename: 'api/certs/firestore-acc.json',
});
//TODO: naprawić daty w schematach (TIMESTAMP)
const reviewsSchema = [
    { name: 'recommendationid', type: 'STRING', mode: 'REQUIRED' },
    { name: 'steam_appid', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'language', type: 'STRING', mode: 'NULLABLE' },
    { name: 'author', type: 'RECORD', mode: 'REQUIRED', fields: [
            { name: 'steamid', type: 'STRING', mode: 'REQUIRED' },
            { name: 'num_games_owned', type: 'INTEGER', mode: 'NULLABLE' },
            { name: 'num_reviews', type: 'INTEGER', mode: 'NULLABLE' },
            { name: 'playtime_forever', type: 'INTEGER', mode: 'NULLABLE' },
            { name: 'playtime_last_two_weeks', type: 'INTEGER', mode: 'NULLABLE' },
            { name: 'playtime_at_review', type: 'INTEGER', mode: 'NULLABLE' },
            // { name: 'last_played', type: 'TIMESTAMP', mode: 'NULLABLE' },
        ] },
    { name: 'review', type: 'STRING', mode: 'NULLABLE' },
    // { name: 'timestamp_created', type: 'TIMESTAMP', mode: 'REQUIRED' },
    // { name: 'timestamp_updated', type: 'TIMESTAMP', mode: 'NULLABLE' },
    { name: 'voted_up', type: 'BOOLEAN', mode: 'REQUIRED' },
    { name: 'votes_up', type: 'INTEGER', mode: 'NULLABLE' },
    { name: 'votes_funny', type: 'INTEGER', mode: 'NULLABLE' },
    { name: 'weighted_vote_score', type: 'FLOAT64', mode: 'NULLABLE' },
    { name: 'steam_purchase', type: 'BOOLEAN', mode: 'NULLABLE' },
    { name: 'received_for_free', type: 'BOOLEAN', mode: 'NULLABLE' },
    { name: 'written_during_early_access', type: 'BOOLEAN', mode: 'NULLABLE' },
    { name: 'primarily_steam_deck', type: 'BOOLEAN', mode: 'NULLABLE' },
];
// Schemat tabeli w BigQuery
const gameInfoSchema = [
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
        await Promise.all([saveToDatabase(await fetchGameInfo(), 'game_info', gameInfoSchema), saveToDatabase(await fetchReviews(), 'reviews', reviewsSchema)]);
        ;
        await mongoose.disconnect();
        console.log('Migration completed successfully');
    }
    catch (error) {
        error?.errors?.forEach((err) => console.log(err.err));
        console.error('Migration failed:', error);
        process.exit(1);
    }
    async function saveToDatabase(rows, tableId, schema) {
        const datasetId = 'steam_games';
        const [dataset] = await bigquery.dataset(datasetId).get({ autoCreate: true });
        const [tableExists] = await dataset.table(tableId).exists();
        console.log(`Table ${tableId} exists: ${tableExists}`);
        if (!tableExists) {
            await dataset.createTable(tableId, { schema });
        }
        const [table] = await dataset.table(tableId).get();
        console.log(`Using table: ${table.id}`);
        const batchSize = 300;
        for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);
            console.log(`Inserting batch ${Math.ceil(i / batchSize) + 1} of ${Math.ceil(rows.length / batchSize)}`);
            const [job] = await table.insert(batch);
            console.log(`Inserted rows. Job ID: ${job.kind}`);
        }
    }
    async function fetchReviews() {
        const reviews = cleanForFirestore(await Reviews.find().lean().exec());
        console.log(`Found ${reviews.length} reviews to migrate`);
        return Array.isArray(reviews) ? reviews.filter(review => !!Number(review.steam_appid)).map(review => ({
            recommendationid: review.recommendationid,
            steam_appid: Number(review.steam_appid),
            language: review.language || 'english',
            author: review.author ? {
                steamid: review.author.steamid,
                num_games_owned: review.author.num_games_owned || 0,
                num_reviews: review.author.num_reviews || 0,
                playtime_forever: review.author.playtime_forever || 0,
                playtime_last_two_weeks: review.author.playtime_last_two_weeks || 0,
                playtime_at_review: review.author.playtime_at_review || 0,
                // last_played: review.author.last_played ? new Date(review.author.last_played) : null,
            } : null,
            review: review.review || null,
            voted_up: review.voted_up || false,
            votes_up: review.votes_up || 0,
            votes_funny: review.votes_funny || 0,
            weighted_vote_score: review.weighted_vote_score || 0,
            steam_purchase: review.steam_purchase || false,
            received_for_free: review.received_for_free || false,
            written_during_early_access: review.written_during_early_access || false,
            primarily_steam_deck: review.primarily_steam_deck || false,
        })) : [];
    }
    async function fetchGameInfo() {
        const games = cleanForFirestore(await GameInfo.find().lean().exec());
        const sanitize = (str) => sanitizeHtml(str, { allowedTags: [], allowedAttributes: {} });
        // console.log(games[0]);
        // return;
        console.log(`Found ${games.length} games to migrate`);
        // Przygotowanie danych dla BigQuery
        return games.filter((game) => !!Number(game.steam_appid)).map((game) => ({
            steam_appid: Number(game.steam_appid),
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
            categories: (game.categories || []).map((cat) => ({
                id: cat.id,
                description: cat.description,
            })),
            genres: (game.genres || []).map((gen) => ({
                id: gen.id,
                description: gen.description,
            })),
            // release_date: game.release_date,
        }));
    }
}
