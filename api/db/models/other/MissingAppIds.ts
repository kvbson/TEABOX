import mongoose from 'mongoose';

const maxFails = 10;

const missingAppSchema = new mongoose.Schema({
  appId: { type: String, unique: true },
  failureCount: { type: Number, default: 1 },
  confirmed: { type: Boolean, default: false },
});

export const MissingApp = mongoose.model('MissingApp', missingAppSchema);
export const MissingReviewApp = mongoose.model('MissingReviewApp', missingAppSchema);

export async function handleFailedAppId(appId: string) {
  const entry = await MissingApp.findOneAndUpdate(
    { appId },
    {
      $inc: { failureCount: 1 },
      $setOnInsert: { confirmed: false },
    },
    {
      upsert: true,
      new: true,
    },
  );

  if (entry.failureCount >= maxFails && !entry.confirmed) {
    entry.confirmed = true;
    await entry.save();
  }
}

export async function handleFailedReviewAppId(appId: string) {
  const entry = await MissingReviewApp.findOneAndUpdate(
    { appId },
    {
      $inc: { failureCount: 1 },
      $setOnInsert: { confirmed: false },
    },
    {
      upsert: true,
      new: true,
    },
  );

  if (entry.failureCount >= maxFails && !entry.confirmed) {
    entry.confirmed = true;
    await entry.save();
  }
}