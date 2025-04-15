import { MissingApp } from '#api/db/models/other/MissingAppIds';

export const checkAppId = async (appId: string): Promise<{ action: 'skip' | 'continue' }> => {
  const dbRecord = await MissingApp.findOne({ appId });
  if (dbRecord?.confirmed) {
    return { action: 'skip' };
  }
  return { action: 'continue' };
};