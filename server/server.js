const express = require('express');
const connectDB = require('./db');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

// --- DB AND MODELS ---
connectDB();
require('./models/User');
require('./models/Search');
require('./models/Collection');

// --- PASSPORT & SESSION ---
require('./services/passport');

const app = express();

// --- MIDDLEWARE ---
app.use(express.json());

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
require('./routes/authRoutes')(app);
require('./routes/searchRoutes')(app);
require('./routes/collectionRoutes')(app); 
require('./routes/downloadRoutes')(app); 

// A simple test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));