'use strict';

const express = require('express');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const inventoryController = require('../../controllers/inventory.controller');

// authentication
router.use(authentication);

router.post('', asyncHandler(inventoryController.addStockToInventory));

module.exports = router;
