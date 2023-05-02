'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');

const { getInfoData } = require('../utils');
const { BadRequestError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');

const roleShop = {
  SHOP: 'SHOP',
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER',
  ADMIN: 'ADMIN',
};

class AccessService {
  
  /* 
    1 - check email in dbs
    2 - match password
    3 - create AT and RT and save 
    4 - generate tokens
    5 - get data return login
  */
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if(!foundShop){

    }
  };

  static signUp = async ({ name, email, password }) => {
    // try {
    // step 1: check email existed
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError('Error:: Shop has been already registered');
    }

    // create shop
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: roleShop,
    });

    if (newShop) {
      // create privateKey and publicKey
      // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      //   privateKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      // });

      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');

      // Public key CryptoGraphy Standards !

      console.log({ privateKey, publicKey }); // save collection keystore

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        // throw new BadRequestError('Error:: keyStore has error');
        return {
          code: 'xxx',
          message: 'keyStore has error',
        };
      }

      // const publicKeyObject = crypto.createPublicKey(publicKeyString);
      // console.info('publicKeyObject::', publicKeyObject);

      // create token pair
      const tokens = await createTokenPair({
        payload: { userId: newShop._id, email },
        publicKey,
        privateKey,
      });
      console.log('Created Token Success::', tokens);

      return {
        shop: getInfoData({
          fields: ['email', 'name', 'verify', 'status'],
          source: newShop,
        }),
        tokens,
      };
    }

    return {
      code: 200,
      metadata: null,
    };
    // } catch (error) {
    //   console.log('AccessService error', error);
    //   return {
    //     code: 'xxx',
    //     message: error.message,
    //     status: 'error',
    //   };
    // }
  };
}

module.exports = AccessService;
