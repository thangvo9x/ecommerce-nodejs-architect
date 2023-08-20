const {
  Kafka,
  logLevel,
  KafkaJSNumberOfRetriesExceeded,
  KafkaJSNonRetriableError,
} = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
  logLevel: logLevel.NOTHING,
});
const producer = kafka.producer();

const runProducer = async () => {
  await producer.connect().then(_ => {
    console.info('CONNECTED');
  });
  await producer.send({
    topic: 'test-topic',
    messages: [{ value: 'Hello KafkaJS user! by tonyvo' }],
  });

  await producer.disconnect();
};

runProducer().catch(console.error);
