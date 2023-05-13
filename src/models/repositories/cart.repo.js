'use strict';

const { cart } = require('../cart.model');
const createUserCart = async ({ userId, product }) => {
  const query = {
    cart_userId: userId,
    cart_state: 'active',
  };
  const updateOrInsert = {
    $addToSet: {
      cart_products: product,
    },
  };
  const options = { upsert: true, new: true };

  return await cart.findOneAndUpdate(query, updateOrInsert, options);
};

const updateUserCartQuantity = async ({ userId, product }) => {
  const { productId, quantity } = product;
  const query = {
      cart_userId: userId,
      'cart_products.productId': productId,
      cart_state: 'active',
    },
    updateSet = {
      $inc: {
        'cart_products.$.quantity': quantity,
      },
    },
    options = { upsert: true, new: true };

  return await cart.findOneAndUpdate(query, updateSet, options);
};

const findOneCartByUserId = async userId => {
  return await cart.findOne({ cart_userId: userId });
};

const deleteUserCart = async ({ userId, productId }) => {
  const query = { cart_userId: userId, cart_state: 'active' };
  const updateSet = {
    $pull: {
      cart_products: {
        productId,
      },
    },
  };
  return await cart.updateOne(query, updateSet);
};

const getListUserCart = async ({ userId }) => {
  return await cart
    .findOne({
      cart_userId: userId,
    })
    .lean();
};

module.exports = {
  createUserCart,
  updateUserCartQuantity,
  findOneCartByUserId,
  deleteUserCart,
  getListUserCart,
};
