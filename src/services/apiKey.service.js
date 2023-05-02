'use strict';

const apiKeyModel = require('../models/apiKey.model');
const crypto = require('node:crypto');

const findById = async (key) => {
  // await apiKeyModel.create({
  //   key: crypto.randomBytes(64).toString('hex'),
  //   permissions: ['0000'],
  // });
  return await apiKeyModel.findOne({ key, status: true }).lean();
};

module.exports = { findById };
