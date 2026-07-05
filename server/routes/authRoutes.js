const express = require('express');
const router = express.Router();
const passport = require('passport');
const { googleCallback, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Initiate Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/failure', session: false }),
  googleCallback
);

router.get('/failure', (req, res) => {
  res.status(401).json({ message: 'Google authentication failed' });
});

// Get logged in user
router.get('/me', protect, getMe);

module.exports = router;
