
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // To get logged-in user info

// --- Local Signup ---
// @route   POST api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', async (req, res, next) => {
  const { displayName, email, phoneNumber, password } = req.body;

  try {
    // Basic validation
    if (!((email || phoneNumber) && password)) {
        return res.status(400).json({ msg: 'Please provide email or phone number, and a password' });
    }
     if (password.length < 6) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters' });
     }

    // Check if user exists (by email or phone)
    let user;
    if (email) {
        user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists with this email' });
    }
    if (phoneNumber) {
        user = await User.findOne({ phoneNumber });
        if (user) return res.status(400).json({ msg: 'User already exists with this phone number' });
    }

    // Create new user instance (password will be hashed by pre-save hook)
    user = new User({
      displayName,
      email,
      phoneNumber,
      password, // Pass plain password here
    });

    await user.save();

    // Create JWT Payload
    const payload = {
      user: {
        id: user.id,
         // Optional: Add role or other relevant info if needed
      },
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }, // Token expiration (e.g., 1 hour)
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Return token to client
      }
    );
  } catch (err) {
    console.error('Signup error:', err.message);
    next(err); // Pass error to the error handler
  }
});


// --- Local Login ---
// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res, next) => {
  const { email, phoneNumber, password } = req.body;

  try {
    // Basic validation
    if (!(email || phoneNumber) || !password) {
        return res.status(400).json({ msg: 'Please provide email or phone number, and password' });
    }

    // Find user by email or phone
    let user;
    if (email) {
        user = await User.findOne({ email });
    } else if (phoneNumber) {
        user = await User.findOne({ phoneNumber });
    }

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

     // Check if user signed up with OAuth only
    if (!user.password) {
        return res.status(400).json({ msg: 'Please log in using the method you originally signed up with (e.g., Google).' });
    }


    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // User matched, create JWT payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    next(err);
  }
});


// --- Google OAuth ---
// @route   GET api/auth/google
// @desc    Authenticate with Google
// @access  Public
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'], // Request profile and email scope
    session: false // We are using JWT, not sessions
}));

// @route   GET api/auth/google/callback
// @desc    Google auth callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:9002'}/login?error=google_auth_failed`, // Redirect on failure
    session: false // No sessions
   }),
  (req, res) => {
    // Successful authentication from Google
    const user = req.user; // User object attached by Passport

    if (!user) {
         // Should not happen if passport.authenticate succeeded, but as a safeguard
         return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:9002'}/login?error=authentication_failed`);
    }


    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
      (err, token) => {
        if (err) {
            console.error('Error signing token after Google auth:', err);
             return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:9002'}/login?error=token_signing_failed`);
        }
        // Redirect to frontend with the token (e.g., in URL fragment or query param)
        // The frontend will need to parse this token and store it.
        // Using fragment (#) is generally safer as it's not sent to the server.
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:9002'}/auth/callback#token=${token}`);
      }
    );
  }
);

// --- Get Logged In User ---
// @route   GET api/auth/me
// @desc    Get logged in user's basic info
// @access  Private
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    // req.user is attached by authMiddleware
    // We select fields again to be explicit about what's returned
    const user = await User.findById(req.user.id).select('-password -googleId'); // Exclude sensitive fields
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user /me:', err.message);
    next(err);
  }
});


module.exports = router;
