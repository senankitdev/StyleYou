/**
 * Simple in-memory rate limiter.
 * In a real production environment, use Redis/Upstash for cross-instance state.
 */
interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitInfo>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const info = store.get(key);

  if (!info || now > info.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (info.count >= limit) {
    return false;
  }

  info.count += 1;
  return true;
}
