/**
 * Enterprise Logger
 * Structured logging with multiple transports and security compliance
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  component?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export interface LogTransport {
  name: string;
  enabled: boolean;
  log(entry: LogEntry): Promise<void>;
}

class EnterpriseLogger {
  private static instance: EnterpriseLogger;
  private transports: LogTransport[] = [];
  private minLevel: LogLevel = 'info';
  private buffer: LogEntry[] = [];
  private flushInterval: number = 5000; // 5 seconds
  private maxBufferSize: number = 100;

  static getInstance(): EnterpriseLogger {
    if (!EnterpriseLogger.instance) {
      EnterpriseLogger.instance = new EnterpriseLogger();
    }
    return EnterpriseLogger.instance;
  }

  private constructor() {
    this.setupTransports();
    this.startFlushTimer();
  }

  private setupTransports(): void {
    // Console transport (development)
    if (process.env.NODE_ENV === 'development') {
      this.addTransport({
        name: 'console',
        enabled: true,
        log: async (entry: LogEntry) => {
          const color = this.getLevelColor(entry.level);
          const timestamp = entry.timestamp.toISOString();
          const component = entry.component ? `[${entry.component}]` : '';
          const message = `${timestamp} ${color}${entry.level.toUpperCase()}${component}: ${entry.message}`;
          
          if (entry.level === 'error' || entry.level === 'critical') {
            console.error(message, entry.metadata || '');
            if (entry.error?.stack) {
              console.error(entry.error.stack);
            }
          } else if (entry.level === 'warn') {
            console.warn(message, entry.metadata || '');
          } else {
            console.log(message, entry.metadata || '');
          }
        }
      });
    }

    // Supabase transport (production)
    this.addTransport({
      name: 'supabase',
      enabled: process.env.NODE_ENV === 'production',
      log: async (entry: LogEntry) => {
        // This will be implemented with Supabase client
        // For now, we'll buffer entries and flush them periodically
        this.buffer.push(entry);
        
        if (this.buffer.length >= this.maxBufferSize) {
          await this.flushBuffer();
        }
      }
    });
  }

  private getLevelColor(level: LogLevel): string {
    const colors = {
      debug: '\x1b[36m',    // Cyan
      info: '\x1b[32m',     // Green
      warn: '\x1b[33m',     // Yellow
      error: '\x1b[31m',    // Red
      critical: '\x1b[41m'  // Red background
    };
    return colors[level] || '';
  }

  addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'critical'];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async log(level: LogLevel, message: string, metadata?: Record<string, any>, component?: string): Promise<void> {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      component,
      requestId: this.generateRequestId(),
      metadata: this.sanitizeMetadata(metadata)
    };

    // Add context if available
    if (typeof window !== 'undefined') {
      entry.sessionId = sessionStorage.getItem('session_id') || undefined;
      entry.userId = sessionStorage.getItem('user_id') || undefined;
    }

    await this.writeToTransports(entry);
  }

  async logError(error: Error, message?: string, metadata?: Record<string, any>, component?: string): Promise<void> {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: 'error',
      message: message || error.message,
      component,
      requestId: this.generateRequestId(),
      metadata: this.sanitizeMetadata(metadata),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    };

    if (typeof window !== 'undefined') {
      entry.sessionId = sessionStorage.getItem('session_id') || undefined;
      entry.userId = sessionStorage.getItem('user_id') || undefined;
    }

    await this.writeToTransports(entry);
  }

  private sanitizeMetadata(metadata?: Record<string, any>): Record<string, any> | undefined {
    if (!metadata) return undefined;

    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(metadata)) {
      // Remove sensitive information
      if (this.isSensitiveField(key)) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private isSensitiveField(key: string): boolean {
    const sensitiveFields = [
      'password', 'token', 'secret', 'key', 'auth', 'credential',
      'ssn', 'credit_card', 'cvv', 'pin', 'private_key'
    ];
    return sensitiveFields.some(field => key.toLowerCase().includes(field));
  }

  private sanitizeObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (this.isSensitiveField(key)) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeObject(value);
        }
      }
      return sanitized;
    }
    
    return obj;
  }

  private async writeToTransports(entry: LogEntry): Promise<void> {
    const promises = this.transports
      .filter(transport => transport.enabled)
      .map(transport => transport.log(entry).catch(err => {
        console.error(`Transport ${transport.name} failed:`, err);
      }));

    await Promise.all(promises);
  }

  private startFlushTimer(): void {
    setInterval(() => {
      this.flushBuffer().catch(err => {
        console.error('Failed to flush log buffer:', err);
      });
    }, this.flushInterval);
  }

  private async flushBuffer(): Promise<void> {
    if (this.buffer.length === 0) return;

    const entries = [...this.buffer];
    this.buffer = [];

    try {
      // Here we would send to Supabase
      // For now, we'll implement a simple storage mechanism
      if (typeof window !== 'undefined' && window.localStorage) {
        const existingLogs = JSON.parse(localStorage.getItem('app_logs') || '[]');
        const updatedLogs = [...existingLogs, ...entries].slice(-1000); // Keep last 1000 entries
        localStorage.setItem('app_logs', JSON.stringify(updatedLogs));
      }
    } catch (error) {
      console.error('Failed to flush log buffer:', error);
      // Re-add entries to buffer if flush failed
      this.buffer.unshift(...entries);
    }
  }

  // Convenience methods
  debug(message: string, metadata?: Record<string, any>, component?: string): Promise<void> {
    return this.log('debug', message, metadata, component);
  }

  info(message: string, metadata?: Record<string, any>, component?: string): Promise<void> {
    return this.log('info', message, metadata, component);
  }

  warn(message: string, metadata?: Record<string, any>, component?: string): Promise<void> {
    return this.log('warn', message, metadata, component);
  }

  error(message: string, metadata?: Record<string, any>, component?: string): Promise<void> {
    return this.log('error', message, metadata, component);
  }

  critical(message: string, metadata?: Record<string, any>, component?: string): Promise<void> {
    return this.log('critical', message, metadata, component);
  }
}

// Export singleton instance
export const logger = EnterpriseLogger.getInstance();

// Performance logging utility
export class PerformanceLogger {
  private startTimes: Map<string, number> = new Map();

  start(operation: string): void {
    this.startTimes.set(operation, performance.now());
  }

  end(operation: string, metadata?: Record<string, any>): void {
    const startTime = this.startTimes.get(operation);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.startTimes.delete(operation);
      
      logger.info(`Operation completed: ${operation}`, {
        ...metadata,
        duration: `${duration.toFixed(2)}ms`,
        performance: true
      }, 'Performance');
    }
  }

  measure<T>(operation: string, fn: () => T, metadata?: Record<string, any>): T {
    this.start(operation);
    try {
      const result = fn();
      this.end(operation, metadata);
      return result;
    } catch (error) {
      this.end(operation, { ...metadata, error: true });
      throw error;
    }
  }

  async measureAsync<T>(operation: string, fn: () => Promise<T>, metadata?: Record<string, any>): Promise<T> {
    this.start(operation);
    try {
      const result = await fn();
      this.end(operation, metadata);
      return result;
    } catch (error) {
      this.end(operation, { ...metadata, error: true });
      throw error;
    }
  }
}

export const performanceLogger = new PerformanceLogger();