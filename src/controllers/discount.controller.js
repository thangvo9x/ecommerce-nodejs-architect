'use strict';

const DiscountService = require('../services/discount.service');
const { CreatedSuccess, SuccessResponse } = require('../core/success.response');

class DiscountController {
  // create discount
  createDiscountCode = async (req, res, next) => {
    new CreatedSuccess({
      message: 'Create Discount Success!',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  // get DiscountCode
  getAllDiscountCodeByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list Discount Success!',
      metadata: await DiscountService.getAllDiscountCodeByShop({
        ...req.query,
      }),
    }).send(res);
  };

  getAllDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Discount amount Success!',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };

  getAllDiscountWithProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all Discount with Products Success!',
      metadata: await DiscountService.getAllDiscountCodeWithProducts({
        ...req.query,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
