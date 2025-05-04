const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');

// --- Local Signup Logic ---
exports.signup = async (req, res, next) => {
  const { displayName, email, phoneNumber, password } = req.body;

  try {
    // Basic validation
    if (!((email || phoneNumber) && password)) {
      return res.status(400).json({ success: false, msg: 'Please provide email or phone number, and a password' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, msg: 'Password must be at least 6 characters' });
    }

    // Check if user exists (by email or phone)
    let user;
    if (email) {
      user = await User.findOne({ email });
      if (user) return res.status(400).json({ success: false, msg: 'User already exists with this email' });
    }
    if (phoneNumber) {
      // If email wasn't provided or didn't find a user, check by phone
      if (!user) {
        user = await User.findOne({ phoneNumber });
        if (user) return res.status(400).json({ success: false, msg: 'User already exists with this phone number' });
      } else if (await User.findOne({ phoneNumber })) {
         // If email user was found, still check if phone number is taken by someone else
         return res.status(400).json({ success: false, msg: 'Phone number is already associated with another account' });
      }
    }


    // Create new user instance (password will be hashed by pre-save hook)
    user = new User({
      displayName: displayName || (email ? email.split('@')[0] : 'User'), // Default display name
      email,
      phoneNumber,
      password, // Pass plain password here
    });

    await user.save();
    console.log("User saved successfully:", user._id); // Log success

    // Create JWT Payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in the environment variables.');
      return res.status(500).json({ success: false, msg: 'JWT_SECRET is not defined.' });
    }

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
      (err, token) => {
        if (err) {
            console.error('JWT Signing Error during signup:', err); // Log JWT error
            // Pass a specific error to the handler
             return next(new Error('Token signing failed during signup'));
        }
        console.log("Token signed successfully for user:", user.id); // Log token success
        res.status(201).json({ token }); // Use 201 Created status and return token
      }
    );
  } catch (err) {
    // Log the detailed error on the server console before passing to handler
    console.error('--- Signup Controller Error ---');
    console.error('Error Message:', err.message);
    // Log specific mongoose validation errors if present
    if (err.name === 'ValidationError') {
      console.error('Validation Errors:', err.errors);
    }
    console.error('Error Stack:', err.stack);
    console.error('--- End Signup Controller Error ---');
    // Pass the error to the central error handler middleware
    next(err);
  }
};

// --- Local Login Logic ---
exports.login = async (req, res, next) => {
  const { email, phoneNumber, password } = req.body;

  try {
    // Basic validation
    if (!(email || phoneNumber) || !password) {
      return res.status(400).json({ success: false, msg: 'Please provide email or phone number, and password' });
    }

    // Find user by email or phone
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (phoneNumber) {
      user = await User.findOne({ phoneNumber });
    }

    if (!user) {
      console.log(`Login attempt failed: No user found for identifier: ${email || phoneNumber}`);
      return res.status(400).json({ success: false, msg: 'Invalid Credentials' });
    }

    // Check if user signed up with OAuth only (no local password)
    if (!user.password) {
        console.log(`Login attempt failed: User ${user._id} has no password (OAuth user?).`);
        return res.status(400).json({ success: false, msg: 'Please log in using the method you originally signed up with (e.g., Google).' });
    }


    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
       console.log(`Login attempt failed: Password mismatch for user ${user._id}`);
      return res.status(400).json({ success: false, msg: 'Invalid Credentials' });
    }

    // User matched, create JWT payload
    const payload = {
      user: {
        id: user.id,
      },
    };

     const jwtSecret = process.env.JWT_SECRET;
     if (!jwtSecret) {
       console.error('JWT_SECRET is not defined in the environment variables.');
       return res.status(500).json({ success: false, msg: 'JWT_SECRET is not defined.' });
     }
    // Sign token
    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
      (err, token) => {
        if (err) {
           console.error('Login JWT Signing Error:', err);
           // Pass a specific error to the handler
           return next(new Error('Token signing failed during login'));
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('--- Login Controller Error ---');
    console.error('Error Message:', err.message);
    console.error('Error Stack:', err.stack);
    console.error('--- End Login Controller Error ---');
    next(err);
  }
};

// --- Google OAuth Initiation Logic ---
exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'], // Request profile and email scope
  session: false // We are using JWT, not sessions
});

// --- Google OAuth Callback Logic ---
exports.googleCallback = (req, res, next) => { // Added next for error handling
    // Successful authentication from Google
    const user = req.user; // User object attached by Passport

    if (!user) {
        // Should not happen if passport.authenticate succeeded, but as a safeguard
        console.error("Google callback error: No user object attached by Passport.");
        // Redirecting directly here might bypass error handling middleware
        // Consider passing an error to next if you want centralized logging
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:9002'}/login?error=authentication_failed`);
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in the environment variables.');
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:9002'}/login?error=token_signing_failed`);
    }

    // Sign token
    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
      (err, token) => {
        if (err) {
          console.error('Error signing token after Google auth:', err);
          // Pass error to central handler instead of direct redirect
          // This ensures logging via errorHandler middleware
          return next(new Error('Token signing failed after Google auth'));
          // return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:9002'}/login?error=token_signing_failed`);
        }
        // Redirect to frontend with the token (e.g., in URL fragment or query param)
        // This part is okay as it's the success path
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:9002'}/auth/callback#token=${token}`);
      }
    );
};


// --- Get Logged In User Logic ---
exports.getMe = async (req, res, next) => {
  try {
    // req.user is attached by authMiddleware
    // We select fields again to be explicit about what's returned
    // Ensure req.user exists before trying to access its id
     if (!req.user || !req.user.id) {
         console.error("Error in /me: req.user or req.user.id is undefined. Token might be invalid or middleware failed.");
         return res.status(401).json({ success: false, msg: 'Authorization denied, user context not found.' });
     }

    const user = await User.findById(req.user.id).select('-password -googleId'); // Exclude sensitive fields
    if (!user) {
        // This case might happen if the user was deleted after the token was issued
      return res.status(404).json({ success: false, msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user /me:', err.message);
    next(err);
  }
};
