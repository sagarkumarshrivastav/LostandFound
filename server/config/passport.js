const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  // Ensure environment variables are loaded before this runs
  // console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID); // Temporary log for debugging
  // console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET); // Temporary log

    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        passport.use(new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID, // Use the correct env var name
                clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Use the correct env var name
                callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback' // Adjust if server runs behind proxy
            },
            async (accessToken, refreshToken, profile, done) => {
                // console.log('Google Profile:', profile); // Log profile data for debugging
                const newUser = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
                    photoURL: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null
                };

                try {
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        // Update user info if changed (e.g., profile picture)
                        user.displayName = newUser.displayName;
                        user.email = newUser.email; // Update email if changed
                        user.photoURL = newUser.photoURL;
                        await user.save();
                        done(null, user);
                    } else {
                        // Check if user exists with the same email from Google
                        if (newUser.email) {
                            user = await User.findOne({ email: newUser.email });
                            if (user) {
                                // User exists with email but not googleId, link account
                                user.googleId = newUser.googleId;
                                user.displayName = user.displayName || newUser.displayName; // Keep existing name if available
                                user.photoURL = user.photoURL || newUser.photoURL;
                                await user.save();
                                return done(null, user);
                            }
                        }
                        // If no existing user, create a new one
                        user = await User.create(newUser);
                        done(null, user);
                    }
                } catch (err) {
                    console.error('Error during Google OAuth:', err);
                    done(err, null);
                }
            }
        ));
    }


  // Note: We are not using passport sessions, JWT will handle user state.
  // So, serializeUser and deserializeUser are not strictly required here.
  // passport.serializeUser((user, done) => {
  //   done(null, user.id);
  // });
  //
  // passport.deserializeUser(async (id, done) => {
  //   try {
  //     const user = await User.findById(id);
  //     done(null, user);
  //   } catch (err) {
  //     done(err, null);
  //   }
  // });
};
