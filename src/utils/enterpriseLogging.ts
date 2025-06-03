import { supabase } from '@/integrations/supabase/client';

export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
  message: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
  stackTrace?: string;
  requestId?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface MetricEntry {
  name: string;
  value: number;
  unit: 'ms' | 'count' | 'bytes' | 'percentage';
  timestamp: string;
  tags?: Record<string, string>;
  userId?: string;
}

class EnterpriseLogger {
  private static instance: EnterpriseLogger;
  private logBuffer: LogEntry[] = [];
  private metricsBuffer: MetricEntry[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private readonly maxBufferSize = 100;
  private readonly flushIntervalMs = 30000; // 30 seconds

  static getInstance(): EnterpriseLogger {
    if (!EnterpriseLogger.instance) {
      EnterpriseLogger.instance = new EnterpriseLogger();
    }
    return EnterpriseLogger.instance;
  }

  constructor() {
    this.startAutoFlush();
    this.setupUnloadHandler();
  }

  private startAutoFlush() {
    this.flushInterval = setInterval(() => {
      this.flushLogs();
      this.flushMetrics();
    }, this.flushIntervalMs);
  }

  private setupUnloadHandler() {
    window.addEventListener('beforeunload', () => {
      this.flushLogs();
      this.flushMetrics();
    });
  }

  async log(entry: Omit<LogEntry, 'timestamp'>) {
    const logEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId(),
      userAgent: navigator.userAgent,
      ipAddress: 'client-side'
    };

    this.logBuffer.push(logEntry);

    // Immediate flush for critical errors
    if (entry.level === 'critical' || entry.level === 'error') {
      await this.flushLogs();
    }

    // Flush if buffer is full
    if (this.logBuffer.length >= this.maxBufferSize) {
      await this.flushLogs();
    }

    // Also log to console for development
    if (process.env.NODE_ENV === 'development') {
      const consoleMethod = entry.level === 'error' || entry.level === 'critical' ? 'error' : 
                           entry.level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`[${entry.level.toUpperCase()}] ${entry.message}`, entry.metadata);
    }
  }

  async metric(entry: Omit<MetricEntry, 'timestamp'>) {
    const metricEntry: MetricEntry = {
      ...entry,
      timestamp: new Date().toISOString()
    };

    this.metricsBuffer.push(metricEntry);

    if (this.metricsBuffer.length >= this.maxBufferSize) {
      await this.flushMetrics();
    }
  }

  private async flushLogs() {
    if (this.logBuffer.length === 0) return;

    try {
      const logs = [...this.logBuffer];
      this.logBuffer = [];

      // In a real enterprise setup, this would go to a proper logging service
      // For now, we'll use local storage and optionally send to Supabase
      this.storeLogsLocally(logs);
      
      // Try to send to backend if available
      await this.sendLogsToBackend(logs);
    } catch (error) {
      console.error('Failed to flush logs:', error);
      // Put logs back in buffer for retry
      this.logBuffer.unshift(...this.logBuffer);
    }
  }

  private async flushMetrics() {
    if (this.metricsBuffer.length === 0) return;

    try {
      const metrics = [...this.metricsBuffer];
      this.metricsBuffer = [];

      this.storeMetricsLocally(metrics);
      await this.sendMetricsToBackend(metrics);
    } catch (error) {
      console.error('Failed to flush metrics:', error);
      this.metricsBuffer.unshift(...this.metricsBuffer);
    }
  }

  private storeLogsLocally(logs: LogEntry[]) {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('prolawh_logs') || '[]');
      const allLogs = [...existingLogs, ...logs];
      
      // Keep only last 1000 logs
      if (allLogs.length > 1000) {
        allLogs.splice(0, allLogs.length - 1000);
      }
      
      localStorage.setItem('prolawh_logs', JSON.stringify(allLogs));
    } catch (error) {
      console.error('Failed to store logs locally:', error);
    }
  }

  private storeMetricsLocally(metrics: MetricEntry[]) {
    try {
      const existingMetrics = JSON.parse(localStorage.getItem('prolawh_metrics') || '[]');
      const allMetrics = [...existingMetrics, ...metrics];
      
      // Keep only last 500 metrics
      if (allMetrics.length > 500) {
        allMetrics.splice(0, allMetrics.length - 500);
      }
      
      localStorage.setItem('prolawh_metrics', JSON.stringify(allMetrics));
    } catch (error) {
      console.error('Failed to store metrics locally:', error);
    }
  }

  private async sendLogsToBackend(logs: LogEntry[]) {
    try {
      // In production, this would use a dedicated logging service
      // For now, we'll use a simple approach
      const { error } = await supabase
        .from('application_logs' as any)
        .insert(logs as any);

      if (error) {
        console.warn('Failed to send logs to backend:', error);
      }
    } catch (error) {
      console.warn('Backend logging not available:', error);
    }
  }

  private async sendMetricsToBackend(metrics: MetricEntry[]) {
    try {
      const { error } = await supabase
        .from('application_metrics' as any)
        .insert(metrics as any);

      if (error) {
        console.warn('Failed to send metrics to backend:', error);
      }
    } catch (error) {
      console.warn('Backend metrics not available:', error);
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Convenience methods
  debug(message: string, metadata?: Record<string, any>, component?: string) {
    return this.log({ level: 'debug', message, metadata, component });
  }

  info(message: string, metadata?: Record<string, any>, component?: string) {
    return this.log({ level: 'info', message, metadata, component });
  }

  warn(message: string, metadata?: Record<string, any>, component?: string) {
    return this.log({ level: 'warn', message, metadata, component });
  }

  error(message: string, error?: Error, metadata?: Record<string, any>, component?: string) {
    return this.log({ 
      level: 'error', 
      message, 
      metadata: { ...metadata, error: error?.message },
      stackTrace: error?.stack,
      component 
    });
  }

  critical(message: string, error?: Error, metadata?: Record<string, any>, component?: string) {
    return this.log({ 
      level: 'critical', 
      message, 
      metadata: { ...metadata, error: error?.message },
      stackTrace: error?.stack,
      component 
    });
  }

  // Performance tracking
  startTimer(name: string, userId?: string, tags?: Record<string, string>) {
    const startTime = performance.now();
    return {
      end: () => {
        const duration = performance.now() - startTime;
        this.metric({ name, value: duration, unit: 'ms', userId, tags });
        return duration;
      }
    };
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushLogs();
    this.flushMetrics();
  }
}

// Export singleton instance
export const enterpriseLogger = EnterpriseLogger.getInstance();

// Export performance tracking utilities
export class PerformanceTracker {
  static trackAPICall<T>(
    apiName: string, 
    apiCall: () => Promise<T>,
    userId?: string
  ): Promise<T> {
    const timer = enterpriseLogger.startTimer(`api_${apiName}`, userId, { type: 'api_call' });
    
    return apiCall()
      .then(result => {
        timer.end();
        enterpriseLogger.info(`API call ${apiName} completed successfully`, { apiName }, 'PerformanceTracker');
        return result;
      })
      .catch(error => {
        timer.end();
        enterpriseLogger.error(`API call ${apiName} failed`, error, { apiName }, 'PerformanceTracker');
        throw error;
      });
  }

  static trackPageLoad(pageName: string, userId?: string) {
    const timer = enterpriseLogger.startTimer(`page_load_${pageName}`, userId, { type: 'page_load' });
    
    return {
      end: () => {
        const duration = timer.end();
        enterpriseLogger.info(`Page ${pageName} loaded`, { pageName, loadTime: duration }, 'PerformanceTracker');
        return duration;
      }
    };
  }

  static trackUserAction(actionName: string, userId?: string, metadata?: Record<string, any>) {
    enterpriseLogger.metric({ 
      name: `user_action_${actionName}`, 
      value: 1, 
      unit: 'count', 
      userId, 
      tags: { type: 'user_action', action: actionName } 
    });
    
    enterpriseLogger.info(`User action: ${actionName}`, metadata, 'PerformanceTracker');
  }
}
