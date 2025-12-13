import { Router } from 'express';
import bcrypt from 'bcrypt';
import { insertUser } from '../../../db/mysql/inserts/insertUser.js';
import { getOutId } from '../../../db/mysql/utils/getOutId.js';

const addUser = Router();

addUser.post('/dbUser/add', async (req, res) => {
  const { email, password, steamId } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email and password are required' });
    return;
  }

  if (!steamId) {
    res.status(400).json({ success: false, message: 'Steam ID is required' });
    return;
  }
  let newUserId = null;

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const response = await insertUser({ email, password_hash: passwordHash, steamId });
    newUserId = getOutId(response);
  } catch (err: any) {
    console.error('❌ MySQL error during user insert:', err?.message);
    res.status(500).json({ success: false, message: 'Database error' });
    return;
  }

  res.json({
    success: true,
    message: '✅ User added successfully',
    params: {
      newUserId,
    },
  });
});

export default addUser;