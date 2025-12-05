import { Router } from 'express';
import { getMySqlPool } from '../../../../db/mysql/connections.js';

const getUserWithEmail = Router();

export async function getUserByEmail(email: string) {
  const pool = await getMySqlPool();
  const [rows] = await pool.execute(
    'SELECT id, email, password_hash FROM users WHERE email = ?',
    [email],
  );
  return Array.isArray(rows) ? rows[0] : rows ?? null;
}

getUserWithEmail.post('/dbUser/get/email', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ success: false, message: 'User email is required' });
    return;
  }
  try {
    const user = (await getUserByEmail(email)) as Record<string, any>;
    if (!user?.id) {
      res
        .status(404)
        .json({ success: true, message: 'User not found', ok: true });
      return;
    }
    res.json({
      success: true,
      message: `Sending user with id: ${user.id}`,
      data: user.id,
    });
    return;
  } catch (err) {
    console.error('❌ Failed to get user', err);
    res.status(500).json({ success: false, message: 'Database error' });
    return;
  }
});

export default getUserWithEmail;
