/**
 * A/B Testing Framework for DSPy Module Optimization
 * Enables systematic testing and validation of optimization improvements
 */

import { supabase } from '@/integrations/supabase/client';
import { DSPyOptimizationResult, DSPyTrainingExample } from '../types';

interface ABTestConfig {
  name: string;
  description: string;
  variants: Array<{
    id: string;
    name: string;
    prompt: string;
    config?: Record<string, any>;
  }>;
  trafficSplit: Record<string, number>; // variant_id -> percentage (0-1)
  metrics: string[];
  duration: number; // days
  minSampleSize: number;
}

interface ABTestResult {
  testId: string;
  variant: string;
  metrics: Record<string, number>;
  timestamp: Date;
  userId?: string;
  requestId: string;
}

interface ABTestSummary {
  testId: string;
  status: 'running' | 'completed' | 'paused';
  startDate: Date;
  endDate?: Date;
  variants: Array<{
    id: string;
    name: string;
    sampleSize: number;
    metrics: Record<string, number>;
    confidenceInterval: Record<string, [number, number]>;
    statisticalSignificance: Record<string, boolean>;
  }>;
  winner?: string;
  recommendations: string[];
}

export class ABTestingFramework {
  private activeTests: Map<string, ABTestConfig> = new Map();
  private results: Map<string, ABTestResult[]> = new Map();

  async createTest(config: ABTestConfig): Promise<string> {
    const testId = this.generateTestId();
    
    // Validate configuration
    this.validateTestConfig(config);
    
    // Store test configuration
    this.activeTests.set(testId, config);
    this.results.set(testId, []);

    // Save to database
    await this.saveTestConfig(testId, config);
    
    console.log(`Created A/B test: ${testId} - ${config.name}`);
    return testId;
  }

  async runTestVariant(
    testId: string,
    inputs: Record<string, any>,
    userId?: string
  ): Promise<{ variant: string; result: any }> {
    const test = this.activeTests.get(testId);
    if (!test) {
      throw new Error(`Test ${testId} not found`);
    }

    // Select variant based on traffic split
    const variant = this.selectVariant(test, userId);
    const variantConfig = test.variants.find(v => v.id === variant);
    
    if (!variantConfig) {
      throw new Error(`Variant ${variant} not found`);
    }

    const requestId = this.generateRequestId();
    const startTime = Date.now();

    try {
      // Execute the variant (mock implementation)
      const result = await this.executeVariant(variantConfig, inputs);
      const endTime = Date.now();

      // Calculate metrics
      const metrics = this.calculateMetrics(result, endTime - startTime, test.metrics);

      // Record result
      const testResult: ABTestResult = {
        testId,
        variant,
        metrics,
        timestamp: new Date(),
        userId,
        requestId
      };

      this.recordResult(testResult);
      
      return { variant, result };
    } catch (error) {
      // Record failure metrics
      const metrics = { error_rate: 1, latency: Date.now() - startTime };
      this.recordResult({
        testId,
        variant,
        metrics,
        timestamp: new Date(),
        userId,
        requestId
      });
      
      throw error;
    }
  }

  async analyzeTest(testId: string): Promise<ABTestSummary> {
    const test = this.activeTests.get(testId);
    const results = this.results.get(testId) || [];

    if (!test) {
      throw new Error(`Test ${testId} not found`);
    }

    const now = new Date();
    const testDuration = test.duration * 24 * 60 * 60 * 1000; // Convert days to ms
    const isCompleted = results.length >= test.minSampleSize || 
                       (now.getTime() - results[0]?.timestamp.getTime() || 0) >= testDuration;

    // Group results by variant
    const variantResults = this.groupResultsByVariant(results);
    
    // Calculate statistics for each variant
    const variants = test.variants.map(variant => {
      const variantData = variantResults.get(variant.id) || [];
      const metrics = this.aggregateMetrics(variantData, test.metrics);
      const confidenceInterval = this.calculateConfidenceIntervals(variantData, test.metrics);
      const significance = this.calculateStatisticalSignificance(variantData, variantResults, test.metrics);

      return {
        id: variant.id,
        name: variant.name,
        sampleSize: variantData.length,
        metrics,
        confidenceInterval,
        statisticalSignificance: significance
      };
    });

    // Determine winner
    const winner = this.determineWinner(variants, test.metrics);
    const recommendations = this.generateRecommendations(variants, test.metrics);

    return {
      testId,
      status: isCompleted ? 'completed' : 'running',
      startDate: results[0]?.timestamp || now,
      endDate: isCompleted ? now : undefined,
      variants,
      winner,
      recommendations
    };
  }

  async stopTest(testId: string): Promise<ABTestSummary> {
    const summary = await this.analyzeTest(testId);
    
    // Archive the test
    await this.archiveTest(testId, summary);
    
    // Remove from active tests
    this.activeTests.delete(testId);
    
    return summary;
  }

  private validateTestConfig(config: ABTestConfig): void {
    if (config.variants.length < 2) {
      throw new Error('At least 2 variants required');
    }

    const totalTraffic = Object.values(config.trafficSplit).reduce((sum, pct) => sum + pct, 0);
    if (Math.abs(totalTraffic - 1.0) > 0.01) {
      throw new Error('Traffic split must sum to 1.0');
    }

    if (config.minSampleSize < 30) {
      throw new Error('Minimum sample size should be at least 30');
    }
  }

  private selectVariant(test: ABTestConfig, userId?: string): string {
    // Use consistent hashing for user-based assignment
    const seed = userId || Math.random().toString();
    const hash = this.simpleHash(seed + test.name);
    const random = (hash % 10000) / 10000;

    let cumulative = 0;
    for (const [variantId, percentage] of Object.entries(test.trafficSplit)) {
      cumulative += percentage;
      if (random <= cumulative) {
        return variantId;
      }
    }

    // Fallback to first variant
    return test.variants[0].id;
  }

  private async executeVariant(variant: any, inputs: Record<string, any>): Promise<any> {
    // Mock execution - integrate with actual DSPy modules
    const mockResult = {
      output: `Response from variant ${variant.id}`,
      confidence: 0.8 + Math.random() * 0.2,
      tokens: 100 + Math.floor(Math.random() * 200)
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 200));
    
    return mockResult;
  }

  private calculateMetrics(result: any, latency: number, metricNames: string[]): Record<string, number> {
    const metrics: Record<string, number> = {};
    
    for (const metric of metricNames) {
      switch (metric) {
        case 'latency':
          metrics.latency = latency;
          break;
        case 'confidence':
          metrics.confidence = result.confidence || 0;
          break;
        case 'token_count':
          metrics.token_count = result.tokens || 0;
          break;
        case 'success_rate':
          metrics.success_rate = result.output ? 1 : 0;
          break;
        case 'quality_score':
          metrics.quality_score = result.confidence * 0.8 + (result.output?.length > 50 ? 0.2 : 0);
          break;
        default:
          metrics[metric] = Math.random(); // Default random metric
      }
    }
    
    return metrics;
  }

  private recordResult(result: ABTestResult): void {
    const results = this.results.get(result.testId) || [];
    results.push(result);
    this.results.set(result.testId, results);
  }

  private groupResultsByVariant(results: ABTestResult[]): Map<string, ABTestResult[]> {
    const grouped = new Map<string, ABTestResult[]>();
    
    for (const result of results) {
      if (!grouped.has(result.variant)) {
        grouped.set(result.variant, []);
      }
      grouped.get(result.variant)!.push(result);
    }
    
    return grouped;
  }

  private aggregateMetrics(results: ABTestResult[], metricNames: string[]): Record<string, number> {
    const aggregated: Record<string, number> = {};
    
    for (const metric of metricNames) {
      const values = results.map(r => r.metrics[metric]).filter(v => v !== undefined);
      if (values.length > 0) {
        aggregated[metric] = values.reduce((sum, val) => sum + val, 0) / values.length;
      }
    }
    
    return aggregated;
  }

  private calculateConfidenceIntervals(
    results: ABTestResult[], 
    metricNames: string[]
  ): Record<string, [number, number]> {
    const intervals: Record<string, [number, number]> = {};
    
    for (const metric of metricNames) {
      const values = results.map(r => r.metrics[metric]).filter(v => v !== undefined);
      if (values.length >= 30) {
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);
        const stdError = Math.sqrt(variance / values.length);
        const margin = 1.96 * stdError; // 95% confidence interval
        
        intervals[metric] = [mean - margin, mean + margin];
      }
    }
    
    return intervals;
  }

  private calculateStatisticalSignificance(
    variantResults: ABTestResult[],
    allVariantResults: Map<string, ABTestResult[]>,
    metricNames: string[]
  ): Record<string, boolean> {
    const significance: Record<string, boolean> = {};
    
    // Simple t-test implementation (mock)
    for (const metric of metricNames) {
      significance[metric] = variantResults.length >= 100 && Math.random() > 0.05;
    }
    
    return significance;
  }

  private determineWinner(variants: any[], metricNames: string[]): string | undefined {
    // Simple winner determination based on primary metric
    const primaryMetric = metricNames[0];
    if (!primaryMetric) return undefined;

    let bestVariant = variants[0];
    let bestScore = bestVariant.metrics[primaryMetric] || 0;

    for (const variant of variants.slice(1)) {
      const score = variant.metrics[primaryMetric] || 0;
      if (score > bestScore && variant.statisticalSignificance[primaryMetric]) {
        bestScore = score;
        bestVariant = variant;
      }
    }

    return bestVariant.statisticalSignificance[primaryMetric] ? bestVariant.id : undefined;
  }

  private generateRecommendations(variants: any[], metricNames: string[]): string[] {
    const recommendations: string[] = [];
    
    const winner = this.determineWinner(variants, metricNames);
    if (winner) {
      recommendations.push(`Deploy variant ${winner} as the winner`);
    } else {
      recommendations.push('Continue testing - no statistically significant winner found');
    }
    
    // Add specific metric recommendations
    for (const metric of metricNames) {
      const variantScores = variants.map(v => ({ id: v.id, score: v.metrics[metric] || 0 }));
      variantScores.sort((a, b) => b.score - a.score);
      
      if (variantScores[0] && variantScores[1]) {
        const improvement = ((variantScores[0].score - variantScores[1].score) / variantScores[1].score * 100);
        if (improvement > 5) {
          recommendations.push(`${variantScores[0].id} shows ${improvement.toFixed(1)}% improvement in ${metric}`);
        }
      }
    }
    
    return recommendations;
  }

  private async saveTestConfig(testId: string, config: ABTestConfig): Promise<void> {
    // Save to application logs for now - would need dedicated tables in production
    console.log(`Saving A/B test config: ${testId}`, config);
  }

  private async archiveTest(testId: string, summary: ABTestSummary): Promise<void> {
    console.log(`Archiving A/B test: ${testId}`, summary);
  }

  private generateTestId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  // Public API methods
  getActiveTests(): string[] {
    return Array.from(this.activeTests.keys());
  }

  getTestConfig(testId: string): ABTestConfig | undefined {
    return this.activeTests.get(testId);
  }

  getTestResults(testId: string): ABTestResult[] {
    return this.results.get(testId) || [];
  }
}