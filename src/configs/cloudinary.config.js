const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'tonydev',
  api_key: '787974193484378',
  api_secret: 'AGgYKy9fGy35i2ekOXsIgi-NCjU',
  secure: true,
});

module.exports = cloudinary;
