'use strict';

const CartService = require('../services/cart.service');
const { CreatedSuccess, SuccessResponse } = require('../core/success.response');

class CartController {
  /**
   * @desc add product to cart for user
   * @param {*} {int} userId
   * @param {*} res
   * @param {*} next
   * @method POST
   * @url /v1/api/cart/user
   * @return {
   * }
   */
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new cart success!',
      metadata: await CartService.addProductToCart(req.body),
    }).send(res);
  };

  updateToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Updated cart success!',
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  delete = async (req, res, next) => {
    new SuccessResponse({
      message: 'Deleted cart success!',
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };

  getListToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'List cart success!',
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
