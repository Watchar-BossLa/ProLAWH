
// Simple token bucket rate limiter implementation
// In a production system, this would use Redis for distributed rate limiting

interface TokenBucket {
  tokens: number;
  lastRefill: number;
  refillRate: number; // tokens per ms
  capacity: number;
}

const buckets: Record<string, TokenBucket> = {};

// Initialize a bucket if it doesn't exist
function initBucket(name: string): TokenBucket {
  if (!buckets[name]) {
    buckets[name] = {
      tokens: 90, // Start with full capacity
      lastRefill: Date.now(),
      refillRate: 90 / 60000, // 90 tokens per minute
      capacity: 90
    };
  }
  return buckets[name];
}

// Refill tokens based on elapsed time
function refillBucket(bucket: TokenBucket): void {
  const now = Date.now();
  const elapsedMs = now - bucket.lastRefill;
  const newTokens = elapsedMs * bucket.refillRate;
  
  if (newTokens > 0) {
    bucket.tokens = Math.min(bucket.capacity, bucket.tokens + newTokens);
    bucket.lastRefill = now;
  }
}

// Throttle function that can be called before operations
export async function throttle(name: string, cost: number = 1): Promise<void> {
  const bucket = initBucket(name);
  refillBucket(bucket);
  
  if (bucket.tokens < cost) {
    // Not enough tokens, need to wait
    const msToWait = (cost - bucket.tokens) / bucket.refillRate;
    console.log(`Rate limit hit for ${name}, waiting ${msToWait.toFixed(0)}ms`);
    
    // Wait for required time
    await new Promise(resolve => setTimeout(resolve, msToWait));
    
    // Refill bucket again after waiting
    refillBucket(bucket);
  }
  
  // Consume tokens
  bucket.tokens -= cost;
  console.log(`${name} has ${bucket.tokens.toFixed(1)} tokens remaining`);
}
