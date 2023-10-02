'use strict';
const amqp = require('amqplib');

async function consumerOrderedMessage() {
  const connection = await amqp.connect('amqp://guest:12345@localhost');
  const channel = await connection.createChannel();

  const queueName = 'ordered-queued-message';
  await channel.assertQueue(queueName, {
    durable: true,
  });

  // Set prefetch to make sure only one ack at once time

  channel.prefetch(1);

  channel.consume(queueName, msg => {
    const message = msg.content.toString();

    // fake to not-ordering
    setTimeout(() => {
      console.log('processed: ', message);
      channel.ack(msg);
    }, Math.random() * 1000);
  });
}

consumerOrderedMessage().catch(err => console.error(err));
