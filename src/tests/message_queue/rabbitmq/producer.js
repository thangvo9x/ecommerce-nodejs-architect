const amqp = require('amqplib');
const messages = 'Hello, RabbitMQ for tonyvo';

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:12345@localhost');
    const channel = await connection.createChannel();

    const queueName = 'test-topic';
    await channel.assertQueue(queueName, {
      durable: true,
    });

    // send messages to consumer channel
    channel.sendToQueue(queueName, Buffer.from(messages));
    console.info(`messages sent: ${messages}`);
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch(console.error);
