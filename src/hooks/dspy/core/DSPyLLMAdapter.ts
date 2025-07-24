import { useLLM } from '@/hooks/useLLM';
import { supabase } from '@/integrations/supabase/client';

export interface DSPyLLMRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stop_sequences?: string[];
  cache_key?: string;
}

export interface DSPyLLMResponse {
  text: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  metadata?: Record<string, any>;
  cached?: boolean;
  performance_metrics?: {
    latency_ms: number;
    quality_score?: number;
  };
}

export interface DSPyOptimizationResult {
  optimized_prompt: string;
  performance_score: number;
  prompt_variations: string[];
  optimization_metrics: Record<string, any>;
}

export interface CachedResponse {
  response: DSPyLLMResponse;
  timestamp: number;
  ttl: number;
}

/**
 * Enhanced DSPy LLM Adapter - Production-ready DSPy integration
 * Features: Caching, Performance Metrics, Error Recovery, Optimization
 */
export class DSPyLLMAdapter {
  private llm: ReturnType<typeof useLLM>;
  private cache: Map<string, CachedResponse> = new Map();
  private readonly CACHE_TTL = 300000; // 5 minutes
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  constructor(llm: ReturnType<typeof useLLM>) {
    this.llm = llm;
    this.startCacheCleanup();
  }

  private startCacheCleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, cached] of this.cache.entries()) {
        if (now - cached.timestamp > cached.ttl) {
          this.cache.delete(key);
        }
      }
    }, 60000); // Cleanup every minute
  }

  /**
   * Generate response with caching, retries, and performance tracking
   */
  async generate(request: DSPyLLMRequest): Promise<DSPyLLMResponse> {
    const startTime = Date.now();
    const cacheKey = this.getCacheKey(request);
    
    // Check cache first
    if (request.cache_key && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < cached.ttl) {
        return { ...cached.response, cached: true };
      }
      this.cache.delete(cacheKey);
    }

    let lastError: Error | null = null;
    
    // Retry logic
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const response = await this.llm.generate({
          task: 'text-generation',
          inputs: request.prompt,
          model: request.model || 'mistralai/Mixtral-8x7B-Instruct-v0.1'
        });

        const generatedText = response.generated_text || response.text || '';
        const latency = Date.now() - startTime;
        
        const result: DSPyLLMResponse = {
          text: generatedText,
          usage: {
            prompt_tokens: Math.ceil(request.prompt.length / 4),
            completion_tokens: Math.ceil(generatedText.length / 4),
            total_tokens: Math.ceil((request.prompt.length + generatedText.length) / 4)
          },
          metadata: {
            model: request.model,
            temperature: request.temperature,
            max_tokens: request.max_tokens,
            attempt: attempt
          },
          performance_metrics: {
            latency_ms: latency,
            quality_score: this.calculateQualityScore(generatedText, request.prompt)
          }
        };

        // Cache successful response
        if (request.cache_key) {
          this.cache.set(cacheKey, {
            response: result,
            timestamp: Date.now(),
            ttl: this.CACHE_TTL
          });
        }

        // Log performance metrics
        await this.logPerformanceMetrics(request, result);
        
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.warn(`DSPy LLM Adapter attempt ${attempt} failed:`, lastError.message);
        
        if (attempt < this.MAX_RETRIES) {
          await this.delay(this.RETRY_DELAY * attempt);
        }
      }
    }

    throw new Error(`LLM generation failed after ${this.MAX_RETRIES} attempts: ${lastError?.message}`);
  }

  private getCacheKey(request: DSPyLLMRequest): string {
    return `${request.cache_key || 'default'}_${this.hashString(request.prompt)}_${request.model || 'default'}`;
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

  private calculateQualityScore(response: string, prompt: string): number {
    // Simple quality heuristics
    const responseLength = response.length;
    const hasStructure = /\n|\.|\?|!/.test(response);
    const relevanceScore = this.calculateRelevance(response, prompt);
    
    let score = 0.5; // Base score
    
    if (responseLength > 50) score += 0.2;
    if (responseLength > 200) score += 0.1;
    if (hasStructure) score += 0.1;
    score += relevanceScore * 0.2;
    
    return Math.min(Math.max(score, 0), 1);
  }

  private calculateRelevance(response: string, prompt: string): number {
    const promptWords = new Set(prompt.toLowerCase().split(/\s+/));
    const responseWords = response.toLowerCase().split(/\s+/);
    const commonWords = responseWords.filter(word => promptWords.has(word));
    
    return commonWords.length / Math.max(responseWords.length, 1);
  }

  private async logPerformanceMetrics(request: DSPyLLMRequest, response: DSPyLLMResponse): Promise<void> {
    try {
      await supabase.from('dspy_performance_metrics').insert([
        {
          module_name: 'llm_adapter',
          metric_name: 'response_latency_ms',
          metric_value: response.performance_metrics?.latency_ms || 0,
          context: {
            model: request.model,
            prompt_length: request.prompt.length,
            response_length: response.text.length,
            quality_score: response.performance_metrics?.quality_score
          }
        }
      ]);
    } catch (error) {
      console.warn('Failed to log performance metrics:', error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Format prompt for DSPy signature execution
   */
  formatPrompt(signature: any, inputs: Record<string, any>): string {
    let prompt = `${signature.instruction}\n\n`;
    
    // Add input fields
    Object.entries(signature.input_fields).forEach(([field, description]) => {
      prompt += `${field}: ${inputs[field] || 'Not provided'}\n`;
    });

    // Add output format
    prompt += '\nProvide your response in the following format:\n';
    Object.entries(signature.output_fields).forEach(([field, description]) => {
      prompt += `${field}: [Your ${description} here]\n`;
    });

    return prompt;
  }

  /**
   * Parse LLM response according to DSPy signature output fields
   */
  parseResponse(response: string, outputFields: Record<string, string>): Record<string, any> {
    const parsed: Record<string, any> = {};
    
    Object.keys(outputFields).forEach(field => {
      const regex = new RegExp(`${field}:\\s*(.+?)(?=\\n\\w+:|$)`, 'i');
      const match = response.match(regex);
      parsed[field] = match ? match[1].trim() : '';
    });

    return parsed;
  }

  /**
   * Execute DSPy signature with inputs and optimization
   */
  async executeSignature(signature: any, inputs: Record<string, any>, options?: {
    cache_key?: string;
    optimization_enabled?: boolean;
  }): Promise<Record<string, any>> {
    const prompt = this.formatPrompt(signature, inputs);
    const response = await this.generate({ 
      prompt, 
      cache_key: options?.cache_key 
    });
    
    const parsed = this.parseResponse(response.text, signature.output_fields);
    
    // Add performance metadata
    parsed._metadata = {
      latency_ms: response.performance_metrics?.latency_ms,
      quality_score: response.performance_metrics?.quality_score,
      cached: response.cached,
      model: response.metadata?.model
    };
    
    return parsed;
  }

  /**
   * Optimize prompt using multiple variations and performance feedback
   */
  async optimizePrompt(
    signature: any, 
    trainingExamples: Array<{ inputs: Record<string, any>; expected_outputs: Record<string, any> }>,
    options?: {
      max_iterations?: number;
      target_score?: number;
    }
  ): Promise<DSPyOptimizationResult> {
    const maxIterations = options?.max_iterations || 5;
    const targetScore = options?.target_score || 0.8;
    
    let bestPrompt = signature.instruction;
    let bestScore = 0;
    const promptVariations: string[] = [];
    const optimizationMetrics: Record<string, any> = {};

    // Generate prompt variations
    const variations = await this.generatePromptVariations(signature.instruction);
    
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      for (const variation of variations) {
        const testSignature = { ...signature, instruction: variation };
        const scores: number[] = [];
        
        // Test on training examples
        for (const example of trainingExamples.slice(0, 5)) { // Limit for performance
          try {
            const result = await this.executeSignature(testSignature, example.inputs);
            const score = this.evaluateOutput(result, example.expected_outputs);
            scores.push(score);
          } catch (error) {
            scores.push(0);
          }
        }
        
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        promptVariations.push(variation);
        
        if (avgScore > bestScore) {
          bestScore = avgScore;
          bestPrompt = variation;
        }
        
        if (avgScore >= targetScore) {
          break;
        }
      }
      
      if (bestScore >= targetScore) {
        break;
      }
    }

    optimizationMetrics.iterations_run = Math.min(maxIterations, promptVariations.length);
    optimizationMetrics.best_score = bestScore;
    optimizationMetrics.total_variations_tested = promptVariations.length;

    return {
      optimized_prompt: bestPrompt,
      performance_score: bestScore,
      prompt_variations: promptVariations,
      optimization_metrics: optimizationMetrics
    };
  }

  private async generatePromptVariations(basePrompt: string): Promise<string[]> {
    const variationPrompts = [
      `Improve this instruction to be more specific and clear: "${basePrompt}"`,
      `Rewrite this instruction to be more concise: "${basePrompt}"`,
      `Make this instruction more detailed with examples: "${basePrompt}"`,
      `Rephrase this instruction for better performance: "${basePrompt}"`
    ];

    const variations: string[] = [basePrompt]; // Include original
    
    for (const prompt of variationPrompts) {
      try {
        const response = await this.generate({ prompt, cache_key: `variation_${this.hashString(prompt)}` });
        if (response.text && response.text.length > 10) {
          variations.push(response.text.trim());
        }
      } catch (error) {
        console.warn('Failed to generate prompt variation:', error);
      }
    }
    
    return variations;
  }

  private evaluateOutput(actual: Record<string, any>, expected: Record<string, any>): number {
    let score = 0;
    let totalFields = 0;
    
    for (const [key, expectedValue] of Object.entries(expected)) {
      if (key.startsWith('_')) continue; // Skip metadata
      
      totalFields++;
      const actualValue = actual[key];
      
      if (typeof expectedValue === 'string' && typeof actualValue === 'string') {
        // Text similarity
        const similarity = this.calculateTextSimilarity(actualValue, expectedValue);
        score += similarity;
      } else if (expectedValue === actualValue) {
        score += 1;
      } else if (typeof expectedValue === 'number' && typeof actualValue === 'number') {
        // Numeric proximity
        const diff = Math.abs(expectedValue - actualValue);
        const maxVal = Math.max(Math.abs(expectedValue), Math.abs(actualValue), 1);
        score += Math.max(0, 1 - (diff / maxVal));
      }
    }
    
    return totalFields > 0 ? score / totalFields : 0;
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }
}