const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const requireAuth = require('../middleware/requireAuth');
const Search = mongoose.model('searches');

module.exports = (app) => {
  // --- 1. Get Top 5 Searches (Public) ---
  app.get('/api/top-searches', async (req, res) => {
    try {
      const topSearches = await Search.aggregate([
        { $group: { _id: '$term', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, term: '$_id' } },
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
        .sort({ timestamp: -1 })
        .limit(20);
      res.send(history);
    } catch (err) {
      console.error('Error fetching history:', err);
      res.status(500).send({ error: 'Error fetching history' });
    }
  });

  // --- 3. Clear ALL User History (Protected) ---
  app.delete('/api/history', requireAuth, async (req, res) => {
    try {
      await Search.deleteMany({ _user: req.user.id });
      res.send([]);
    } catch (err) {
      console.error('Error clearing history:', err);
      res.status(500).send({ error: 'Error clearing history' });
    }
  });

  // --- 4. Delete ONE History Item (Protected) ---
  app.delete('/api/history/:id', requireAuth, async (req, res) => {
    try {
      const searchId = req.params.id;
      const item = await Search.findOne({ _id: searchId, _user: req.user.id });

      if (!item) {
        return res.status(404).send({ error: 'History item not found' });
      }

      await Search.deleteOne({ _id: searchId, _user: req.user.id });
      res.send({ success: true });
    } catch (err) {
      res.status(500).send({ error: 'Error deleting history item' });
    }
  });

  // --- 5. Perform a Search (Protected) ---
  app.post('/api/search', requireAuth, async (req, res) => {
    const { term, page = 1 } = req.body;

    if (!term) {
      return res.status(422).send({ error: 'A search term is required' });
    }

    // 1. Save the search (only if it's the first page)
    if (page === 1) {
      try {
        const search = new Search({
          term,
          _user: req.user.id,
          timestamp: new Date(),
        });
        await search.save();
      } catch (dbErr) {
        console.error('DB SAVE ERROR:', dbErr.message);
        // Don't block the search if DB save fails, just log it
      }
    }

    // 2. Call the Unsplash API
    try {
      const unsplashResponse = await axios.get(
        'https://api.unsplash.com/search/photos',
        {
          params: {
            query: term,
            page: page,
            per_page: 12,
          },
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      // 3. Send a curated list of properties to the client
      const images = unsplashResponse.data.results.map((img) => ({
        id: img.id,
        color: img.color, // For the dynamic theme
        alt_description: img.alt_description,
        urls: {
          small: img.urls.small,
        },
        links: {
          download_location: img.links.download_location, // For the download
        },
      }));

      res.send(images);
    } catch (unsplashErr) {
      console.error('UNSPLASH ERROR:', unsplashErr.message);
      // This is the only other place a response is sent.
      res.status(500).send({ error: 'Error fetching images from Unsplash' });
    }
  });
};