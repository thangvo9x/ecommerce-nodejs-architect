'use strict';

const keytokenModel = require('../models/keytoken.model');

class KeyTokenService {
  static async createKeyToken({ userId, publicKey, privateKey, refreshToken }) {
    try {
      // lv0
      // const publicKeyString = publicKey.toString(); // because publicKey was generated is Hash => toString
      // const tokens = await keytokenModel.create({
      //     user: userId,
      //     publicKey,
      //     privateKey
      // });

      // return tokens ? tokens.publicKey : null

      // advance
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };
      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null
      
    } catch (error) {
      return error;
    }
  }
}

module.exports = KeyTokenService;
