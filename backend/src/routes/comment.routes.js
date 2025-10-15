const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const commentController = require('../controllers/comment.controller');
const { commentRateLimiter } = require('../middleware/rateLimiter.middleware');
const authorize = require('../middleware/authorize.middleware');

// Setup GridFS storage for comment images
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return { filename: 'comment-' + Date.now() + path.extname(file.originalname) };
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  }
});

// Get comments for an address
router.get('/:addressId', commentController.getCommentsByAddress);

// Create a comment on an address
router.post(
  '/:addressId',
  commentRateLimiter,
  upload.array('images', 5),
  [
    check('text').notEmpty().withMessage('Text is required'),
    check('rating').isInt({ min: 1, max: 5 }).withMessage('Rating 1-5 is required')
  ],
  commentController.createComment
);

// Delete comment (only author/admin)
router.delete(
  '/:id',
  (req, res, next) => { req.resourceType = 'comment'; next(); },
  authorize,
  commentController.deleteComment
);

module.exports = router;
