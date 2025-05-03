
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { upload, cloudinary } = require('../config/cloudinary');
const User = require('../models/User');

// @route   PUT api/users/profile
// @desc    Update user profile (displayName, address, photoURL)
// @access  Private
router.put('/profile', authMiddleware, upload.single('photo'), async (req, res, next) => {
    const { displayName, street, city, state, zip, country } = req.body;
    const userId = req.user.id; // Get user ID from authenticated middleware

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const updates = {};
        if (displayName) updates.displayName = displayName;

        // Build address object
        const address = {};
        if (street) address.street = street;
        if (city) address.city = city;
        if (state) address.state = state;
        if (zip) address.zip = zip;
        if (country) address.country = country;

        if (Object.keys(address).length > 0) {
             // Merge with existing address or create new one
            updates.address = { ...user.address, ...address };
        }

        // Handle profile picture upload
        if (req.file) {
            console.log('Uploaded file:', req.file);
            // If user already has a photo, delete the old one from Cloudinary first
            if (user.photoURL && user.photoURL.includes('cloudinary')) {
                // Extract public_id from the URL (this depends on your URL structure)
                // Example assumes URL is like: .../upload/v123/folder/public_id.jpg
                const urlParts = user.photoURL.split('/');
                const publicIdWithExt = urlParts[urlParts.length - 1];
                const publicId = publicIdWithExt.split('.')[0];
                 const folder = urlParts[urlParts.length-2] === 'lost-and-found' ? 'lost-and-found/' : ''; // Check if in specific folder

                if (publicId) {
                    try {
                         console.log(`Deleting old profile photo: ${folder}${publicId}`);
                        await cloudinary.uploader.destroy(folder + publicId);
                    } catch (cloudinaryErr) {
                        console.error('Failed to delete old profile photo from Cloudinary:', cloudinaryErr);
                        // Continue with update, but log the error
                    }
                }
            }
             updates.photoURL = req.file.path; // Cloudinary returns the URL in req.file.path
        }

        // Update user in database
        user = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true } // Return updated doc, run schema validations
        ).select('-password -googleId'); // Exclude sensitive fields

        res.json(user);

    } catch (err) {
        console.error('Profile update error:', err.message);
        // If it's a file upload error from Cloudinary/Multer during update
        if (req.file && err) {
             try {
                console.log(`Upload failed, deleting uploaded file: ${req.file.filename}`); // filename is public_id
                await cloudinary.uploader.destroy(req.file.filename);
             } catch (delErr) {
                 console.error('Failed to delete uploaded file after update error:', delErr);
             }
        }
        next(err);
    }
});

// Add other user-related routes here (e.g., get user by ID, get all users - admin only?)

module.exports = router;
