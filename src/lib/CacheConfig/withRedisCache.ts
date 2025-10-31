import { redis } from './redis';

/**
 * Hàm cache dữ liệu bằng Upstash Redis.
 * @param key - khóa cache (string)
 * @param fetcher - hàm async trả về dữ liệu (VD: gọi API hoặc DB)
 * @param ttlSeconds - thời gian sống của cache (mặc định 60 giây)
 */
async function revalidateCache<T>(key: string, fetcher: () => Promise<T>, ttlSeconds: number) {
  try {
    const freshData = await fetcher();
    await redis.set(key, freshData, { ex: ttlSeconds });
  } catch (error) {
    console.error('Revalidate cache error:', error);
  }
}

export async function withRedisCache<T>(key: string, fetcher: () => Promise<T>, ttlSeconds = 60): Promise<T> {
  const ENV = process.env.NODE_ENV || 'development';
  const key_with_env = key + ':' + ENV;
  const cached = await redis.get<T>(key_with_env);

  if (cached) {
    revalidateCache(key_with_env, fetcher, ttlSeconds);
    return cached;
  }

  const data = await fetcher();
  await redis.set(key_with_env, data, { ex: ttlSeconds });
  return data;
}
