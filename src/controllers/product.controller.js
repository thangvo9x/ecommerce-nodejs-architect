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

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Published Product Success!',
      metadata: await ProductServiceV2.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'UnPublished Product!',
      metadata: await ProductServiceV2.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
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

  /**
   * @description Get all published for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllPublishedForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list Published status Success!',
      metadata: await ProductServiceV2.findAllPublishedStatusForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list getListSearchProduct Success!',
      metadata: await ProductServiceV2.searchProducts(req.params),
    }).send(res);
  };

  // END QUERY //
}

module.exports = new ProductController();
