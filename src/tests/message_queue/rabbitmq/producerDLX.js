const amqp = require('amqplib');
const messages = 'Hello, RabbitMQ for tonyvo';

const log = console.log;
console.log = function () {
  log.apply(console, [new Date()].concat(arguments));
};

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:12345@localhost');
    const channel = await connection.createChannel();

    const notificationExchange = 'notificationEx'; // notificationEx direct
    const notificationQueue = 'notiQueueProcess'; // assertQueue
    const notificationExchangeDLX = 'notificationExDLX'; //notificationExchangeDLX
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';

    // 1. create assertExchange
    await channel.assertExchange(notificationExchange, 'direct', {
      durable: true,
    });

    // 2. Create Queue
    const queueResult = await channel.assertQueue(notificationQueue, {
      exclusive: false, // allow others connections access same time into queue.
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });

    // 3. bind queue
    await channel.bindQueue(queueResult.queue, notificationExchange);

    // 4. send message
    const msg = 'a new product';
    console.info(`product msg ${msg}`);
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: '10000', // in ms
    });
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch(console.error);
