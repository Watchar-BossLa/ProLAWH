
import { useState, useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

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

// React hook for rate limiting
export function useRateLimit(limitId: string, config: RateLimitConfig) {
  const [isLimited, setIsLimited] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState(config.maxRequests);
  const [resetTime, setResetTime] = useState(0);
  const limiter = useRef(ClientRateLimiter.getInstance());

  // Initialize rate limit config
  React.useEffect(() => {
    limiter.current.addLimit(limitId, {
      ...config,
      onLimitExceeded: (key, attempts) => {
        setIsLimited(true);
        toast({
          title: "Rate Limit Exceeded",
          description: `Too many requests. Please wait before trying again.`,
          variant: "destructive"
        });
        config.onLimitExceeded?.(key, attempts);
      }
    });
  }, [limitId, config]);

  const checkLimit = useCallback(async (customKey?: string): Promise<boolean> => {
    const allowed = await limiter.current.checkLimit(limitId, customKey);
    setIsLimited(!allowed);
    setRemainingRequests(limiter.current.getRemainingRequests(limitId, customKey));
    setResetTime(limiter.current.getResetTime(limitId, customKey));
    return allowed;
  }, [limitId]);

  const recordRequest = useCallback((success: boolean, customKey?: string) => {
    limiter.current.recordRequest(limitId, success, customKey);
    setRemainingRequests(limiter.current.getRemainingRequests(limitId, customKey));
  }, [limitId]);

  // Update state periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const currentResetTime = limiter.current.getResetTime(limitId);
      
      if (now >= currentResetTime) {
        setIsLimited(false);
        setRemainingRequests(config.maxRequests);
        setResetTime(0);
      } else {
        setRemainingRequests(limiter.current.getRemainingRequests(limitId));
        setResetTime(currentResetTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [limitId, config.maxRequests]);

  return {
    isLimited,
    remainingRequests,
    resetTime,
    checkLimit,
    recordRequest
  };
}

// Pre-configured rate limits for common use cases
export const RATE_LIMITS = {
  LOGIN_ATTEMPTS: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    keyGenerator: () => 'login_attempts'
  },
  API_CALLS: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    keyGenerator: () => 'api_calls'
  },
  MESSAGE_SENDING: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,
    keyGenerator: () => 'message_sending'
  },
  FILE_UPLOAD: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
    keyGenerator: () => 'file_upload'
  }
} as const;
