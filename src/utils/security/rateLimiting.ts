/**
 * Enhanced Rate Limiting Service for Security
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
}

export class RateLimitingService {
  private storage = new Map<string, RateLimitEntry>();
  private logSecurityEvent: (event: any) => void;

  constructor(logger: (event: any) => void) {
    this.logSecurityEvent = logger;
    this.setupCleanup();
  }

  // Check if request should be rate limited
  checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const resetTime = now + windowMs;
    
    const entry = this.storage.get(key);
    
    if (!entry || now > entry.resetTime) {
      // New window or expired entry
      this.storage.set(key, {
        count: 1,
        resetTime,
        blocked: false
      });
      return true;
    }
    
    if (entry.count >= maxRequests) {
      if (!entry.blocked) {
        // First time blocking - log security event
        this.logSecurityEvent({
          type: 'rate_limit',
          severity: 'medium',
          description: `Rate limit exceeded for key: ${key}`,
          context: this.createSecurityContext(),
          metadata: {
            key,
            attempts: entry.count,
            maxRequests,
            windowMs
          }
        });
        entry.blocked = true;
      }
      
      entry.count++;
      return false;
    }
    
    entry.count++;
    return true;
  }

  // Get current rate limit status
  getRateLimitStatus(key: string): { count: number; remaining: number; resetTime: number } | null {
    const entry = this.storage.get(key);
    if (!entry) return null;
    
    return {
      count: entry.count,
      remaining: Math.max(0, 100 - entry.count), // Assuming max 100
      resetTime: entry.resetTime
    };
  }

  // Setup periodic cleanup
  private setupCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.storage.entries()) {
        if (now > entry.resetTime) {
          this.storage.delete(key);
        }
      }
    }, 60000); // Clean every minute
  }

  // Clear all rate limits (admin function)
  clearAll(): void {
    this.storage.clear();
  }

  // Block specific key
  blockKey(key: string, durationMs: number = 3600000): void {
    this.storage.set(key, {
      count: 9999,
      resetTime: Date.now() + durationMs,
      blocked: true
    });
    
    this.logSecurityEvent({
      type: 'rate_limit',
      severity: 'high',
      description: `Key manually blocked: ${key}`,
      context: this.createSecurityContext(),
      metadata: { key, durationMs }
    });
  }

  private createSecurityContext() {
    return {
      timestamp: new Date().toISOString(),
      riskScore: 3,
      flags: []
    };
  }
}