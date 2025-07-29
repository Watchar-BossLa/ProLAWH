
import { RateLimitConfig } from './types';

class RateLimiting {
  private requestCounts = new Map<string, { count: number; resetTime: number }>();

  checkRateLimit(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const existing = this.requestCounts.get(key);

    if (!existing || now > existing.resetTime) {
      this.requestCounts.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return true;
    }

    if (existing.count >= config.maxRequests) {
      return false;
    }

    existing.count++;
    return true;
  }

  reset(key?: string): void {
    if (key) {
      this.requestCounts.delete(key);
    } else {
      this.requestCounts.clear();
    }
  }
}

export const rateLimiting = new RateLimiting();
