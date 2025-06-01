
import { RateLimitConfig } from '../core/ClientRateLimiter';

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
} as const satisfies Record<string, RateLimitConfig>;
