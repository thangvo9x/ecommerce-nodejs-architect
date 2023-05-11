'use strict';

//!mdbg
const {Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';
// Declare the Schema of the Mongo model
var discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
    },
    discount_type: {
      type: String,
      enum: ['fixed_amount', 'percentage'],
      default: 'fixed_amount',
    }, //
    discount_value: {
      type: Number,
      required: true, // 10.0000, 10
    },
    discount_code: {
      // discount code
      type: String,
      required: true,
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    discount_max_uses: {
      // so luong discount_code toi dc ap dung
      type: Number,
      required: true,
    },
    discount_uses_count: {
      // so luong discount_code da su dung
      type: Number,
      required: true,
    },
    discount_users_used: {
      // user nao da su dung
      type: Array,
      default: [],
    },
    discount_max_uses_per_user: {
      // so luong cho phep toi da moi user
      type: Number,
      required: true,
    },
    discount_min_order_value: {
      // so luong user dc ap dung
      type: Number,
      required: true,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ['all', 'specific'],
    },
    discount_product_ids: {
      // so san pham duoc ap dung.
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
