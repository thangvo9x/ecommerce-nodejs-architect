'use strict';
const { BadRequestError } = require('../core/error.response');
const {
  product,
  clothing,
  electronic,
  furniture,
} = require('../models/product.model');
const {
  findAllDraftStatusForShop,
  findAllPublishedStatusForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require('../models/repositories/product.repo');
const { insertInventory } = require('../models/repositories/inventory.repo');

const { updateNestedObjectParser, removeUndefinedObject } = require('../utils');
const { pushNotificationToSystem } = require('./notification.service');

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

  static async updateProduct(type, productId, payload) {
    const productClass = this.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product type ${type}`);

    return new productClass(payload).updateProduct(productId);
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

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  static async findAllPublishedStatusForShop({
    product_shop,
    limit = 50,
    skip = 0,
  }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishedStatusForShop({ query, limit, skip });
  }

  static async searchProducts({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      page,
      sort,
      filter,
      select: [
        'product_name',
        'product_thumb',
        'product_price',
        'product_shop',
      ],
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ['__v'] });
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
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      // add product_stock
      await insertInventory({
        productId: newProduct._id,
        shopId: newProduct.product_shop,
        stock: newProduct.product_quantity,
      });

      // push notification to system
      pushNotificationToSystem({
        type: 'SHOP-001',
        receivedId: 1,
        senderId: this.product_shop,
        options: {
          product_name: this.product_name,
          shop_name: this.product_shop,
        },
      })
        .then(rs => console.log('rs', rs))
        .catch(error => console.error(error));
    }
    return newProduct;
  }

  async updateProduct(productId, payload) {
    return await updateProductById({ productId, payload, model: product });
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

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError('create new Product error');

    return newProduct;
  }

  async updateProduct(productId) {
    const objParams = this;
    if (objParams.product_attributes) {
      await updateProductById({
        productId,
        payload: updateNestedObjectParser(objParams),
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(productId, objParams);
    return updateProduct;
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

  async updateProduct(productId) {
    const objParams = this;
    if (objParams.product_attributes) {
      await updateProductById({
        productId,
        payload: updateNestedObjectParser(objParams),
        model: electronic,
      });
    }

    const updateProduct = await super.updateProduct(productId, objParams);
    return updateProduct;
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

  async updateProduct(productId) {
    const objParams = removeUndefinedObject(this);
    console.log(`[1]::`, this);
    if (objParams.product_attributes) {
      await updateProductById({
        productId,
        payload: updateNestedObjectParser(objParams),
        model: furniture,
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objParams),
    );
    return updateProduct;
  }
}

// register product type
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
