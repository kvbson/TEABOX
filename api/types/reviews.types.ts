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

/**
 * Represents a Steam game review.
 */
type SteamReview = {
  author: SteamReviewAuthor;
  language: string; // Review language (e.g., "english")
  review: string; // The review text
  timestamp_created: number; // Unix timestamp when the review was posted
  timestamp_updated: number; // Unix timestamp when the review was last edited
  voted_up: boolean; // Whether the reviewer recommended the game
  votes_up: number; // Number of "helpful" votes
  votes_funny: number; // Number of "funny" votes
  weighted_vote_score: number; // Score based on vote weighting (0.0–1.0)
  comment_count: number; // Number of comments on the review
  steam_purchase: boolean; // Whether the game was purchased on Steam
  received_for_free: boolean; // Whether the game was received for free
  written_during_early_access: boolean; // If the review was during Early Access
  primarily_steam_deck: boolean; // Whether the reviewer primarily plays on Steam Deck
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
  reviews: SteamReview[];
  cursor?: string;
}

export type { SteamReview, SteamReviewAuthor, SteamReviewsResponse };