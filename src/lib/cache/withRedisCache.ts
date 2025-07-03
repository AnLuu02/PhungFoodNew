import { redis } from './redis';

export async function withRedisCache<T>(key: string, fetcher: () => Promise<T>, ttlSeconds = 60): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return cached as T;

  const data = await fetcher();
  await redis.set(key, data, { ex: ttlSeconds });
  return data;
}
