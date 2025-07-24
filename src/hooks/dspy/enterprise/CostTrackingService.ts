/**
 * DSPy Cost Tracking and ROI Analysis Service
 */

import { supabase } from '@/integrations/supabase/client';

interface CostMetric {
  id: string;
  module_name: string;
  timestamp: Date;
  cost_type: 'llm_tokens' | 'compute_time' | 'optimization_run' | 'storage';
  cost_amount: number;
  currency: 'USD' | 'tokens' | 'compute_units';
  metadata: {
    token_count?: number;
    model_name?: string;
    optimization_duration?: number;
    user_id?: string;
    request_id?: string;
  };
}

interface ROIAnalysis {
  module_name: string;
  period: 'day' | 'week' | 'month';
  total_cost: number;
  total_requests: number;
  avg_cost_per_request: number;
  quality_improvement: number;
  latency_improvement: number;
  user_satisfaction_score: number;
  roi_score: number;
}

interface CostOptimization {
  recommendation: string;
  potential_savings: number;
  implementation_effort: 'low' | 'medium' | 'high';
  estimated_roi: number;
}

export class CostTrackingService {
  private static instance: CostTrackingService;
  private costMetrics: CostMetric[] = [];
  private readonly TOKEN_COSTS = {
    'gpt-4': { input: 0.03, output: 0.06 }, // per 1K tokens
    'gpt-3.5-turbo': { input: 0.001, output: 0.002 },
    'claude-3': { input: 0.015, output: 0.075 }
  };

  static getInstance(): CostTrackingService {
    if (!CostTrackingService.instance) {
      CostTrackingService.instance = new CostTrackingService();
    }
    return CostTrackingService.instance;
  }

  /**
   * Track LLM token usage costs
   */
  async trackTokenCost(
    moduleName: string,
    modelName: string,
    inputTokens: number,
    outputTokens: number,
    userId?: string,
    requestId?: string
  ): Promise<void> {
    const modelCosts = this.TOKEN_COSTS[modelName as keyof typeof this.TOKEN_COSTS];
    if (!modelCosts) {
      console.warn(`Unknown model for cost tracking: ${modelName}`);
      return;
    }

    const inputCost = (inputTokens / 1000) * modelCosts.input;
    const outputCost = (outputTokens / 1000) * modelCosts.output;
    const totalCost = inputCost + outputCost;

    const costMetric: CostMetric = {
      id: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      module_name: moduleName,
      timestamp: new Date(),
      cost_type: 'llm_tokens',
      cost_amount: totalCost,
      currency: 'USD',
      metadata: {
        token_count: inputTokens + outputTokens,
        model_name: modelName,
        user_id: userId,
        request_id: requestId
      }
    };

    await this.logCostMetric(costMetric);
  }

  /**
   * Track optimization run costs
   */
  async trackOptimizationCost(
    moduleName: string,
    optimizationDuration: number,
    tokenUsage: number,
    modelName: string
  ): Promise<void> {
    // Calculate compute cost (simplified model)
    const computeCostPerMinute = 0.10; // $0.10 per minute of optimization compute
    const computeCost = (optimizationDuration / 60000) * computeCostPerMinute;

    // Calculate token cost for optimization
    const modelCosts = this.TOKEN_COSTS[modelName as keyof typeof this.TOKEN_COSTS] || this.TOKEN_COSTS['gpt-3.5-turbo'];
    const tokenCost = (tokenUsage / 1000) * (modelCosts.input + modelCosts.output) / 2;

    const totalCost = computeCost + tokenCost;

    const costMetric: CostMetric = {
      id: `optimization_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      module_name: moduleName,
      timestamp: new Date(),
      cost_type: 'optimization_run',
      cost_amount: totalCost,
      currency: 'USD',
      metadata: {
        optimization_duration: optimizationDuration,
        token_count: tokenUsage,
        model_name: modelName
      }
    };

    await this.logCostMetric(costMetric);
  }

  /**
   * Get cost analysis for a module
   */
  async getModuleCostAnalysis(
    moduleName: string,
    period: 'day' | 'week' | 'month' = 'week'
  ): Promise<{
    totalCost: number;
    costByType: Record<string, number>;
    costTrend: Array<{ date: string; cost: number }>;
    topCostDrivers: Array<{ type: string; cost: number; percentage: number }>;
  }> {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'day':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setDate(endDate.getDate() - 30);
        break;
    }

    const { data: metrics } = await supabase
      .from('dspy_cost_metrics')
      .select('*')
      .eq('module_name', moduleName)
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString())
      .order('timestamp', { ascending: true });

    if (!metrics) {
      return {
        totalCost: 0,
        costByType: {},
        costTrend: [],
        topCostDrivers: []
      };
    }

    const totalCost = metrics.reduce((sum, metric) => sum + metric.cost_amount, 0);
    
    const costByType = metrics.reduce((acc, metric) => {
      acc[metric.cost_type] = (acc[metric.cost_type] || 0) + metric.cost_amount;
      return acc;
    }, {} as Record<string, number>);

    // Group by day for trend
    const costTrend = this.aggregateCostsByDay(metrics);

    // Calculate top cost drivers
    const topCostDrivers = Object.entries(costByType)
      .map(([type, cost]) => ({
        type,
        cost,
        percentage: (cost / totalCost) * 100
      }))
      .sort((a, b) => b.cost - a.cost);

    return {
      totalCost,
      costByType,
      costTrend,
      topCostDrivers
    };
  }

  /**
   * Calculate ROI for optimizations
   */
  async calculateOptimizationROI(
    moduleName: string,
    optimizationDate: Date
  ): Promise<ROIAnalysis> {
    const beforePeriod = new Date(optimizationDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const afterPeriod = new Date(optimizationDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Get costs before and after optimization
    const [beforeCosts, afterCosts] = await Promise.all([
      this.getCostsForPeriod(moduleName, beforePeriod, optimizationDate),
      this.getCostsForPeriod(moduleName, optimizationDate, afterPeriod)
    ]);

    // Get performance metrics before and after
    const [beforePerformance, afterPerformance] = await Promise.all([
      this.getPerformanceForPeriod(moduleName, beforePeriod, optimizationDate),
      this.getPerformanceForPeriod(moduleName, optimizationDate, afterPeriod)
    ]);

    const costSavings = beforeCosts.avgCostPerRequest - afterCosts.avgCostPerRequest;
    const qualityImprovement = afterPerformance.avgQuality - beforePerformance.avgQuality;
    const latencyImprovement = beforePerformance.avgLatency - afterPerformance.avgLatency;

    // Calculate ROI score (simplified model)
    const roiScore = this.calculateROIScore(
      costSavings,
      qualityImprovement,
      latencyImprovement,
      afterCosts.totalRequests
    );

    return {
      module_name: moduleName,
      period: 'week',
      total_cost: afterCosts.totalCost,
      total_requests: afterCosts.totalRequests,
      avg_cost_per_request: afterCosts.avgCostPerRequest,
      quality_improvement: qualityImprovement,
      latency_improvement: latencyImprovement,
      user_satisfaction_score: Math.min(0.95, 0.7 + qualityImprovement * 0.5), // Simplified model
      roi_score: roiScore
    };
  }

  /**
   * Get cost optimization recommendations
   */
  async getCostOptimizationRecommendations(moduleName: string): Promise<CostOptimization[]> {
    const analysis = await this.getModuleCostAnalysis(moduleName, 'month');
    const recommendations: CostOptimization[] = [];

    // Check for high token costs
    if (analysis.costByType.llm_tokens > analysis.totalCost * 0.7) {
      recommendations.push({
        recommendation: 'Consider using a more cost-effective model for routine queries',
        potential_savings: analysis.costByType.llm_tokens * 0.3,
        implementation_effort: 'medium',
        estimated_roi: 2.5
      });
    }

    // Check for frequent optimizations
    if (analysis.costByType.optimization_run > analysis.totalCost * 0.2) {
      recommendations.push({
        recommendation: 'Reduce optimization frequency by implementing better triggers',
        potential_savings: analysis.costByType.optimization_run * 0.4,
        implementation_effort: 'low',
        estimated_roi: 3.0
      });
    }

    // Check for caching opportunities
    recommendations.push({
      recommendation: 'Implement intelligent caching for repeated queries',
      potential_savings: analysis.totalCost * 0.15,
      implementation_effort: 'medium',
      estimated_roi: 4.0
    });

    return recommendations.sort((a, b) => b.estimated_roi - a.estimated_roi);
  }

  private async logCostMetric(metric: CostMetric): Promise<void> {
    try {
      await supabase.from('dspy_cost_metrics').insert({
        module_name: metric.module_name,
        timestamp: metric.timestamp.toISOString(),
        cost_type: metric.cost_type,
        cost_amount: metric.cost_amount,
        currency: metric.currency,
        metadata: metric.metadata
      });

      this.costMetrics.push(metric);
    } catch (error) {
      console.error('Failed to log cost metric:', error);
    }
  }

  private aggregateCostsByDay(metrics: any[]): Array<{ date: string; cost: number }> {
    const dailyCosts = new Map<string, number>();

    metrics.forEach(metric => {
      const date = new Date(metric.timestamp).toISOString().split('T')[0];
      dailyCosts.set(date, (dailyCosts.get(date) || 0) + metric.cost_amount);
    });

    return Array.from(dailyCosts.entries())
      .map(([date, cost]) => ({ date, cost }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private async getCostsForPeriod(
    moduleName: string,
    startDate: Date,
    endDate: Date
  ): Promise<{ totalCost: number; totalRequests: number; avgCostPerRequest: number }> {
    const { data: metrics } = await supabase
      .from('dspy_cost_metrics')
      .select('*')
      .eq('module_name', moduleName)
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString());

    if (!metrics || metrics.length === 0) {
      return { totalCost: 0, totalRequests: 0, avgCostPerRequest: 0 };
    }

    const totalCost = metrics.reduce((sum, metric) => sum + metric.cost_amount, 0);
    const totalRequests = metrics.length;
    const avgCostPerRequest = totalRequests > 0 ? totalCost / totalRequests : 0;

    return { totalCost, totalRequests, avgCostPerRequest };
  }

  private async getPerformanceForPeriod(
    moduleName: string,
    startDate: Date,
    endDate: Date
  ): Promise<{ avgQuality: number; avgLatency: number }> {
    const { data: metrics } = await supabase
      .from('dspy_performance_metrics')
      .select('*')
      .eq('module_name', moduleName)
      .gte('measurement_timestamp', startDate.toISOString())
      .lte('measurement_timestamp', endDate.toISOString());

    if (!metrics || metrics.length === 0) {
      return { avgQuality: 0, avgLatency: 0 };
    }

    const qualityMetrics = metrics.filter(m => m.metric_name === 'quality_score');
    const latencyMetrics = metrics.filter(m => m.metric_name === 'response_latency_ms');

    const avgQuality = qualityMetrics.length > 0
      ? qualityMetrics.reduce((sum, m) => sum + m.metric_value, 0) / qualityMetrics.length
      : 0;

    const avgLatency = latencyMetrics.length > 0
      ? latencyMetrics.reduce((sum, m) => sum + m.metric_value, 0) / latencyMetrics.length
      : 0;

    return { avgQuality, avgLatency };
  }

  private calculateROIScore(
    costSavings: number,
    qualityImprovement: number,
    latencyImprovement: number,
    requestVolume: number
  ): number {
    // Simplified ROI calculation
    const monthlySavings = costSavings * requestVolume * 30;
    const qualityValue = qualityImprovement * requestVolume * 0.05; // $0.05 per quality point
    const latencyValue = (latencyImprovement / 1000) * requestVolume * 0.01; // $0.01 per second saved

    const totalValue = monthlySavings + qualityValue + latencyValue;
    const optimizationCost = 50; // Estimated cost of optimization

    return totalValue / optimizationCost;
  }
}