'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const { cart } = require('../models/cart.model');
const {
  createUserCart,
  updateUserCartQuantity,
  findOneCartByUserId,
  deleteUserCart,
  getListUserCart,
} = require('../models/repositories/cart.repo');

const productSerivce = require('./product.service.xxx');
/*

    Key feature: Cart Service
    - add product to cart [user]
    - reduce product quantity by one [user]
    - increase product quantity by one [user]
    - get cart [user]
    - delete cart [user]
    - delete cart item [user]
 */

class CartService {
  static async addProductToCart({ userId, product = {} }) {
    // check cart has existed
    const userCart = await findOneCartByUserId(userId);
    if (!userCart) {
      // create cart for user
      return await createUserCart({ userId, product });
    }

    // has cart but dont have any products
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // has cart and having products => update quantity
    return await updateUserCartQuantity({ userId, product });
  }

  /*
  shop_order_ids: [
    {
        shopId,
        item_products: [
            {
                quantity,
                price,
                shopId,
                old_quantity,
                productId
            }
        ],
        version
    }
  ]
   */
  static async addToCartV2({ userId, shop_order_ids = {} }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    // check product
    const foundProduct = await productSerivce.findProduct({
      product_id: productId,
    });
    if (!foundProduct) throw new NotFoundError('product does not exist');

    // compare product shop
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
      throw new NotFoundError('shop does not exist');

    if (quantity === 0) {
      // delete
    }

    return await updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    return await deleteUserCart({ userId, productId });
  }

  static async getListUserCart({ userId }) {
    return await getListUserCart({ userId });
  }
}

module.exports = CartService;
