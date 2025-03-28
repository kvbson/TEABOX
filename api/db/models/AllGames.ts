import mongoose, { Schema } from 'mongoose';

// All Games Model
const AllGamesListSchema = new Schema({
  steamAppId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
}, { timestamps: true });

export const AllGamesList = mongoose.model('AllGamesList', AllGamesListSchema);