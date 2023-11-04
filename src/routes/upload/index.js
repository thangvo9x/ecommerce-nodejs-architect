'use strict';

const express = require('express');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const uploadController = require('../../controllers/upload.controller');
const { uploadDisk, uploadMemory } = require('../../configs/multer.config');

// authentication
// router.use(authentication);

router.post('/product', asyncHandler(uploadController.upload));
router.post(
  '/product/thumb',
  uploadDisk.single('file'),
  asyncHandler(uploadController.uploadFile),
);
router.post(
  '/product/multiple',
  uploadDisk.array('files', 3),
  asyncHandler(uploadController.uploadFiles),
);

module.exports = router;
