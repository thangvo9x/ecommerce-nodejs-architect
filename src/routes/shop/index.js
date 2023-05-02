'use strict';

const express = require('express');
const shopController = require('../../controllers/shop.controller');
const router = express.Router();

//sign up
router.post('/shop/sign-up', shopController.signUp);

module.exports = router;
