const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const userController = require('../controllers/user.controller');

// Setup GridFS storage for profile pics
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return { filename: 'profile-' + Date.now() + path.extname(file.originalname) };
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

// Get profile
router.get('/me', userController.getProfile);

// Update profile name
router.put(
  '/me',
  [ check('name').notEmpty().withMessage('Name is required') ],
  userController.updateProfile
);

// Upload profile photo
router.post('/me/photo', upload.single('photo'), userController.uploadProfilePhoto);

module.exports = router;
