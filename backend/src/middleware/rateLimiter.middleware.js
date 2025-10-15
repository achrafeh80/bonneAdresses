const rateLimit = require('express-rate-limit');

const commentRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 comments per windowMs
  message: 'Too many comments created from this IP, please try again later'
});

module.exports = { commentRateLimiter };
