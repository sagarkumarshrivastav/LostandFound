
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find user by ID from token payload, exclude password
    const user = await User.findById(decoded.user.id).select('-password');

     if (!user) {
        return res.status(401).json({ msg: 'Token is not valid (user not found)' });
     }

    req.user = user; // Attach the full user object (without password)
    next();
  } catch (err) {
     console.error('Token verification failed:', err.message);
     if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ msg: 'Token is not valid' });
     }
     if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ msg: 'Token has expired' });
     }
    res.status(500).json({ msg: 'Server Error during token verification' });
  }
};
