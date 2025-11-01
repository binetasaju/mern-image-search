const express = require('express');
const connectDB = require('./db');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();

// --- Define ALL allowed origins ---
// Vercel Production URL (Primary domain)
const VERCEL_URL = 'https://mern-image-search.vercel.app'; 
// Render Backend URL (The server must allow its own URL for direct testing)
const RENDER_URL = 'https://mern-image-search-server.onrender.com';

const allowedOrigins = [
  VERCEL_URL,
  RENDER_URL,
  'http://localhost:3000', // For local testing
  'https://vercel.app' // Vercel often uses temporary subdomains
];

// --- DB AND MODELS ---
connectDB();
require('./models/User');
require('./models/Search');
require('./models/Collection');

// --- PASSPORT & SESSION ---
require('./services/passport');

const app = express();

// --- TRUST PROXY ---
app.set('trust proxy', 1);

// --- CORS MIDDLEWARE (Using array of origins) ---
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or direct backend pings)
    if (!origin) return callback(null, true); 
    
    // Check if origin is in our allowed list
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// --- MIDDLEWARE ---
app.use(express.json());

// Tell Express to use sessions
app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,      
      sameSite: 'none', 
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