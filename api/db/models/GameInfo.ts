import mongoose, { InferSchemaType, Schema } from 'mongoose';

export type GameInfoSchemaType = InferSchemaType<typeof GameInfoSchema>

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
  path_thumbnail: { type: String },
  path_full: { type: String },
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

// Game Info
export const GameInfoSchema = new Schema({
  steam_appid: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  platforms: {
    windows: Boolean,
    mac: Boolean,
    linux: Boolean,
  },
  short_description: { type: String },
  detailed_description: { type: String },
  is_free: { type: Boolean },
  controller_support: {
    type: String,
    enum: ['full', 'partial'],
    required: false,
  },
  about_the_game: { type: String },
  supported_languages: { type: String },
  pc_requirements: {
    minimum: String,
    recommended: String,
  },
  mac_requirements: {
    minimum: String,
    recommended: String,
  },
  linux_requirements: {
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
  release_date: {
    coming_soon: { type: Boolean },
    date: { type: Date },
  },
  app_url: { type: String },
  required_age: Number,
  price_overview: {
    currency: String,
    initial: Number,
    final: Number,
    initial_formatted: String,
    final_formatted: String,
    discount_percent: Number,
  },
},
{
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  _id: false,
});

//TODO: missing - playersCount

export const GameInfo = mongoose.model('GameInfo', GameInfoSchema);

