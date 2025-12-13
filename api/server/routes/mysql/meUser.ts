import { Router } from 'express';

const meUser = Router();

meUser.get('/dbUser/me', (req, res) => {
  const session = req.session as any;
  if (!session) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.json({ userId: session?.userId, steamId: session?.steamId, login: session?.login });
});

export default meUser;