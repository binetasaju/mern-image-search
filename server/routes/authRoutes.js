const passport = require('passport');

module.exports = (app) => {
  // 1. The route to start the Google login flow
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'], // What we want to get from Google
    })
  );

  // 2. The callback route that Google redirects to
  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      // Successful login, redirect to the CLIENT
      res.redirect('http://localhost:3000'); // <-- CHANGED
    }
  );

  // 3. A route to check who is logged in
  app.get('/api/current_user', (req, res) => {
    res.send(req.user); // req.user is added by Passport
  });

  // 4. A route to log out
  app.get('/api/logout', (req, res, next) => {
    // This function now requires a callback
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      // Redirect to the CLIENT
      res.redirect('http://localhost:3000'); // <-- CHANGED
    });
  });
};