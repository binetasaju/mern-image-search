const passport = require('passport');

module.exports = (app) => {
  // Google Login Route
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );

  // Google Callback Route
  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('http://localhost:3000'); // Reverted
    }
  );

  // GitHub Login Route
  app.get('/auth/github', passport.authenticate('github', { scope: ['read:user'] }));

  // GitHub Callback Route
  app.get(
    '/auth/github/callback',
    passport.authenticate('github'),
    (req, res) => {
      res.redirect('http://localhost:3000'); // Reverted
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
      res.redirect('http://localhost:3000/login'); // Reverted
    });
  });
};