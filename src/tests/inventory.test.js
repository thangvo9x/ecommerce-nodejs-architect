const redisPubSubService = require('../services/redisPubSub.service');

class InventoryServiceTest {
  constructor() {
    redisPubSubService.subscribe(
      'purchaseProduct_event',
      (channel, message) => {
        console.info('Received Message', channel);
        InventoryServiceTest.updateInventory(message);
      },
    );
  }

  static updateInventory(messageContent) {
    const messageContentParsed = JSON.parse(messageContent);
    console.log(
      `Updated with ${messageContent} with quantity ${messageContentParsed.quantity}`,
    );
  }
}

module.exports = new InventoryServiceTest();
