const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const addressController = require('../controllers/address.controller');
const authorize = require('../middleware/authorize.middleware');

// Setup GridFS storage for address photos
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return { filename: 'address-' + Date.now() + path.extname(file.originalname) };
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

// Create address
router.post(
  '/',
  upload.single('photo'),
  [
    check('title').notEmpty().withMessage('Title is required'),
    check('latitude').isFloat().withMessage('Latitude is required'),
    check('longitude').isFloat().withMessage('Longitude is required')
  ],
  addressController.createAddress
);

// Get all addresses of current user
router.get('/me', addressController.getMyAddresses);

// Get public addresses
router.get('/public', addressController.getPublicAddresses);

// Get address by ID
router.get('/:id', addressController.getAddressById);

// Update address (only owner)
router.put(
  '/:id',
  upload.single('photo'),
  (req, res, next) => { req.resourceType = 'address'; next(); },
  authorize,
  [
    check('title').notEmpty().withMessage('Title is required'),
    check('latitude').isFloat().withMessage('Latitude is required'),
    check('longitude').isFloat().withMessage('Longitude is required')
  ],
  addressController.updateAddress
);

// Delete address (only owner)
router.delete(
  '/:id',
  (req, res, next) => { req.resourceType = 'address'; next(); },
  authorize,
  addressController.deleteAddress
);

module.exports = router;
