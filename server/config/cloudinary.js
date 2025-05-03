
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const configureCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log('Cloudinary configured.');
};

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'lost-and-found', // Optional: specify a folder in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
        // transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional: transformations
        public_id: (req, file) => {
          // Create a unique public_id for the file
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const originalNameWithoutExt = file.originalname.split('.').slice(0, -1).join('.');
          // Keep original name sanitized + add unique suffix
          return `${originalNameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_')}-${uniqueSuffix}`;
        }
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter: (req, file, cb) => {
        // Basic check for image MIME types
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

module.exports = { configureCloudinary, upload, cloudinary };
