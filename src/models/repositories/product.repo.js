'use strict';

const {
  product,
  electronic,
  clothing,
  furniture,
} = require('../product.model');
const { Types } = require('mongoose');

const findAllDraftStatusForShop = async ({ query, limit, skip }) => {
  return queryProduct({ query, limit, skip });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublished = true;
  console.log(foundShop)
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const findAllPublishedStatusForShop = async ({ query, limit, skip }) => {
  return queryProduct({ query, limit, skip });
};

const queryProduct = async ({ query, limit, skip }) => {
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
  publishProductByShop,
  findAllPublishedStatusForShop,
};
