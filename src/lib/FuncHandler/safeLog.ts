import { redis } from '../CacheConfig/redis';

export function safeLog(data: Record<string, string>) {
  Promise.race([
    redis.xadd('access_logs', '*', data),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 300))
  ]).catch(() => {});
}
