const Comment = require('../models/comment.model');
const Address = require('../models/address.model');
const User = require('../models/user.model');
const { validationResult } = require('express-validator');

// Get comments for an address
exports.getCommentsByAddress = async (req, res, next) => {
  try {
    const comments = await Comment.find({ address: req.params.addressId })
      .populate('author', 'name profilePicture')
      .sort('-createdAt');
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// Create a comment on an address
exports.createComment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { text, rating } = req.body;
    const images = req.files ? req.files.map(file => file.id) : [];
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const address = await Address.findById(req.params.addressId);
    if (!address || !address.isPublic) {
      return res.status(400).json({ message: 'Cannot comment on this address' });
    }
    const comment = new Comment({
      text,
      rating,
      images,
      author: user._id,
      address: address._id
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

// Delete a comment (only author or admin)
exports.deleteComment = async (req, res, next) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};
