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
  const entry = await MissingApp.findOne({ appId });

  if (entry) {
    if (!entry.confirmed) {
      entry.failureCount += 1;
      if (entry.failureCount >= maxFails) {
        entry.confirmed = true;
      }
      await entry.save();
    }
  } else {
    await MissingApp.create({ appId, failureCount: 1 });
  }
}

export async function handleFailedReviewAppId(appId: string) {
  const entry = await MissingReviewApp.findOne({ appId });
  if (entry) {
    if (!entry.confirmed) {
      entry.failureCount += 1;
      if (entry.failureCount >= maxFails) {
        entry.confirmed = true;
      }
      await entry.save();
    }
  } else {
    await MissingReviewApp.create({ appId, failureCount: 1 });
  }
}
