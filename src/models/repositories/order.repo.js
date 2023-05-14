'use strict';

const { convertToObjectId } = require('../../utils');
const { inventory } = require('../inventory.model');

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'unknown',
}) => {
  return await inventory.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    location,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inven_productId: convertToObjectId(productId),
      inven_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        inven_stock: -quantity,
      },
      $push: {
        inven_reservations: {
          quantity,
          cartId,
          createdOn: new Date(),
        },
      },
    },
    options = { upsert: true, new: true };

  return await inventory.updateOne(query, updateSet, options);
};

module.exports = {
  insertInventory,
  reservationInventory,
};
