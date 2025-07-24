import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

export interface DSPyMetrics {
  module_name: string;
  total_calls: number;
  avg_latency_ms: number;
  avg_quality_score: number;
  success_rate: number;
  cache_hit_rate: number;
  optimization_runs: number;
  last_optimization: Date | null;
  performance_trend: 'improving' | 'stable' | 'declining';
}

export interface DSPyAlert {
  id: string;
  module_name: string;
  alert_type: 'performance_degradation' | 'high_latency' | 'low_quality' | 'optimization_needed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  created_at: Date;
  resolved: boolean;
}

export interface DSPyPerformanceSnapshot {
  timestamp: Date;
  module_name: string;
  metrics: {
    latency_ms: number;
    quality_score: number;
    success_rate: number;
    cache_hit_rate: number;
  };
}

/**
 * Production DSPy Monitoring and Analytics Service
 */
export class DSPyMonitoringService {
  private static instance: DSPyMonitoringService;
  private metricsCache = new Map<string, DSPyMetrics>();
  private alerts: DSPyAlert[] = [];
  private readonly CACHE_DURATION = 60000; // 1 minute
  private readonly PERFORMANCE_THRESHOLD = {
    latency_ms: 5000,
    quality_score: 0.7,
    success_rate: 0.95
  };

  static getInstance(): DSPyMonitoringService {
    if (!DSPyMonitoringService.instance) {
      DSPyMonitoringService.instance = new DSPyMonitoringService();
    }
    return DSPyMonitoringService.instance;
  }

  /**
   * Get real-time metrics for a specific module
   */
  async getModuleMetrics(moduleName: string): Promise<DSPyMetrics> {
    const cacheKey = `metrics_${moduleName}`;
    const cached = this.metricsCache.get(cacheKey);
    
    if (cached && Date.now() - cached.last_optimization!.getTime() < this.CACHE_DURATION) {
      return cached;
    }

    const metrics = await this.calculateModuleMetrics(moduleName);
    this.metricsCache.set(cacheKey, metrics);
    
    // Check for performance issues
    await this.checkPerformanceAlerts(metrics);
    
    return metrics;
  }

  /**
   * Get metrics for all modules
   */
  async getAllModulesMetrics(): Promise<DSPyMetrics[]> {
    const { data: modules } = await supabase
      .from('dspy_performance_metrics')
      .select('module_name')
      .neq('module_name', null);

    if (!modules) return [];

    const uniqueModules = [...new Set(modules.map(m => m.module_name))];
    
    return Promise.all(
      uniqueModules.map(moduleName => this.getModuleMetrics(moduleName))
    );
  }

  /**
   * Log a performance metric
   */
  async logMetric(
    moduleName: string,
    metricName: string,
    value: number,
    context?: Record<string, any>
  ): Promise<void> {
    try {
      await supabase.from('dspy_performance_metrics').insert({
        module_name: moduleName,
        metric_name: metricName,
        metric_value: value,
        context: context || {}
      });

      // Invalidate cache
      this.metricsCache.delete(`metrics_${moduleName}`);
    } catch (error) {
      console.error('Failed to log DSPy metric:', error);
    }
  }

  /**
   * Get active alerts
   */
  async getActiveAlerts(): Promise<DSPyAlert[]> {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Return cached alerts if recent
    if (this.alerts.length > 0) {
      const recentAlerts = this.alerts.filter(
        alert => alert.created_at > twentyFourHoursAgo && !alert.resolved
      );
      if (recentAlerts.length > 0) {
        return recentAlerts;
      }
    }

    // Generate new alerts based on current performance
    const allMetrics = await this.getAllModulesMetrics();
    const newAlerts: DSPyAlert[] = [];

    for (const metrics of allMetrics) {
      // Performance degradation alerts
      if (metrics.avg_latency_ms > this.PERFORMANCE_THRESHOLD.latency_ms) {
        newAlerts.push({
          id: `latency_${metrics.module_name}_${Date.now()}`,
          module_name: metrics.module_name,
          alert_type: 'high_latency',
          severity: metrics.avg_latency_ms > this.PERFORMANCE_THRESHOLD.latency_ms * 2 ? 'critical' : 'high',
          message: `High latency detected: ${metrics.avg_latency_ms.toFixed(0)}ms (threshold: ${this.PERFORMANCE_THRESHOLD.latency_ms}ms)`,
          created_at: now,
          resolved: false
        });
      }

      if (metrics.avg_quality_score < this.PERFORMANCE_THRESHOLD.quality_score) {
        newAlerts.push({
          id: `quality_${metrics.module_name}_${Date.now()}`,
          module_name: metrics.module_name,
          alert_type: 'low_quality',
          severity: metrics.avg_quality_score < 0.5 ? 'critical' : 'medium',
          message: `Low quality score: ${(metrics.avg_quality_score * 100).toFixed(1)}% (threshold: ${(this.PERFORMANCE_THRESHOLD.quality_score * 100).toFixed(0)}%)`,
          created_at: now,
          resolved: false
        });
      }

      if (metrics.success_rate < this.PERFORMANCE_THRESHOLD.success_rate) {
        newAlerts.push({
          id: `success_${metrics.module_name}_${Date.now()}`,
          module_name: metrics.module_name,
          alert_type: 'performance_degradation',
          severity: metrics.success_rate < 0.8 ? 'critical' : 'high',
          message: `Low success rate: ${(metrics.success_rate * 100).toFixed(1)}% (threshold: ${(this.PERFORMANCE_THRESHOLD.success_rate * 100).toFixed(0)}%)`,
          created_at: now,
          resolved: false
        });
      }

      // Optimization recommendations
      const daysSinceOptimization = metrics.last_optimization 
        ? (now.getTime() - metrics.last_optimization.getTime()) / (1000 * 60 * 60 * 24)
        : 999;

      if (daysSinceOptimization > 7 && metrics.performance_trend === 'declining') {
        newAlerts.push({
          id: `optimization_${metrics.module_name}_${Date.now()}`,
          module_name: metrics.module_name,
          alert_type: 'optimization_needed',
          severity: 'medium',
          message: `Module may benefit from optimization (${daysSinceOptimization.toFixed(0)} days since last optimization)`,
          created_at: now,
          resolved: false
        });
      }
    }

    this.alerts = [...this.alerts, ...newAlerts];
    return newAlerts;
  }

  /**
   * Get performance trend data for charts
   */
  async getPerformanceTrend(
    moduleName: string,
    hours: number = 24
  ): Promise<DSPyPerformanceSnapshot[]> {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - hours * 60 * 60 * 1000);

    const { data: metrics } = await supabase
      .from('dspy_performance_metrics')
      .select('*')
      .eq('module_name', moduleName)
      .gte('measurement_timestamp', startTime.toISOString())
      .lte('measurement_timestamp', endTime.toISOString())
      .order('measurement_timestamp', { ascending: true });

    if (!metrics) return [];

    // Group metrics by hour and calculate averages
    const hourlySnapshots = new Map<string, {
      timestamp: Date;
      latency_sum: number;
      latency_count: number;
      quality_sum: number;
      quality_count: number;
      success_count: number;
      total_count: number;
      cache_hits: number;
    }>();

    metrics.forEach(metric => {
      const hour = new Date(metric.measurement_timestamp).toISOString().slice(0, 13) + ':00:00';
      
      if (!hourlySnapshots.has(hour)) {
        hourlySnapshots.set(hour, {
          timestamp: new Date(hour),
          latency_sum: 0,
          latency_count: 0,
          quality_sum: 0,
          quality_count: 0,
          success_count: 0,
          total_count: 0,
          cache_hits: 0
        });
      }

      const snapshot = hourlySnapshots.get(hour)!;
      
      if (metric.metric_name === 'response_latency_ms') {
        snapshot.latency_sum += metric.metric_value;
        snapshot.latency_count++;
      } else if (metric.metric_name === 'quality_score') {
        snapshot.quality_sum += metric.metric_value;
        snapshot.quality_count++;
      } else if (metric.metric_name === 'success_rate') {
        snapshot.success_count += metric.metric_value;
        snapshot.total_count++;
      } else if (metric.metric_name === 'cache_hit') {
        snapshot.cache_hits += metric.metric_value;
      }
    });

    return Array.from(hourlySnapshots.values()).map(snapshot => ({
      timestamp: snapshot.timestamp,
      module_name: moduleName,
      metrics: {
        latency_ms: snapshot.latency_count > 0 ? snapshot.latency_sum / snapshot.latency_count : 0,
        quality_score: snapshot.quality_count > 0 ? snapshot.quality_sum / snapshot.quality_count : 0,
        success_rate: snapshot.total_count > 0 ? snapshot.success_count / snapshot.total_count : 0,
        cache_hit_rate: snapshot.cache_hits / Math.max(snapshot.total_count, 1)
      }
    }));
  }

  /**
   * Mark an alert as resolved
   */
  async resolveAlert(alertId: string): Promise<void> {
    const alertIndex = this.alerts.findIndex(alert => alert.id === alertId);
    if (alertIndex !== -1) {
      this.alerts[alertIndex].resolved = true;
    }
  }

  private async calculateModuleMetrics(moduleName: string): Promise<DSPyMetrics> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const { data: recentMetrics } = await supabase
      .from('dspy_performance_metrics')
      .select('*')
      .eq('module_name', moduleName)
      .gte('measurement_timestamp', twentyFourHoursAgo.toISOString());

    const { data: optimizationHistory } = await supabase
      .from('dspy_optimization_history')
      .select('created_at, performance_score')
      .eq('module_name', moduleName)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!recentMetrics) {
      return this.getDefaultMetrics(moduleName);
    }

    // Calculate aggregated metrics
    const latencyMetrics = recentMetrics.filter(m => m.metric_name === 'response_latency_ms');
    const qualityMetrics = recentMetrics.filter(m => m.metric_name === 'quality_score');
    const cacheMetrics = recentMetrics.filter(m => m.metric_name === 'cache_hit');

    const avgLatency = latencyMetrics.length > 0 
      ? latencyMetrics.reduce((sum, m) => sum + m.metric_value, 0) / latencyMetrics.length 
      : 0;

    const avgQuality = qualityMetrics.length > 0 
      ? qualityMetrics.reduce((sum, m) => sum + m.metric_value, 0) / qualityMetrics.length 
      : 0;

    const cacheHitRate = cacheMetrics.length > 0 
      ? cacheMetrics.reduce((sum, m) => sum + m.metric_value, 0) / cacheMetrics.length 
      : 0;

    // Calculate performance trend
    const performanceTrend = this.calculatePerformanceTrend(optimizationHistory || []);

    return {
      module_name: moduleName,
      total_calls: recentMetrics.length,
      avg_latency_ms: avgLatency,
      avg_quality_score: avgQuality,
      success_rate: Math.max(0.8, 1 - (latencyMetrics.filter(m => m.metric_value > 10000).length / Math.max(latencyMetrics.length, 1))),
      cache_hit_rate: cacheHitRate,
      optimization_runs: optimizationHistory?.length || 0,
      last_optimization: optimizationHistory?.length > 0 ? new Date(optimizationHistory[0].created_at) : null,
      performance_trend: performanceTrend
    };
  }

  private calculatePerformanceTrend(optimizationHistory: any[]): 'improving' | 'stable' | 'declining' {
    if (optimizationHistory.length < 2) return 'stable';

    const recentScores = optimizationHistory.slice(0, 3).map(h => h.performance_score);
    const olderScores = optimizationHistory.slice(3, 6).map(h => h.performance_score);

    if (recentScores.length === 0 || olderScores.length === 0) return 'stable';

    const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length;

    const difference = recentAvg - olderAvg;

    if (difference > 0.05) return 'improving';
    if (difference < -0.05) return 'declining';
    return 'stable';
  }

  private getDefaultMetrics(moduleName: string): DSPyMetrics {
    return {
      module_name: moduleName,
      total_calls: 0,
      avg_latency_ms: 0,
      avg_quality_score: 0,
      success_rate: 0,
      cache_hit_rate: 0,
      optimization_runs: 0,
      last_optimization: null,
      performance_trend: 'stable'
    };
  }

  private async checkPerformanceAlerts(metrics: DSPyMetrics): Promise<void> {
    // This method can be expanded to automatically trigger optimizations
    // or send notifications when performance degrades
    if (metrics.performance_trend === 'declining' && metrics.avg_quality_score < 0.6) {
      console.warn(`Performance alert for ${metrics.module_name}: Quality declining to ${(metrics.avg_quality_score * 100).toFixed(1)}%`);
    }
  }
}

/**
 * React Hook for DSPy Monitoring
 */
export function useDSPyMonitoring() {
  const [metrics, setMetrics] = useState<DSPyMetrics[]>([]);
  const [alerts, setAlerts] = useState<DSPyAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const monitoringService = DSPyMonitoringService.getInstance();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [allMetrics, activeAlerts] = await Promise.all([
          monitoringService.getAllModulesMetrics(),
          monitoringService.getActiveAlerts()
        ]);
        
        setMetrics(allMetrics);
        setAlerts(activeAlerts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load monitoring data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshMetrics = async () => {
    try {
      const allMetrics = await monitoringService.getAllModulesMetrics();
      setMetrics(allMetrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh metrics');
    }
  };

  const resolveAlert = async (alertId: string) => {
    await monitoringService.resolveAlert(alertId);
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const getModuleTrend = (moduleName: string, hours: number = 24) => {
    return monitoringService.getPerformanceTrend(moduleName, hours);
  };

  return {
    metrics,
    alerts: alerts.filter(alert => !alert.resolved),
    isLoading,
    error,
    refreshMetrics,
    resolveAlert,
    getModuleTrend
  };
}