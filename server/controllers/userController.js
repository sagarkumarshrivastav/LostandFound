
const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary'); // Import cloudinary instance for deletion

// --- Update User Profile Logic ---
exports.updateProfile = async (req, res, next) => {
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

        // Only update address if at least one field is provided
        if (Object.keys(address).length > 0) {
            updates.address = { ...(user.address || {}), ...address }; // Merge with existing or create new
        }

        // Handle profile picture upload
        if (req.file) {
            console.log('Uploaded profile file:', req.file);
            // If user already has a photo from Cloudinary, delete the old one
            if (user.photoURL && user.photoURL.includes('cloudinary.com')) {
                // Extract public_id from the URL
                try {
                     // More robust public_id extraction: find the last part before the extension
                     const urlParts = user.photoURL.split('/');
                     const publicIdWithFolder = urlParts.slice(urlParts.indexOf('upload') + 2).join('/').replace(/\.[^/.]+$/, ""); // Assumes standard Cloudinary URL structure

                    if (publicIdWithFolder) {
                        console.log(`Deleting old profile photo: ${publicIdWithFolder}`);
                        await cloudinary.uploader.destroy(publicIdWithFolder);
                    }
                } catch (cloudinaryErr) {
                    console.error('Failed to delete old profile photo from Cloudinary:', cloudinaryErr);
                    // Continue with update, but log the error
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
};

// Add other user-related controller functions here if needed
// e.g., getUserById, getAllUsers (admin only) etc.
