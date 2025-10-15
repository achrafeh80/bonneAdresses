const mongoose = require('mongoose');

// Stream image from GridFS by id
exports.getImage = async (req, res, next) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'fs' });
    bucket.openDownloadStream(fileId).on('error', err => {
      res.status(404).json({ message: 'Image not found' });
    }).pipe(res);
  } catch (error) {
    next(error);
  }
};
