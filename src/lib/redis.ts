import { Redis } from '@upstash/redis';

// Redis client for caching hot paths
export const redis = new Redis({
  url: 'https://prolawh-redis.upstash.io', // Will be configured via secrets
  token: process.env.UPSTASH_REDIS_TOKEN || '', // Will be configured via secrets
});

// Cache keys and TTLs
export const CACHE_KEYS = {
  CHAT_MESSAGES: (connectionId: string) => `chat:messages:${connectionId}`,
  USER_PROFILE: (userId: string) => `profile:${userId}`,
  USER_PRESENCE: (userId: string) => `presence:${userId}`,
  NETWORK_CONNECTIONS: (userId: string) => `connections:${userId}`,
  CHAT_TYPING: (connectionId: string) => `typing:${connectionId}`,
} as const;

export const CACHE_TTL = {
  CHAT_MESSAGES: 300, // 5 minutes for recent messages
  USER_PROFILE: 1800, // 30 minutes for profile data
  USER_PRESENCE: 60, // 1 minute for presence
  NETWORK_CONNECTIONS: 600, // 10 minutes for connections
  CHAT_TYPING: 10, // 10 seconds for typing indicators
} as const;

// Cache utilities
export const cacheUtils = {
  // Get with fallback to Supabase
  async getWithFallback<T>(
    key: string,
    fallbackFn: () => Promise<T>,
    ttl: number
  ): Promise<T> {
    try {
      const cached = await redis.get<T>(key);
      if (cached) return cached;

      const fresh = await fallbackFn();
      await redis.setex(key, ttl, fresh);
      return fresh;
    } catch (error) {
      console.warn('Redis cache error, falling back:', error);
      return fallbackFn();
    }
  },

  // Set with error handling
  async set(key: string, value: any, ttl: number): Promise<void> {
    try {
      await redis.setex(key, ttl, value);
    } catch (error) {
      console.warn('Redis set error:', error);
    }
  },

  // Delete with error handling
  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.warn('Redis delete error:', error);
    }
  },

  // Pattern-based deletion for cache invalidation
  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.warn('Redis pattern delete error:', error);
    }
  }
};