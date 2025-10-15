const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  isPublic: { type: Boolean, default: false },
  photo: { type: String }, // GridFS file id
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Index for geo queries (optional future use)
addressSchema.index({ 'location': '2dsphere' });

module.exports = mongoose.model('Address', addressSchema);
