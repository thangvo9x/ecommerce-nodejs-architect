'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const discountModel = require('../models/discount.model');
const {
  createDiscount,
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  checkDiscountExisted,
} = require('../models/repositories/discount.repo');
const { findAllProducts } = require('../models/repositories/product.repo');
const { convertToObjectId } = require('../utils');

/* 
    Discount Service
    1. - Generator discount code : Shop | Admin
    2. - Get discount amount [User]
    3. - Get all discount codes [User | Shop]
    4. - Verify discount code [User]
    5. - Delete discount code [Admin | Shop]
    6. - Cancel discount code [User]
 */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      users_used,
      max_uses_per_user,
    } = payload;

    const now = new Date();
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (now < startDate || now > endDate) {
      throw new BadRequestError('Discount code has expired');
    }

    if (startDate >= endDate) {
      throw new BadRequestError('Start Date must be before end date');
    }

    // create index for discount code
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectId(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount existed');
    }

    // check used > max value
    if (max_uses > max_value) {
      throw new BadRequestError(
        'Discount can used can not greater Discount Max value',
      );
    }

    const newDiscount = await createDiscount({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: startDate,
      discount_end_date: endDate,
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids,
    });
    return newDiscount;
  }

  static async updateDiscountCode() {}

  /* get list product by discount_code  - USER */
  static async getAllDiscountCodeWithProducts({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectId(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active)
      throw new NotFoundError('Discount not found');

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === 'all') {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectId(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name', 'isPublished', 'product_shop'],
      });
    }

    if (discount_applies_to === 'specific') {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name'],
      });
    }

    return products;
  }

  /* get list product by discount_code  - for SHOP */
  static async getAllDiscountCodeByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectId(shopId),
        discount_is_active: true,
      },
      unSelect: ['__v', 'discount_shopId'],
      model: discountModel,
    });
    return discounts;
  }

  /* 
  Apply discount code
  producst = [
    {
      productId,
      shopId,
      quantity,
      name,
      price
    }
  ]
  */

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExisted({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectId(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError('Discount not found');

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value,
    } = foundDiscount;
    if (!discount_is_active) throw new NotFoundError('Discount has expired!');
    if (!discount_max_uses) throw new NotFoundError('Discount are out!');

    const now = new Date();
    const startDate = new Date(discount_start_date);
    const endDate = new Date(discount_end_date);

    // if (now < startDate || now > endDate) {
    //   throw new BadRequestError('Discount code has expired');
    // }

    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `discount require a minimum order value of ${discount_min_order_value}`,
        );
      }
    }

    if (discount_max_uses_per_user > 0) {
      const useUserDiscount = discount_users_used.find(
        user => user.userId === userId,
      );
      if (useUserDiscount) {
        // ...
      }
    }

    // check discount has fixed_amount
    const amount =
      discount_type === 'fixed_amount'
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  /* 
    Delete Discount
  */

  static async deleteDiscountCode({ codeId, shopId }) {
    // Todo: should be check some cases before delete.
    // delete soft or move record to another db (as save history for later);
    const deleted = await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectId(shopId),
    });
    return deleted;
  }

  /*
    Cancel Discount
  */
  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExisted({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectId(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError('Discount does not found');

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });
    return result;
  }
}

module.exports = DiscountService;
