require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { prisma } = require('./lib/prisma');
const { connectRedis, redis } = require('./lib/redis');
const { initKafkaProducer } = require('./lib/kafka');
const { entityRouter } = require('./modules/entities');
const { webhookRouter } = require('./modules/webhooks');

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', async (_req, res) => {
  const db = await prisma.$queryRaw`SELECT 1 as ok`.then(() => 'up').catch(() => 'down');
  const redisState = redis.status;

  return res.json({
    service: 'a360nis360-backend',
    db,
    redis: redisState,
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1/entities', entityRouter);
app.use('/api/v1/webhooks', webhookRouter);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

async function bootstrap() {
  await Promise.allSettled([connectRedis(), initKafkaProducer()]);

  app.listen(port, () => {
    console.log(`API listening on :${port}`);
  });
}

bootstrap();
