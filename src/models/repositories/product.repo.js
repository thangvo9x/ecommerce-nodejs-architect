'use strict';

const {
  product,
  electronic,
  clothing,
  furniture,
} = require('../product.model');

const findAllDraftStatusForShop = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

module.exports = {
  findAllDraftStatusForShop,
};
