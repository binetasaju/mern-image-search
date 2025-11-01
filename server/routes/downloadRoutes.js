const axios = require('axios');
require('dotenv').config();
const requireAuth = require('../middleware/requireAuth');
const { URL } = require('url'); // Import the URL class

module.exports = (app) => {
  app.get('/api/download', requireAuth, async (req, res) => {
    const { url } = req.query;

    if (!url) {
      return res.status(400).send({ error: 'Missing download URL' });
    }

    try {
      // 1. Call the Unsplash tracking URL (as before)
      const trackResponse = await axios.get(url, {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      });

      // 2. Unsplash responds with the real image URL
      const realImageUrl = trackResponse.data.url;

      // 3. (NEW) Get the file name from the URL
      const parsedUrl = new URL(realImageUrl);
      // Create a filename like "photo-12345.jpg"
      const filename = `${parsedUrl.pathname.split('/')[1] || 'unsplash-image'}.jpg`;

      // 4. (NEW) Fetch the actual image as a stream
      const imageStream = await axios({
        method: 'get',
        url: realImageUrl,
        responseType: 'stream',
      });

      // 5. (NEW) Send the image to the user as a file
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      // "Pipe" the image from Unsplash to the user
      imageStream.data.pipe(res);

    } catch (err) {
      console.error('UNSPLASH DOWNLOAD ERROR:', err.message);
      res.status(500).send({ error: 'Error downloading image' });
    }
  });
};