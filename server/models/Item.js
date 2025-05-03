
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: [true, 'Please specify if the item is lost or found'],
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  imageUrl: {
    type: String, // URL from Cloudinary
    required: false,
  },
  imagePublicId: { // Store Cloudinary public_id for potential deletion
    type: String,
    required: false,
  },
  location: {
    // Simple text location for now
    type: String,
    required: [true, 'Please add a location'],
  },
  // Optional GeoJSON Point for map features later
  // geoPoint: {
  //   type: {
  //     type: String,
  //     enum: ['Point'],
  //   },
  //   coordinates: {
  //     type: [Number], // [longitude, latitude]
  //     index: '2dsphere' // Create geospatial index
  //   }
  // },
  dateLostOrFound: {
    type: Date,
    required: [true, 'Please add the date the item was lost or found'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Potential future fields
  // status: { type: String, enum: ['active', 'resolved', 'archived'], default: 'active' },
  // resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // resolvedAt: { type: Date },
});

// Add text index for searching title and description
ItemSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Item', ItemSchema);
