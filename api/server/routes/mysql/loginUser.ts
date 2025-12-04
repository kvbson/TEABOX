import { Router } from 'express';
import bcrypt from 'bcrypt';
import { getUserByEmail } from './getUser.js';

const loginUser = Router();

loginUser.post('/dbUser/login', async (req, res) => {
  const sess = (req as any).session;
  if (sess) {
    res.status(500).json({ error: 'Session not found' });
    return;
  }
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Missing password or email' });
    return;
  }

  const user = await getUserByEmail(email) as Record<string, any> | null;
  if (!user) {
    res.status(401).json({ error: 'User not found in DB' });
    return;
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    res.status(401).json({ error: 'Invalid password' });
    return;
  }

  sess.userId = user.id;
  sess.email = user.email;

  res.json({ ok: true, userId: user.id, login: user.login });
});

export default loginUser;
