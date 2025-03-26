import mongoose, { Schema } from 'mongoose';

// Owned Games Model
const OwnedGameSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  game: { type: Schema.Types.ObjectId, ref: 'GameInfo', required: true },
  playtimeForever: { type: Number, default: 0 },
  playtime2Weeks: { type: Number, default: 0 },
  lastPlayed: { type: Date },
}, { timestamps: true });

OwnedGameSchema.index({ user: 1, game: 1 }, { unique: true });

export const OwnedGame = mongoose.model('OwnedGame', OwnedGameSchema);
