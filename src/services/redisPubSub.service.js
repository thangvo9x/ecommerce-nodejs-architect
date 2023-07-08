const redis = require('redis');

class RedisPubSubService {
  constructor() {
    this.subscribes = redis.createClient();
    this.publisher = redis.createClient();
  }

  publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (error, reply) => {
        if (error) {
          reject(error);
        }
        resolve(reply);
      });
    });
  }

  subscribe(channel, cb) {
    this.subscribes.subscribe(channel);
    this.subscribes.on('message', (subscriberChannel, message) => {
      if (channel === subscriberChannel) {
        cb(channel, message);
      }
    });
  }
}

module.exports = new RedisPubSubService();
