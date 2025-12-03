import { ReviewsSchemaType } from '../db/mongoDB/models/Reviews.js';

/**
 * Represents a Steam review author's profile data.
 */
type SteamReviewAuthor = {
    steamid: string; // SteamID64 of the reviewer
    num_games_owned: number; // Total games owned by the author
    num_reviews: number; // Number of reviews written by the author
    playtime_forever: number; // Lifetime playtime (in minutes)
    playtime_last_two_weeks: number; // Playtime in the last 2 weeks (minutes)
    playtime_at_review: number; // Playtime when the review was written (minutes)
    last_played: number; // Unix timestamp of last play session
  }

// Response structure for the Steam API
type SteamReviewsResponse = {
  success: boolean;
  query_summary?: {
    num_reviews: number;
    review_score: number;
    total_positive: number;
    total_negative: number;
    review_score_desc: string;
    total_reviews: number;
  };
  reviews: ReviewsSchemaType[];
  cursor?: string;
}

export type { SteamReviewAuthor, SteamReviewsResponse };