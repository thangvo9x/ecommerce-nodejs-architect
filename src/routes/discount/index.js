'use strict';

const express = require('express');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const discountController = require('../../controllers/discount.controller');

router.post('/amount', asyncHandler(discountController.getAllDiscountAmount));
router.get(
  '/list-products',
  asyncHandler(discountController.getAllDiscountWithProducts),
);

// authentication
router.use(authentication);

router.post('', asyncHandler(discountController.createDiscountCode));
router.get('', asyncHandler(discountController.getAllDiscountCodeByShop));

module.exports = router;
