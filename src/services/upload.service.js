const cloudinary = require('../configs/cloudinary.config');

// 1. upload from image url
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

// 2. upload from image

const uploadFromLocalImage = async ({ path, folderName = 'product/8409' }) => {
  try {
    const resultUpload = await cloudinary.uploader.upload(path, {
      public_id: 'thumb',
      folder: folderName,
    });
    console.log(resultUpload);
    return {
      image_url: resultUpload.url,
      shopId: 8409,
      thumb_url: await cloudinary.url(resultUpload.public_id, {
        width: 100,
        height: 100,
        format: 'jpg',
      }),
    };
  } catch (error) {
    console.error('error uploadfile', error);
  }
};

const uploadFromLocalImageFiles = async ({
  files,
  folderName = 'product/8409',
}) => {
  try {
    console.log('files::', files, folderName);

    if (!files.length) return;

    const uploadedUrls = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName,
      });

      uploadedUrls.push({
        image_url: result.secure_url,
        shopId: 8409,
        thumb_url: await cloudinary.url(result.public_id, {
          width: 100,
          height: 100,
          format: 'jpg',
        }),
      });
    }

    return uploadedUrls;
  } catch (error) {
    console.error('error upload multiple files', error);
  }
};

module.exports = {
  uploadImage,
  uploadFromLocalImage,
  uploadFromLocalImageFiles,
};
