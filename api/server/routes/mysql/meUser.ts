import express from 'express';

const meUser = express.Router();

meUser.get('/dbUser/session', (req, res) => {
  const session = req.session as any;
  if (!session) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.json({ userId: session?.userId, login: session?.login });
});

export default meUser;