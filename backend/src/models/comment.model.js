const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  images: [{ type: String }], // array of GridFS file ids
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
