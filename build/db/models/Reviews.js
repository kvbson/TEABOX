import mongoose from 'mongoose';
const AuthorSchema = new mongoose.Schema({
    steamid: { type: String, required: true, index: true },
    num_games_owned: { type: Number, default: 0 },
    num_reviews: { type: Number, default: 0 },
    playtime_forever: { type: Number, default: 0 }, // in minutes
    playtime_last_two_weeks: { type: Number, default: 0 },
    playtime_at_review: { type: Number, default: 0 },
    last_played: { type: Date, default: null },
}, { _id: false });
const ReviewsSchema = new mongoose.Schema({
    // Metadata
    recommendationid: { type: String, required: true, unique: true },
    steam_appid: { type: String, required: true, index: true }, // Game being reviewed
    language: { type: String, default: 'english', index: true },
    // Author info (embedded)
    author: { type: AuthorSchema, required: true },
    // Review content
    review: { type: String, text: true }, // Enable text search
    timestamp_created: { type: Date, required: true },
    timestamp_updated: { type: Date, default: null },
    // Voting stats
    voted_up: { type: Boolean, required: true },
    votes_up: { type: Number, default: 0 },
    votes_funny: { type: Number, default: 0 },
    weighted_vote_score: { type: Number, default: 0 },
    // Flags
    steam_purchase: { type: Boolean, default: false },
    received_for_free: { type: Boolean, default: false },
    written_during_early_access: { type: Boolean, default: false },
    primarily_steam_deck: { type: Boolean, default: false },
    // Denormalized stats (for faster queries)
    comment_count: { type: Number, default: 0 },
}, {
    timestamps: false, // We use custom timestamp fields
});
// Indexes for common queries
ReviewsSchema.index({ steam_appid: 1, weighted_vote_score: -1 }); // Top reviews per game
ReviewsSchema.index({ voted_up: 1 }); // Filter positive/negative reviews
ReviewsSchema.index({ review: 'text' }); // Full-text search
export const Reviews = mongoose.model('Reviews', ReviewsSchema);
