'use strict';

const express = require('express');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const cartController = require('../../controllers/cart.controller');

// authentication
router.use(authentication);

router.post('', asyncHandler(cartController.addToCart));
router.delete('', asyncHandler(cartController.delete));
router.post('/update', asyncHandler(cartController.updateToCart));
router.get('', asyncHandler(cartController.getListToCart));

module.exports = router;
