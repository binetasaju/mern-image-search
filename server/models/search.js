const mongoose = require('mongoose');
const { Schema } = mongoose;

const searchSchema = new Schema({
  term: String,
  timestamp: Date,
  // This creates a relationship between this search and the user who made it
  _user: { type: Schema.Types.ObjectId, ref: 'users' },
});

// This creates the 'searches' collection in MongoDB
mongoose.model('searches', searchSchema);