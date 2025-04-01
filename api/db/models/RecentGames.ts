import mongoose, { Schema } from 'mongoose';

// Recently Played Games Model
const RecentlyPlayedSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  games: [{
    game: { type: Schema.Types.ObjectId, ref: 'GameInfo', required: true },
    playtimeRecent: { type: Number, default: 0 },
    lastPlayed: { type: Date, default: Date.now },
  }],
}, { timestamps: true, _id: false });

RecentlyPlayedSchema.index({ user: 1 });

export const RecentlyPlayed = mongoose.model('RecentlyPlayed', RecentlyPlayedSchema);

