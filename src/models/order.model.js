'use strict';

const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'orders';

/*
[
  {
    productId,
    shopId,
    quantity,
    name,
    price
  }
]
 */
// Declare the Schema of the Mongo model
var orderSchema = new Schema(
  {
    order_userId: {
      type: Number,
      required: true,
    },
    order_checkout: {
      type: Object,
      required: true,
      default: {},
    },
    /*
      order_checkout = {
        totalPrice, 
        totalApplyDiscount,
        feeShip
      }
     */

    order_shipping: {
      type: Object,
      required: true,
      default: {},
    },
    /* 
      street, 
      city,
      state,
      country
    */
    order_payment: {
      type: Object,
      required: true,
      default: {},
    },
    order_products: {
      type: Array,
      required: true,
      default: [],
    },
    order_trackingNumber: {
      type: String,
      default: '#0001',
    },
    order_status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
      default: 'pending',
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'modifiedOn',
    },
  },
);

//Export the model
module.exports = {
  order: model(DOCUMENT_NAME, orderSchema),
};
