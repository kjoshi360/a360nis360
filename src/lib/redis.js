const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 1
});

async function connectRedis() {
  try {
    await redis.connect();
    return true;
  } catch (error) {
    console.warn('[redis] connection skipped:', error.message);
    return false;
  }
}

module.exports = { redis, connectRedis };
