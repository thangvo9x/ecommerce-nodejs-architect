'use strict';

const redis = require('redis');
const { promisify } = require('node:util');
const {
  reservationInventory,
} = require('../models/repositories/inventory.repo');
const redisClient = redis.createClient();

// redisClient.ping((err, result) => {
//   if (err) {
//     console.error('Error connecting database:', err);
//   } else {
//     console.log('Connected to redis');
//   }
// });

// redisClient.on('error', err => console.log('Redis Server Error', err));

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setNXAsync = promisify(redisClient.setNX).bind(redisClient);

const aquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const retryTimes = 10; // how many time to retry.
  const expireTime = 3; // time to temp lock

  for (let i = 0; i < retryTimes; i++) {
    // tao 1 key, who ai nam duoc -> vao thanh toan
    const result = await setNXAsync(key, expireTime);
    console.log('result', result);
    if (result === 1) {
      // thao tac inventory
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReservation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve, _) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async keyLock => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  aquireLock,
  releaseLock,
};
