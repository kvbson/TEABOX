import { ReviewsSchemaType } from '../../mongoDB/models/Reviews.js';
import { getMySqlPool } from '../connections.js';
import { normalizeValue, boolToInt, parse10Int } from '../utils/functions.js';

export async function insertReview(review: ReviewsSchemaType) {
  if (!review || review.steam_appid == null) {
    console.warn('Skipping invalid review info:', review);
    return;
  }

  const pool = await getMySqlPool();
  await pool.query(
    'REPLACE INTO game_reviews SET ?',
    [{
      steam_appid: parse10Int(review.steam_appid),
      recommendation_id: normalizeValue(parse10Int(review.recommendationid)),
      language: normalizeValue(review.language),
      review: normalizeValue(review.review),
      voted_up: boolToInt(review.voted_up),
      votes_up: normalizeValue(parse10Int(review.votes_up)),
      votes_funny: normalizeValue(parse10Int(review.votes_funny)),
      weighted_vote_score: normalizeValue(review.weighted_vote_score),
      steam_purchase: boolToInt(review.steam_purchase),
      received_for_free: boolToInt(review.received_for_free),
      written_during_early_access: boolToInt(review.written_during_early_access),
      primarily_steam_deck: boolToInt(review.primarily_steam_deck),
      comment_count: normalizeValue(parse10Int(review.comment_count)),
      timestamp_created: review.timestamp_created ? new Date(review.timestamp_created) : null,
      timestamp_updated: review.timestamp_updated ? new Date(review.timestamp_updated) : null,
    }],
  );
}
