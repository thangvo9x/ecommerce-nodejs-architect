'use strict';

const express = require('express');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const NotificationController = require('../../controllers/notification.controller');

// maybe for use to get vouchers.. => should not need login
// some cases here

// authentication
router.use(authentication);

router.get('', asyncHandler(NotificationController.getNotifications));

module.exports = router;
