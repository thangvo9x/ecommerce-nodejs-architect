'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const { findCartById } = require('../models/repositories/cart.repo');

const {
  checkProductAvailable,
} = require('../models/repositories/product.repo');
const { formatCurrency } = require('../utils');
const { getDiscountAmount } = require('./discount.service');
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
}

module.exports = CheckoutService;
