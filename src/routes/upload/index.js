'use strict';

const express = require('express');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const uploadController = require('../../controllers/upload.controller');

// authentication
// router.use(authentication);

router.post('/product', asyncHandler(uploadController.upload));

module.exports = router;
