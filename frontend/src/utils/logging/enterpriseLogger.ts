
import { LogEntry, MetricEntry } from './types';
import { LogBuffer } from './logBuffer';

class EnterpriseLogger {
  private static instance: EnterpriseLogger;
  private logBuffer: LogBuffer;

  static getInstance(): EnterpriseLogger {
    if (!EnterpriseLogger.instance) {
      EnterpriseLogger.instance = new EnterpriseLogger();
    }
    return EnterpriseLogger.instance;
  }

  constructor() {
    this.logBuffer = new LogBuffer();
  }

  async log(entry: Omit<LogEntry, 'timestamp'>) {
    const logEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId(),
      userAgent: navigator.userAgent,
      ipAddress: 'client-side'
    };

    this.logBuffer.addLog(logEntry);

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

    this.logBuffer.addMetric(metricEntry);
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
    this.logBuffer.destroy();
  }
}

// Export singleton instance
export const enterpriseLogger = EnterpriseLogger.getInstance();
