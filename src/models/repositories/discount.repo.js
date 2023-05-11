'use strict';

const discountModel = require('../discount.model');
const {unGetSelectData} = require('../../utils');

const createDiscount = async ({
  discount_name,
  discount_description,
  discount_type,
  discount_value,
  discount_code,
  discount_start_date,
  discount_end_date,
  discount_max_uses,
  discount_uses_count,
  discount_users_used,
  discount_max_uses_per_user,
  discount_min_order_value,
  discount_shopId,
  discount_is_active,
  discount_applies_to,
  discount_product_ids,
}) => {
  return await discountModel.create({
    discount_name,
    discount_description,
    discount_type,
    discount_value,
    discount_code,
    discount_start_date,
    discount_end_date,
    discount_max_uses,
    discount_uses_count,
    discount_users_used,
    discount_max_uses_per_user,
    discount_min_order_value,
    discount_shopId,
    discount_is_active,
    discount_applies_to,
    discount_product_ids,
  });
};

const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean();
  return documents;
};

const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return documents;
};

module.exports = {
  createDiscount,
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
};
