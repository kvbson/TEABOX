import { Router } from 'express';

const prosNCons = Router();

export async function getProsNCons(appId: string) { //TODO: yk
  if (!appId || typeof appId !== 'string') {
    throw new Error('Invalid or missing appId');
  }
  const response = await fetch('https://teabox-01-899557006260.europe-west1.run.app/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ AppID: appId }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to fetch pros and cons: ${data.error || 'Unknown error'}`);
  }
  if (!data.response || typeof data.response !== 'string') {
    throw new Error('Invalid response format from the pros and cons service');
  }
  const parameters = JSON.parse(data.response);
  return { pros: parameters.Pros, cons: parameters.Cons };
}

prosNCons.get('/prosNCons', async (req, res) => {
  const { appId } = req.query;
  if (!appId || typeof appId !== 'string') {
    res.status(400).json({ message: 'Invalid or missing appId query parameter' });
  }
  try {
    const data = await getProsNCons(appId as string);
    console.log('[ProsNCons] Pros and cons fetched:', data);
    if (data) {
      res.json({
        success: true,
        data,
      });
    } else {
      res.status(200).json({ pros: [], cons: [] });

    }
  } catch {
    res.status(200).json({ pros: [], cons: [] });
  }
});

export default prosNCons;