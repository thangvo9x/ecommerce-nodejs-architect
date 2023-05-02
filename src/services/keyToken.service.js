'use strict';

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static async createKeyToken({ userId, publicKey, privateKey }) {
    try {
        // const publicKeyString = publicKey.toString(); // because publicKey was generated is Hash => toString
        const tokens = await keytokenModel.create({
            user: userId,
            publicKey,
            privateKey
        });
        
        return tokens ? tokens.publicKey : null
    } catch (error) {
        return error;
    }
  }
}

module.exports = KeyTokenService;
