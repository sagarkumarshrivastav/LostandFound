
const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// --- Local Signup ---
// @route   POST api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', authController.signup);

// --- Local Login ---
// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// --- Google OAuth ---
// @route   GET api/auth/google
// @desc    Authenticate with Google
// @access  Public
router.get('/google', authController.googleAuth);

// @route   GET api/auth/google/callback
// @desc    Google auth callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { // Still need passport middleware here for the callback
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:9002'}/login?error=google_auth_failed`,
    session: false
  }),
  authController.googleCallback // Controller handles the rest
);

// --- Get Logged In User ---
// @route   GET api/auth/me
// @desc    Get logged in user's basic info
// @access  Private (Requires authMiddleware)
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
