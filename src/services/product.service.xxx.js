'use strict';

const {
  product,
  clothing,
  electronic,
  furniture,
} = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');
const {
  findAllDraftStatusForShop,
  findAllPublishedStatusForShop,
  publishProductByShop,
} = require('../models/repositories/product.repo');

class ProductFactory {
  static productRegistry = {}; // key-class

  static registerProductType(type, classRef) {
    this.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = this.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product type ${type}`);

    return new productClass(payload).createProduct();
  }

  static async findAllDraftStatusForShop({
    product_shop,
    limit = 50,
    skip = 0,
  }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftStatusForShop({ query, limit, skip });
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async findAllPublishedStatusForShop({
    product_shop,
    limit = 50,
    skip = 0,
  }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishedStatusForShop({ query, limit, skip });
  }
}

// baseProduct
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}

// define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError('create new Clothing error');

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError('create new Product error');

    return newProduct;
  }
}

// define sub-class for different product types Electronics
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError('create new Electronics error');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('create new Product error');

    return newProduct;
  }
}

// define sub-class for different product types Furnitures
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError('create new Furnitures error');

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError('create new Product error');

    return newProduct;
  }
}

// register product type
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
