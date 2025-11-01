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
app.set('trust proxy', 1);

// --- CORS MIDDLEWARE (MUST BE AT THE TOP) ---
const corsOptions = {
    origin: allowedOrigin,
    credentials: true,
    // Add all methods used by the app, especially OPTIONS
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", 
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Use CORS globally
app.use(cors(corsOptions));

// --- Handle OPTIONS pre-flight requests explicitly ---
// Browsers require this for complex requests (POST, DELETE)
app.options('*', cors(corsOptions)); // Respond to ALL pre-flights

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