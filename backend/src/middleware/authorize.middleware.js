const Address = require('../models/address.model');
const Comment = require('../models/comment.model');
const User = require('../models/user.model');

module.exports = async (req, res, next) => {
  const userId = req.user.uid;
  const resourceType = req.resourceType; // 'address' or 'comment'
  const resourceId = req.params.id;

  try {
    let resource;
    if (resourceType === 'address') {
      resource = await Address.findById(resourceId);
      if (!resource) return res.status(404).json({ message: 'Address not found' });
      if (!resource.owner.equals(resource.owner) || resource.owner.toString() !== (await User.findOne({ firebaseUid: userId }))._id.toString()) {
        const user = await User.findOne({ firebaseUid: userId });
        if (!user || !user.isAdmin) {
          return res.status(403).json({ message: 'Forbidden' });
        }
      }
    } else if (resourceType === 'comment') {
      resource = await Comment.findById(resourceId);
      if (!resource) return res.status(404).json({ message: 'Comment not found' });
      if (resource.author.toString() !== (await User.findOne({ firebaseUid: userId }))._id.toString()) {
        const user = await User.findOne({ firebaseUid: userId });
        if (!user || !user.isAdmin) {
          return res.status(403).json({ message: 'Forbidden' });
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
