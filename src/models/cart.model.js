'use strict';

const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'carts';

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
var cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ['active', 'completed', 'failure', 'pending'],
      default: 'active',
    },
    cart_products: {
      type: Array,
      required: true,
      default: [],
    },
    cart_quantity_products: {
      type: Number,
      required: true,
      default: 0,
    },
    cart_userId: {
      type: Number,
      required: true,
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
  cart: model(DOCUMENT_NAME, cartSchema),
};
