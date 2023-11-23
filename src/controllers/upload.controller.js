const { BadRequestError } = require('../core/error.response');
const { SuccessResponse } = require('../core/success.response');
const { uploadFromLocalImageS3 } = require('../services/upload-s3.service');
const {
  uploadImage,
  uploadFromLocalImage,
  uploadFromLocalImageFiles,
} = require('../services/upload.service');

class UploadController {
  upload = async (req, res, next) => {
    new SuccessResponse({
      message: 'upload file successfully',
      metadata: await uploadImage(),
    }).send(res);
  };

  uploadFile = async (req, res, next) => {
    const { file } = req;
    if (!file) throw new BadRequestError('File missing');
    new SuccessResponse({
      message: 'upload file successfully',
      metadata: await uploadFromLocalImage({
        path: file.path,
      }),
    }).send(res);
  };

  uploadFiles = async (req, res, next) => {
    const { files } = req;
    if (!files.length) throw new BadRequestError('Files missing');
    new SuccessResponse({
      message: 'upload files successfully',
      metadata: await uploadFromLocalImageFiles({
        files,
      }),
    }).send(res);
  };

  // Use S3Client

  uploadFileLocalS3 = async (req, res, next) => {
    const { file } = req;
    if (!file) throw new BadRequestError('File missing');
    new SuccessResponse({
      message: 'upload file successfully use s3Client',
      metadata: await uploadFromLocalImageS3({
        file,
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
