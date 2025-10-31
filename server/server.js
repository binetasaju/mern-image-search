const express = require('express');
const connectDB = require('./db');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

// --- DB AND MODELS ---
// Connect to Database
connectDB();
// We must load the models BEFORE passport uses them
require('./models/User');
require('./models/Search'); // <-- NEW: Load the Search model

// --- PASSPORT & SESSION ---
// Load passport config (this runs the code in passport.js)
require('./services/passport');

const app = express();

// --- MIDDLEWARE ---
// This middleware parses incoming JSON requests (like POST /api/search)
app.use(express.json()); // <-- NEW

// Tell Express to use sessions
app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

// Tell Express to use Passport for sessions
app.use(passport.initialize());
app.use(passport.session());

// --- ROUTES ---
// We call our route functions and pass in the 'app' object
require('./routes/authRoutes')(app);
require('./routes/searchRoutes')(app); // <-- NEW: Use the search routes

// A simple test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));