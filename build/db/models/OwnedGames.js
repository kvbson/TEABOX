import mongoose, { Schema } from 'mongoose';
// Owned Games Model
const OwnedGamesSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    games: [{ type: Schema.Types.ObjectId, ref: 'GameInfo', required: true }],
    playtimeForever: { type: Number, default: 0 },
    playtime2Weeks: { type: Number, default: 0 },
    lastPlayed: { type: Date },
}, { timestamps: true, _id: false });
OwnedGamesSchema.index({ user: 1, game: 1 }, { unique: true });
export const OwnedGame = mongoose.model('OwnedGames', OwnedGamesSchema);
