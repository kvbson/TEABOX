import { MissingApp } from "../../../db/models/other/MissingAppIds.js";

export const checkAppId = async (appId: string): Promise<{ action: 'skip' | 'continue' }> => {
  const dbRecord = await MissingApp.findOne({ appId });
  if (dbRecord?.confirmed) {
    return { action: 'skip' };
  }
  return { action: 'continue' };
};