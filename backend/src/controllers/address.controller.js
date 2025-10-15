const Address = require('../models/address.model');
const User = require('../models/user.model');
const { validationResult } = require('express-validator');

// Create a new address
exports.createAddress = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, description, isPublic, latitude, longitude } = req.body;
    const photoId = req.file ? req.file.id : null;
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const address = new Address({
      title,
      description,
      isPublic,
      location: { latitude, longitude },
      photo: photoId,
      owner: user._id
    });
    await address.save();
    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
};

// Get addresses for current user
exports.getMyAddresses = async (req, res, next) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const addresses = await Address.find({ owner: user._id });
    res.json(addresses);
  } catch (error) {
    next(error);
  }
};

// Get public addresses (all users except private ones)
exports.getPublicAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ isPublic: true }).populate('owner', 'name profilePicture');
    res.json(addresses);
  } catch (error) {
    next(error);
  }
};

// Get single address by id (if public or owned)
exports.getAddressById = async (req, res, next) => {
  try {
    const address = await Address.findById(req.params.id).populate('owner', 'name profilePicture');
    if (!address) return res.status(404).json({ message: 'Address not found' });
    if (!address.isPublic) {
      const user = await User.findOne({ firebaseUid: req.user.uid });
      if (!address.owner._id.equals(user._id)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }
    res.json(address);
  } catch (error) {
    next(error);
  }
};

// Update address (only owner)
exports.updateAddress = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, description, isPublic, latitude, longitude } = req.body;
    const photoId = req.file ? req.file.id : undefined;
    const updateData = { title, description, isPublic, 'location.latitude': latitude, 'location.longitude': longitude };
    if (photoId) updateData.photo = photoId;
    const address = await Address.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(address);
  } catch (error) {
    next(error);
  }
};

// Delete address (only owner)
exports.deleteAddress = async (req, res, next) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    res.json({ message: 'Address deleted' });
  } catch (error) {
    next(error);
  }
};
