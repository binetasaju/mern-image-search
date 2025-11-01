const passport = require('passport');

// --- Define the Frontend URL ---
const FRONTEND_URL = 'https://mern-image-search.vercel.app';

module.exports = (app) => {
  // Google Login Route
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );

  // Google Callback Route (Must redirect to Vercel)
  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      // Successful login, redirect to the Vercel frontend
      res.redirect(FRONTEND_URL); // <-- CRITICAL FIX
    }
  );

  // GitHub Login Route
  app.get('/auth/github', passport.authenticate('github', { scope: ['read:user'] }));

  // GitHub Callback Route (Must redirect to Vercel)
  app.get(
    '/auth/github/callback',
    passport.authenticate('github'),
    (req, res) => {
      // Successful login, redirect to the Vercel frontend
      res.redirect(FRONTEND_URL); // <-- CRITICAL FIX
    }
  );

  // Check User Route
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });

  // Logout Route
  app.get('/api/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      // Redirect to the Vercel frontend login page
      res.redirect(`${FRONTEND_URL}/login`); // <-- CRITICAL FIX
    });
  });
};