const express = require('express');
const connectDB = require('./db');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors'); 
require('dotenv').config();

// --- Define ALL allowed origins (Vercel, Render, Local) ---
const allowedOrigins = [
  'https://mern-image-search.vercel.app', 
  'https://mern-image-search-server.onrender.com',
  'http://localhost:3000',
  // You may also need to allow the Vercel temporary deployment URL format
  'https://*.vercel.app'
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
    if (!origin || allowedOrigins.some(ao => origin.startsWith(ao))) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// --- MIDDLEWARE ---
app.use(express.json());

// 1. Explicitly define the session store options
const sessionOptions = {
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,      
      sameSite: 'none', 
    }
};
// 2. Use the defined options
app.use(session(sessionOptions));


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