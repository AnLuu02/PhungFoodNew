import { redis } from '../cache/redis';

export async function withRedisCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds = 60 // thời gian cache mặc định: 60s
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return cached as T;

  const data = await fetcher();
  await redis.set(key, data, { ex: ttlSeconds }); // TTL 60s
  return data;
}
