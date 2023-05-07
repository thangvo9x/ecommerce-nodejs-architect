'use strict';

const ProductService = require('../services/product.service');

const { CreatedSuccess } = require('../core/success.response');

class ProductController {
  createProduct = async (req, res, next) => {
    new CreatedSuccess({
      message: 'Create Product Success!',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
