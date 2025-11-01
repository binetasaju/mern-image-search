const mongoose = require('mongoose');
const { Schema } = mongoose;

// We'll store a few key details about each image
const ImageSchema = new Schema({
  id: String, // The Unsplash ID
  url_small: String,
  alt_description: String,
});

const collectionSchema = new Schema({
  name: String,
  _user: { type: Schema.Types.ObjectId, ref: 'users' },
  images: [ImageSchema], // An array of images
  createdAt: { type: Date, default: Date.now },
});

mongoose.model('collections', collectionSchema);