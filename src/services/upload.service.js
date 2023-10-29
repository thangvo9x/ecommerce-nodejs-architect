const cloudinary = require('../configs/cloudinary.config');

const uploadImage = async () => {
  try {
    const fileImg =
      'https://down-vn.img.susercontent.com/file/3ba4a084bd70b8a9c4f3a60ed75fefeb_tn';
    const folderName = 'product/shopId',
      newFileName = 'testupload';

    const resultUpload = await cloudinary.uploader.upload(fileImg, {
      // public_id: 'olympic_flag',
      folder: folderName,
    });
    return resultUpload;
  } catch (error) {
    console.error('error uploadfile', error);
  }
};

module.exports = { uploadImage };
