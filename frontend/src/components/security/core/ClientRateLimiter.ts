
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: () => string;
  onLimitExceeded?: (key: string, attempts: number) => void;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  isBlocked: boolean;
}

export class ClientRateLimiter {
  private static instance: ClientRateLimiter;
  private limits: Map<string, RateLimitEntry> = new Map();
  private configs: Map<string, RateLimitConfig> = new Map();

  static getInstance(): ClientRateLimiter {
    if (!ClientRateLimiter.instance) {
      ClientRateLimiter.instance = new ClientRateLimiter();
    }
    return ClientRateLimiter.instance;
  }

  addLimit(limitId: string, config: RateLimitConfig) {
    this.configs.set(limitId, config);
  }

  async checkLimit(limitId: string, customKey?: string): Promise<boolean> {
    const config = this.configs.get(limitId);
    if (!config) {
      console.warn(`Rate limit config not found for: ${limitId}`);
      return true;
    }

    const key = customKey || (config.keyGenerator ? config.keyGenerator() : 'default');
    const fullKey = `${limitId}:${key}`;
    const now = Date.now();

    let entry = this.limits.get(fullKey);

    // Initialize or reset if window expired
    if (!entry || now >= entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + config.windowMs,
        isBlocked: false
      };
      this.limits.set(fullKey, entry);
    }

    // Check if blocked
    if (entry.isBlocked && now < entry.resetTime) {
      config.onLimitExceeded?.(key, entry.count);
      return false;
    }

    // Increment counter
    entry.count++;

    // Check if limit exceeded
    if (entry.count > config.maxRequests) {
      entry.isBlocked = true;
      config.onLimitExceeded?.(key, entry.count);
      return false;
    }

    return true;
  }

  recordRequest(limitId: string, success: boolean, customKey?: string) {
    const config = this.configs.get(limitId);
    if (!config) return;

    const shouldSkip = 
      (success && config.skipSuccessfulRequests) ||
      (!success && config.skipFailedRequests);

    if (shouldSkip) return;

    // Request was already recorded in checkLimit
  }

  getRemainingRequests(limitId: string, customKey?: string): number {
    const config = this.configs.get(limitId);
    if (!config) return 0;

    const key = customKey || (config.keyGenerator ? config.keyGenerator() : 'default');
    const fullKey = `${limitId}:${key}`;
    const entry = this.limits.get(fullKey);

    if (!entry || Date.now() >= entry.resetTime) {
      return config.maxRequests;
    }

    return Math.max(0, config.maxRequests - entry.count);
  }

  getResetTime(limitId: string, customKey?: string): number {
    const config = this.configs.get(limitId);
    if (!config) return 0;

    const key = customKey || (config.keyGenerator ? config.keyGenerator() : 'default');
    const fullKey = `${limitId}:${key}`;
    const entry = this.limits.get(fullKey);

    return entry?.resetTime || 0;
  }
}
