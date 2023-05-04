'use strict';

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailError, NotFoundError } = require('../core/error.response');

// services
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
};


const createTokenPair = async ({ payload, publicKey, privateKey }) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: '7 days',
    });

    // use SECRET_KEY is WRONG. => leak ^__^

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify::, ${err}`);
      } else {
        console.log(`decode verify`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler( async (req, res, next) => {
  /* 
    1. check userId missing ?
    2. get accessToken 
    3. verify token
    4. check user from db
    5. check keyStore with this userId
    6. ok all ? return next()
   */

    const userId = req.headers[HEADER.CLIENT_ID];
    if(!userId) throw new AuthFailError('Invalid Request');

    // 2
    const keyStore = await findByUserId(userId);
    if(!keyStore) throw new NotFoundError('Not found keystore')

    // 3
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if(!accessToken) throw new AuthFailError('Invalid Request');

    try {
      const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
      if(userId !== decodeUser.userId) throw new AuthFailError('Invalid User');

      req.keyStore = keyStore;
      return next();

    } catch (error) {
      throw error;;
    }

});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
}

module.exports = { createTokenPair, authentication , verifyJWT};
