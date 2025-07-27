
import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { ClientRateLimiter, RateLimitConfig } from '../core/ClientRateLimiter';

export function useRateLimit(limitId: string, config: RateLimitConfig) {
  const [isLimited, setIsLimited] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState(config.maxRequests);
  const [resetTime, setResetTime] = useState(0);
  const limiter = useRef(ClientRateLimiter.getInstance());

  // Initialize rate limit config
  useEffect(() => {
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
  useEffect(() => {
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
