const express = require('express');
const connectDB = require('./db');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors'); 
require('dotenv').config();

// --- Define the allowed frontend URL (Your Vercel URL) ---
const allowedOrigin = 'https://mern-image-search.vercel.app'; 

// --- DB AND MODELS ---
connectDB();
require('./models/User');
require('./models/Search');
require('./models/Collection');

// --- PASSPORT & SESSION ---
require('./services/passport');

const app = express();

// --- TRUST PROXY & COOKIE CONFIG (CRUCIAL FOR DEPLOYMENT) ---
// 1. Trust proxy required for Render/Vercel to set secure cookies
app.set('trust proxy', 1);

// 2. CORS MIDDLEWARE (Simplest & Most Reliable)
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// --- MIDDLEWARE ---
app.use(express.json());

// 3. EXPRESS SESSION (with correct secure settings)
app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,      // Must be true for HTTPS
      sameSite: 'none',  // Must be 'none' for cross-site cookie sharing
    }
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