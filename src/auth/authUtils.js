'use strict';

const JWT = require('jsonwebtoken');
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
        if(err){
            console.error(`error verify::, ${err}`);
        } else {
            console.log(`decode verify`, decode);
        }
    })
    return { accessToken, refreshToken };
  } catch (error) {}
};

module.exports = { createTokenPair };
