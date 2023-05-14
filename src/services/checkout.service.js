'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const { findCartById } = require('../models/repositories/cart.repo');
const { order } = require('../models/order.model');
const {
  checkProductAvailable,
} = require('../models/repositories/product.repo');
const { formatCurrency } = require('../utils');
const { getDiscountAmount } = require('./discount.service');
const { aquireLock, releaseLock } = require('./redis.service');
const { addStockToInventory } = require('./inventory.service');
/*

    Key feature: CheckoutService Service
 */

class CheckoutService {
  // login and without login
  /*
  { 
    cartId,
    userId, 
    shop_order_ids: [
      {
        shopId,
        shop_discount: [],
        item_products: [
          {
            price,
            quantity,
            productId
          }
        ]

      },
      {
        shopId,
        shop_discount: [
          {
            shopId,
            discountId,
            codeId
          }
        ],
        item_products: [
          {
            price,
            quantity,
            productId
          }
        ]
      }
    ]
  }
   */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // check cart has exist
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new NotFoundError('Cart does not exist');

    const checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0, // total discount on each order
        totalCheckout: 0,
      },
      shop_order_ids_new = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discounts, item_products } = shop_order_ids[i];
      // check product available to checkout
      const checkProductServer = await checkProductAvailable(item_products);
      console.log(`checkProductServer::`, checkProductServer);
      if (!checkProductServer[0]) throw new BadRequestError('order invalid!');

      // totalPrice
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      // total
      checkout_order.totalPrice += checkoutPrice;
      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      // shop_discount has exist and > 0, check isValid
      if (shop_discounts.length > 0) {
        // ex: 1 discount was be applied
        // get amount discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });

        // total discount amount
        checkout_order.totalDiscount += discount;
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order: {
        ...checkout_order,
        totalPrice: formatCurrency(checkout_order.totalPrice),
        totalDiscount: formatCurrency(checkout_order.totalDiscount),
        totalCheckout: formatCurrency(checkout_order.totalCheckout),
      },
    };
  }

  // order
  static async order({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    // double check for checkout again
    const { shop_order_ids_new, checkout_order } = await this.checkoutReview({
      cartId,
      userId,
      shop_order_ids,
    });
    const products = shop_order_ids_new.flatMap(order => order.item_products);
    console.log(`[1]:::`, products);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { quantity, productId } = products[i];
      const keyLock = await aquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    // check if have any product out of stock in inventory
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        'Some product has been updated, Come back cart and try again, please!',
      );
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_products: shop_order_ids_new,
      order_shipping: user_address,
      order_payment: user_payment,
    });

    // success order -> remove products in cart
    if (newOrder) {
      // ---- TODO: must have loop for productId field input.
      // const addedStock = await addStockToInventory({
      //   stock: products.length,
      //   productId: newOrder.order_products,
      //   shopId,
      //   location: user_address,
      // });
    }

    return newOrder;
  }

  /* 
    Query Orders [User]
  */
  static async getOrdersByUser({}) {}

  /* 
    Query Order Using Id [User]
  */
  static async getOrderByUser({}) {}

  /* 
    Cancel Order [User]
  */
  static async cancelOrderByUser({}) {}

  /* 
    Update Order Status [Shop | Admin]
  */
  static async updateOrderStatusByShop({}) {}
}

module.exports = CheckoutService;
