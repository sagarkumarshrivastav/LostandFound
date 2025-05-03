
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: false, // Required only if no email/phone login
  },
  email: {
    type: String,
    required: false, // Not strictly required if phone or googleId is used
    unique: true,
    sparse: true, // Allows multiple null values, but only one unique email
    match: [/.+@.+\..+/, 'Please fill a valid email address'],
  },
  phoneNumber: {
    type: String,
    required: false, // Not strictly required if email or googleId is used
    unique: true,
    sparse: true, // Allows multiple null values, but only one unique phone number
    // Add validation for phone number format if needed
  },
  password: {
    type: String,
    required: function() { // Required only if NOT using Google OAuth for signup
        return !this.googleId;
    },
    minlength: 6,
  },
  address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
  },
  photoURL: {
    type: String, // URL to the profile picture (e.g., from Cloudinary or Google)
    default: null,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values, but only one unique googleId
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // Add other fields as needed, e.g., itemsReported, messages, etc.
});

// Password Hashing Middleware (before saving)
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
     return false; // User signed up with OAuth, no password to compare
  }
  return await bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);
