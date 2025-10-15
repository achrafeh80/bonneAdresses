const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image.controller');

// Get image by ID
router.get('/:id', imageController.getImage);

module.exports = router;
