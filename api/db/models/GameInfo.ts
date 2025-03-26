import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema({
  id: { type: Number },
  description: { type: String },
});

const GenresSchema = new Schema({
  id: { type: Number },
  description: { type: String },
});

const ScreenshotsSchema = new Schema({
  id: { type: Number },
  pathThumbnail: { type: String },
  pathFull: { type: String },
});

const MoviesSchema = new Schema({
  id: { type: Number },
  name: { type: String },
  thumbnail: { type: String },
  webm: {
    '480': String,
    max: String,
  },
  mp4: {
    '480': String,
    max: String,
  },
  highlight: Boolean,
});

// Game Info Model (Core game metadata)
const GameInfoSchema = new Schema({
  steamAppId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  platforms: {
    windows: Boolean,
    mac: Boolean,
    linux: Boolean,
  },
  shortDescription: { type: String },
  detailedDescription: { type: String },
  isFree: { type: Boolean },
  controllerSupport: {
    type: String,
    enum: ['full', 'partial'],
    required: false,
  },
  aboutTheGame: { type: String },
  supportedLanguages: { type: String },
  pcRequirements: {
    minimum: String,
    recommended: String,
  },
  macRequirements: {
    minimum: String,
    recommended: String,
  },
  linuxRequirements: {
    minimum: String,
    recommended: String,
  },
  developers: [String],
  publishers: [String],
  metacritic: {
    score: Number,
    url: String,
  },
  categories: [CategorySchema],
  genres: [GenresSchema],
  screenshots: [ScreenshotsSchema],
  movies: [MoviesSchema],
  releaseDate: { type: Date },
  appUrl: { type: String },
  price: {
    currency: String,
    initial: Number,
    final: Number,
    initialFormatted: String,
    finalFormatted: String,
  },

}, { timestamps: true });

//TODO: brakuje - reviews

GameInfoSchema.index({ steamAppId: 1, name: 1 });

export const GameInfo = mongoose.model('GameInfo', GameInfoSchema);

