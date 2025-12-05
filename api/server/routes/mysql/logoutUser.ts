import { Router } from 'express';
import { cookieParams, sessionName } from '../../session/setupSession.js';

const logoutUser = Router();

logoutUser.get('/dbUser/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Failed to destroy session:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    // clear cookie
    res.clearCookie(sessionName, cookieParams);
    res.json({ ok: true, message: 'Logged out' });
  });
});

export default logoutUser;
