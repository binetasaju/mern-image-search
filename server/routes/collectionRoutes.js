const mongoose = require('mongoose');
const requireAuth = require('../middleware/requireAuth');
const Collection = mongoose.model('collections');

module.exports = (app) => {
  // 1. Get all collections for the logged-in user
  app.get('/api/collections', requireAuth, async (req, res) => {
    try {
      const collections = await Collection.find({ _user: req.user.id }).sort({
        createdAt: -1,
      });
      res.send(collections);
    } catch (err) {
      res.status(500).send({ error: 'Error fetching collections' });
    }
  });

  // 2. Save a new collection
  app.post('/api/collections', requireAuth, async (req, res) => {
    const { name, images } = req.body;

    if (!name || !images || images.length === 0) {
      return res.status(422).send({ error: 'Missing name or images' });
    }

    // We re-format the image data to only store what we need
    const formattedImages = images.map((img) => ({
      id: img.id,
      url_small: img.urls.small,
      alt_description: img.alt_description,
    }));

    try {
      const collection = new Collection({
        name,
        images: formattedImages,
        _user: req.user.id,
      });
      await collection.save();
      res.send(collection);
    } catch (err) {
      res.status(500).send({ error: 'Error saving collection' });
    }
  });

  // 3. Delete a collection
  app.delete('/api/collections/:id', requireAuth, async (req, res) => {
    try {
      const collectionId = req.params.id;
      const collection = await Collection.findOne({
        _id: collectionId,
        _user: req.user.id,
      });

      if (!collection) {
        return res.status(404).send({ error: 'Collection not found' });
      }

      await Collection.deleteOne({ _id: collectionId, _user: req.user.id });
      res.send({ success: true });
    } catch (err) {
      res.status(500).send({ error: 'Error deleting collection' });
    }
  });
};