/**
 * DSPy Edge Function for Real-time Inference
 * Optimized for low-latency edge deployment
 */

import { DSPyBaseModule } from '../modules/DSPyBaseModule';
import { DSPyLLMAdapter } from '../core/DSPyLLMAdapter';

interface EdgeRequest {
  module: 'reasoning' | 'career_advice' | 'swarm_intelligence';
  input: Record<string, any>;
  userId?: string;
  requestId?: string;
  priority?: 'low' | 'normal' | 'high';
}

interface EdgeResponse {
  success: boolean;
  data?: any;
  error?: string;
  latency: number;
  cached: boolean;
  requestId?: string;
}

interface CacheEntry {
  data: any;
  timestamp: number;
  hits: number;
}

/**
 * Edge-optimized DSPy service for real-time inference
 */
export class DSPyEdgeFunction {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL = 300000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 1000;
  private llmAdapter: DSPyLLMAdapter;
  private modules = new Map<string, DSPyBaseModule>();

  constructor(llmAdapter: DSPyLLMAdapter) {
    this.llmAdapter = llmAdapter;
    this.initializeModules();
  }

  /**
   * Main entry point for edge function requests
   */
  async handleRequest(request: EdgeRequest): Promise<EdgeResponse> {
    const startTime = Date.now();
    const requestId = request.requestId || `edge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(request);
      const cached = this.getFromCache(cacheKey);
      
      if (cached) {
        return {
          success: true,
          data: cached.data,
          latency: Date.now() - startTime,
          cached: true,
          requestId
        };
      }

      // Process request
      const result = await this.processRequest(request);
      
      // Cache successful results
      if (result) {
        this.setCache(cacheKey, result);
      }

      const latency = Date.now() - startTime;

      // Log performance metrics
      this.logMetrics(request.module, latency, true);

      return {
        success: true,
        data: result,
        latency,
        cached: false,
        requestId
      };

    } catch (error) {
      const latency = Date.now() - startTime;
      this.logMetrics(request.module, latency, false);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        latency,
        cached: false,
        requestId
      };
    }
  }

  /**
   * Batch processing for multiple requests
   */
  async handleBatchRequest(requests: EdgeRequest[]): Promise<EdgeResponse[]> {
    // Process high priority requests first
    const sortedRequests = requests.sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      return priorityOrder[a.priority || 'normal'] - priorityOrder[b.priority || 'normal'];
    });

    // Process in parallel with concurrency limit
    const batchSize = 5;
    const results: EdgeResponse[] = [];

    for (let i = 0; i < sortedRequests.length; i += batchSize) {
      const batch = sortedRequests.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(request => this.handleRequest(request))
      );
      results.push(...batchResults);
    }

    return results;
  }

  private async processRequest(request: EdgeRequest): Promise<any> {
    const module = this.modules.get(request.module);
    if (!module) {
      throw new Error(`Module ${request.module} not found`);
    }

    switch (request.module) {
      case 'reasoning':
        return this.processReasoningRequest(request.input);
      case 'career_advice':
        return this.processCareerAdviceRequest(request.input);
      case 'swarm_intelligence':
        return this.processSwarmIntelligenceRequest(request.input);
      default:
        throw new Error(`Unsupported module: ${request.module}`);
    }
  }

  private async processReasoningRequest(input: any): Promise<any> {
    const module = this.modules.get('reasoning');
    if (!module) throw new Error('Reasoning module not initialized');

    return await module.forward({
      query: input.query || '',
      context: input.context || '',
      reasoning_type: input.reasoning_type || 'analytical'
    });
  }

  private async processCareerAdviceRequest(input: any): Promise<any> {
    const module = this.modules.get('career_advice');
    if (!module) throw new Error('Career advice module not initialized');

    return await module.forward({
      role: input.role || '',
      skills: input.skills || [],
      experience_level: input.experience_level || 'beginner',
      goals: input.goals || ''
    });
  }

  private async processSwarmIntelligenceRequest(input: any): Promise<any> {
    const module = this.modules.get('swarm_intelligence');
    if (!module) throw new Error('Swarm intelligence module not initialized');

    return await module.forward({
      task: input.task || '',
      agents: input.agents || [],
      coordination_strategy: input.coordination_strategy || 'democratic'
    });
  }

  private generateCacheKey(request: EdgeRequest): string {
    const inputHash = JSON.stringify(request.input);
    return `${request.module}_${this.hashString(inputHash)}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private getFromCache(key: string): CacheEntry | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }

    // Update hit count
    entry.hits++;
    return entry;
  }

  private setCache(key: string, data: any): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictLeastUsed();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 1
    });
  }

  private evictLeastUsed(): void {
    let leastUsedKey = '';
    let leastHits = Infinity;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits < leastHits || (entry.hits === leastHits && entry.timestamp < oldestTime)) {
        leastUsedKey = key;
        leastHits = entry.hits;
        oldestTime = entry.timestamp;
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }

  private async logMetrics(moduleName: string, latency: number, success: boolean): Promise<void> {
    try {
      // In a real edge function, this would send metrics to a monitoring service
      console.log(`Edge Function Metrics: ${moduleName} - ${latency}ms - ${success ? 'SUCCESS' : 'FAILED'}`);
    } catch (error) {
      // Fail silently for metrics logging
    }
  }

  private initializeModules(): void {
    // Initialize lightweight versions of DSPy modules for edge deployment
    // In production, these would be pre-compiled and optimized
    console.log('Initializing DSPy Edge Modules...');
    
    // Note: In a real implementation, you would load pre-trained, optimized models
    // For now, we'll use placeholder modules
  }

  /**
   * Health check endpoint for edge function
   */
  async healthCheck(): Promise<{ status: string; uptime: number; cacheSize: number }> {
    return {
      status: 'healthy',
      uptime: process.uptime?.() || 0,
      cacheSize: this.cache.size
    };
  }

  /**
   * Cache statistics for monitoring
   */
  getCacheStats(): { size: number; hitRate: number; totalRequests: number } {
    const entries = Array.from(this.cache.values());
    const totalRequests = entries.reduce((sum, entry) => sum + entry.hits, 0);
    const hits = entries.length;
    
    return {
      size: this.cache.size,
      hitRate: totalRequests > 0 ? hits / totalRequests : 0,
      totalRequests
    };
  }

  /**
   * Clear cache for memory management
   */
  clearCache(): void {
    this.cache.clear();
  }
}

/**
 * Edge Function Handler (for deployment)
 */
export async function dspyEdgeHandler(request: Request): Promise<Response> {
  try {
    const body = await request.json() as EdgeRequest | EdgeRequest[];
    // Create a mock LLM for edge function (replace with actual implementation)
    const mockLLM = { generate: async () => ({ content: 'Edge function response' }) };
    const llmAdapter = new DSPyLLMAdapter(mockLLM as any);
    const edgeFunction = new DSPyEdgeFunction(llmAdapter);

    let result;
    if (Array.isArray(body)) {
      result = await edgeFunction.handleBatchRequest(body);
    } else {
      result = await edgeFunction.handleRequest(body);
    }

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
}