const express = require('express');
const { z } = require('zod');
const { redis } = require('../lib/redis');
const { emitWebhookEvent } = require('../lib/kafka');

const router = express.Router();

const webhookSchema = z.object({
  source: z.string().min(2),
  event: z.string().min(2),
  payload: z.record(z.any())
});

router.post('/ingest', async (req, res) => {
  const parsed = webhookSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const event = {
    ...parsed.data,
    receivedAt: new Date().toISOString()
  };

  await emitWebhookEvent(event);

  if (redis.status === 'ready') {
    await redis.lpush('webhook:events', JSON.stringify(event));
  }

  return res.status(202).json({ accepted: true });
});

module.exports = { webhookRouter: router };
