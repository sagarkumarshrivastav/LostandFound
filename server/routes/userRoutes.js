
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary'); // Import only upload middleware
const userController = require('../controllers/userController');

// @route   PUT api/users/profile
// @desc    Update user profile (displayName, address, photoURL)
// @access  Private
router.put('/profile', authMiddleware, upload.single('photo'), userController.updateProfile);

// Add other user-related routes here and point them to controller functions
// e.g., router.get('/:id', authMiddleware, userController.getUserById);

module.exports = router;
