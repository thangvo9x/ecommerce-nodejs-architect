'use strict';

const { s3, PutObjectCommand } = require('../configs/s3.config');

const uploadFromLocalImageS3 = async ({ file }) => {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname || 'unknown',
      Body: file.buffer,
      ContentType: 'image/jpeg',
    });

    const result = await s3.send(command);
    console.log('result', result);
    return result;
  } catch (error) {
    console.error('error uploadfile S3client', error);
  }
};

module.exports = {
  uploadFromLocalImageS3,
};
