import { Redis } from 'ioredis';

const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
export const redisClient = new Redis({
  host: 'driving-mollusk-15102.upstash.io',
  port: 6379,
  password: REDIS_PASSWORD,
  tls: {},
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    console.warn(`Retrying Redis connection (${times} attempt)...`);
    return delay;
  },
  enableAutoPipelining: true,
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected!');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

redisClient.on('close', () => {
  console.log('🔌 Redis connection closed.');
});

redisClient.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...');
});

export const setKeyWithTTL = async (key: string, value: string | number | Buffer<ArrayBufferLike>) => {
  try {
    await redisClient.set(key, value);
    await redisClient.expire(key, 259200);

  } catch (err) {
    console.log(err);
  }
};