import { ReviewsSchemaType, Reviews } from '#api/db/models/Reviews';

/**
 * Transforms raw Steam API review data into Mongoose-compatible format
 * Throws clear errors if required fields are missing
 */
export function parseReviewData(rawReview: any, steamAppId: string): ReviewsSchemaType {
  // Validate required fields exist
  console.log(rawReview);
  if (!rawReview.recommendationid) throw new Error('Missing required field: recommendationid');
  if (!rawReview.author) throw new Error('Missing required field: author');
  if (!rawReview.review) throw new Error('Missing required field: review');
  if (!rawReview.timestamp_created) throw new Error('Missing required field: timestamp_created');
  if (typeof rawReview.voted_up === 'undefined') throw new Error('Missing required field: voted_up');

  // Parse author data
  const author = {
    steamid: String(rawReview.author.steamid || ''),
    num_games_owned: Number(rawReview.author.num_games_owned) || 0,
    num_reviews: Number(rawReview.author.num_reviews) || 0,
    playtime_forever: Number(rawReview.author.playtime_forever) || 0,
    playtime_last_two_weeks: Number(rawReview.author.playtime_last_two_weeks) || 0,
    playtime_at_review: Number(rawReview.author.playtime_at_review) || 0,
    last_played: new Date(rawReview.author.last_played * 1000),
  };

  // Convert Unix timestamps to Dates
  const timestamp_created = new Date(rawReview.timestamp_created * 1000);
  const timestamp_updated = new Date(rawReview.timestamp_updated * 1000);

  // Build the parsed review
  const parsed: ReviewsSchemaType = {
    recommendationid: String(rawReview.recommendationid),
    steam_appid: steamAppId,
    language: String(rawReview.language || 'english'),
    author,
    review: String(rawReview.review),
    timestamp_created,
    timestamp_updated,
    voted_up: Boolean(rawReview.voted_up),
    votes_up: Number(rawReview.votes_up) || 0,
    votes_funny: Number(rawReview.votes_funny) || 0,
    weighted_vote_score: Number(rawReview.weighted_vote_score) || 0,
    steam_purchase: Boolean(rawReview.steam_purchase),
    received_for_free: Boolean(rawReview.received_for_free),
    written_during_early_access: Boolean(rawReview.written_during_early_access),
    primarily_steam_deck: Boolean(rawReview.primarily_steam_deck),
    comment_count: Number(rawReview.comment_count) || 0,
  };

  return parsed;
}

/**
 * Bulk insert reviews with validation
 */
export async function insertReviews(rawReviews: any[], steamAppId: string) {
  const parsedReviews = rawReviews.map(raw => {
    try {
      return parseReviewData(raw, steamAppId);
    } catch (error) {
      console.error(`Skipping invalid review ${raw.recommendationid}:`, error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }).filter(Boolean);

  if (parsedReviews.length > 0) {
    return Reviews.insertMany(parsedReviews, { ordered: false });
  }
  return [];
}