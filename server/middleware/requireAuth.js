// This middleware checks if a user is logged in
module.exports = (req, res, next) => {
  if (!req.user) {
    // If no user is logged in, send a 401 Unauthorized error
    return res.status(401).send({ error: 'You must be logged in!' });
  }

  // If they are logged in, continue to the next function (the route handler)
  next();
};