'use strict';

const ProductService = require('../services/product.service');
const ProductServiceV2 = require('../services/product.service.xxx');
const { CreatedSuccess, SuccessResponse } = require('../core/success.response');

class ProductController {
  createProduct = async (req, res, next) => {
    // new CreatedSuccess({
    //   message: 'Create Product Success!',
    //   metadata: await ProductService.createProduct(req.body.product_type, {
    //     ...req.body,
    //     product_shop: req.user.userId,
    //   }),
    // }).send(res);
    new CreatedSuccess({
      message: 'Create Product Success!',
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  // QUERY //
  /**
   * @description Get all drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list Draft status Success!',
      metadata: await ProductServiceV2.findAllDraftStatusForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  // END QUERY //
}

module.exports = new ProductController();
