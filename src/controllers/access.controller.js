'use strict';

const shopModel = require('../models/shop.model');
const AccessService = require('../services/access.service');

const { ConflictRequestError } = require('../core/error.response');
const { CreatedSuccess } = require('../core/success.response');

class AccessController {
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
