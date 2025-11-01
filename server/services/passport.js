const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy; // <-- ADD THIS
const mongoose = require('mongoose');
require('dotenv').config();

// Get our User model
const User = mongoose.model('users');

// This puts the user's ID into the cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// This gets the user back out of the cookie
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

// This is the main Google login logic
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback', // The route Google sends the user back to
      proxy: true, // Trusts the proxy (needed for render/heroku)
    },
    async (accessToken, refreshToken, profile, done) => {
      // This function is called when Google sends back the user's profile

      // 1. Check if user already exists
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        // 2. If they exist, we're done. Call 'done' with their profile
        return done(null, existingUser);
      }

      // 3. If not, create a new user in our database
      const user = await new User({
        googleId: profile.id,
        displayName: profile.displayName,
      }).save();

      // 4. Call 'done' with the new user
      done(null, user);
    }
  )
);
// ... (your GoogleStrategy is here) ...

// --- ADD THIS NEW BLOCK ---
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      // This logic is the same as the Google one
      const existingUser = await User.findOne({ googleId: profile.id }); // Using googleId to store any provider's ID

      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({
        googleId: profile.id, // We're re-using the googleId field.
        displayName: profile.displayName || profile.username,
      }).save();
      done(null, user);
    }
  )
);