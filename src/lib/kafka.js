const { Kafka, logLevel } = require('kafkajs');

const brokers = (process.env.KAFKA_BROKERS || '').split(',').map((b) => b.trim()).filter(Boolean);

let producer;

async function initKafkaProducer() {
  if (!brokers.length) {
    console.warn('[kafka] KAFKA_BROKERS is empty, Kafka disabled');
    return null;
  }

  try {
    const kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'a360nis360-backend',
      brokers,
      logLevel: logLevel.NOTHING
    });

    producer = kafka.producer();
    await producer.connect();
    return producer;
  } catch (error) {
    console.warn('[kafka] producer connection skipped:', error.message);
    producer = null;
    return null;
  }
}

async function emitWebhookEvent(payload) {
  if (!producer) {
    return false;
  }

  await producer.send({
    topic: process.env.KAFKA_WEBHOOK_TOPIC || 'webhook.events',
    messages: [{ value: JSON.stringify(payload) }]
  });

  return true;
}

module.exports = { initKafkaProducer, emitWebhookEvent };
