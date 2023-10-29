const { SuccessResponse } = require('../core/success.response');
const { uploadImage } = require('../services/upload.service');

class UploadController {
  upload = async (req, res, next) => {
    new SuccessResponse({
      message: 'upload file successfully',
      metadata: await uploadImage(),
    }).send(res);
  };
}

module.exports = new UploadController();
