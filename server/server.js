const express = require('express');
const connectDB = require('./db');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors'); 
require('dotenv').config();
const path = require('path'); // <-- ADD THIS

// --- Define the allowed frontend URL ---
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
app.set('trust proxy', 1);

// --- CORS MIDDLEWARE ---
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests from Vercel/Render/Localhost and requests with no origin (direct API ping)
        if (!origin || ['https://mern-image-search.vercel.app', 'https://mern-image-search-server.onrender.com', 'http://localhost:3000'].some(ao => origin.startsWith(ao))) {
            return callback(null, true);
        }
        // Also allow Vercel's temporary subdomains
        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle explicit pre-flights

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

// --- FINAL FIX: STATIC ASSET ROUTING ---
// If the app is in production (which it is on Render/Vercel)
if (process.env.NODE_ENV === 'production') {
    // 1. Express serves up production assets (main.css, main.js) from the client/build folder
    app.use(express.static('client/build')); // <-- This serves the logo!

    // 2. Express serves the index.html file for all unknown requests (client-side routing)
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}
// --- END FINAL FIX ---

// A simple test route (used by Render to check if API is running)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));