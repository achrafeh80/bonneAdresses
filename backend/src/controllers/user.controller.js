const User = require('../models/user.model');
const { validationResult } = require('express-validator');

// Get current user's profile or create if not exists
exports.getProfile = async (req, res, next) => {
  const uid = req.user.uid;
  try {
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      // create new user with basic info
      user = await User.create({ firebaseUid: uid, email: req.user.email });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Update current user's profile
exports.updateProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name } = req.body;
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { name },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Upload or update profile photo
exports.uploadProfilePhoto = async (req, res, next) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  try {
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { profilePicture: req.file.id },
      { new: true }
    );
    res.json({ profilePicture: req.file.id });
  } catch (error) {
    next(error);
  }
};
