const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const requireAuth = require('../middleware/requireAuth');
const Search = mongoose.model('searches');

module.exports = (app) => {
  // --- 1. Get Top 5 Searches (Public) ---
  // This uses a complex MongoDB query called "aggregation"
  app.get('/api/top-searches', async (req, res) => {
    try {
      const topSearches = await Search.aggregate([
        { $group: { _id: '$term', count: { $sum: 1 } } }, // Group by term and count occurrences
        { $sort: { count: -1 } }, // Sort by count (most popular first)
        { $limit: 5 }, // Take only the top 5
        { $project: { _id: 0, term: '$_id' } }, // Reformat the output
      ]);
      res.send(topSearches.map((item) => item.term));
    } catch (err) {
      console.error('Error fetching top searches:', err);
      res.status(500).send({ error: 'Error fetching top searches' });
    }
  });

  // --- 2. Get User's Personal History (Protected) ---
  app.get('/api/history', requireAuth, async (req, res) => {
    try {
      const history = await Search.find({ _user: req.user.id })
        .sort({ timestamp: -1 }) // Newest first
        .limit(20); // Get the 20 most recent
      res.send(history);
    } catch (err) {
      console.error('Error fetching history:', err);
      res.status(500).send({ error: 'Error fetching history' });
    }
  });

  // --- 3. Clear User's Personal History (Protected) ---
  app.delete('/api/history', requireAuth, async (req, res) => {
    try {
      // Find all searches for this user and delete them
      await Search.deleteMany({ _user: req.user.id });

      // Send back an empty array to confirm
      res.send([]);
    } catch (err) {
      console.error('Error clearing history:', err);
      res.status(500).send({ error: 'Error clearing history' });
    }
  });
// --- 3b. Delete ONE History Item (Protected) ---
app.delete('/api/history/:id', requireAuth, async (req, res) => {
  try {
    const searchId = req.params.id;

    // Find the item and make sure it belongs to the logged-in user
    const item = await Search.findOne({ _id: searchId, _user: req.user.id });

    if (!item) {
      return res.status(404).send({ error: 'History item not found' });
    }

    // Delete it
    await Search.deleteOne({ _id: searchId, _user: req.user.id });

    res.send({ success: true });
  } catch (err) {
    res.status(500).send({ error: 'Error deleting history item' });
  }
});

  // --- 4. Perform a Search (Protected) ---
  app.post('/api/search', requireAuth, async (req, res) => {
    // This line was missing! We need to tell the server
    // to expect a JSON body.
    // Wait... this should be in server.js. Let's assume it is.
    const { term } = req.body;

    if (!term) {
      return res.status(422).send({ error: 'A search term is required' });
    }

    // 1. Save the search to our database
    try {
      const search = new Search({
        term,
        _user: req.user.id,
        timestamp: new Date(),
      });
      await search.save();
    } catch (dbErr) {
      console.error('DB SAVE ERROR:', dbErr.message);
      // We'll just log the error but still let the user search
    }

    // 2. Call the Unsplash API
    try {
      const unsplashResponse = await axios.get(
        'https://api.unsplash.com/search/photos',
        {
          params: {
            query: term,
          },
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      // 3. Send the image results back to our client
      res.send(unsplashResponse.data.results);
    } catch (unsplashErr) {
      console.error('UNSPLASH ERROR:', unsplashErr.message);
      res.status(500).send({ error: 'Error fetching images from Unsplash' });
    }
  });
};