'use strict';

const shopModel = require('../models/shop.model');
const AccessService = require('../services/access.service');

const { ConflictRequestError } = require('../core/error.response');
const { CreatedSuccess, SuccessResponse } = require('../core/success.response');

class AccessController {
  logout = async (req, res, next) => {
    // console.log('keyStore', req)
    new SuccessResponse({
      message: 'Logout success',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res) => {
    console.log('[P]::signUp::', req.body);
    const shopExisted = await shopModel
      .findOne({ email: req.body.email })
      .lean();
    if (shopExisted) {
      throw new ConflictRequestError('Error: Shop has been already registered');
    }

    new CreatedSuccess({
      message: 'Created Shop Successfully ^__^',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new AccessController();
