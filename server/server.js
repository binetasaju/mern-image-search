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

// --- TRUST PROXY ---
// Must be added for Render/Vercel to correctly handle cookies
app.set('trust proxy', 1); // <-- ADD THIS

// --- CORS MIDDLEWARE (MUST BE AT THE TOP) ---
app.use(cors({
  origin: allowedOrigin,
  credentials: true // Crucial for passing cookies/sessions
}));

// --- MIDDLEWARE ---
app.use(express.json());

// Tell Express to use sessions
app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    // --- COOKIE SECURITY SETTINGS (CRUCIAL FOR DEPLOYMENT) ---
    cookie: {
      secure: true,      // Must be true because the connection is HTTPS (Render/Vercel)
      sameSite: 'none',  // Must be 'none' to allow cross-site requests (Vercel -> Render)
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