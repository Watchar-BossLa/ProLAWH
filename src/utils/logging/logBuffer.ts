
import { LogEntry, MetricEntry } from './types';
import { logStorage } from './logStorage';
import { logTransport } from './logTransport';

export class LogBuffer {
  private logBuffer: LogEntry[] = [];
  private metricsBuffer: MetricEntry[] = [];
  private flushInterval: ReturnType<typeof setInterval> | null = null;
  private readonly maxBufferSize = 100;
  private readonly flushIntervalMs = 30000; // 30 seconds

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

  addLog(entry: LogEntry): void {
    this.logBuffer.push(entry);

    // Immediate flush for critical errors
    if (entry.level === 'critical' || entry.level === 'error') {
      this.flushLogs();
    }

    // Flush if buffer is full
    if (this.logBuffer.length >= this.maxBufferSize) {
      this.flushLogs();
    }
  }

  addMetric(entry: MetricEntry): void {
    this.metricsBuffer.push(entry);

    if (this.metricsBuffer.length >= this.maxBufferSize) {
      this.flushMetrics();
    }
  }

  private async flushLogs() {
    if (this.logBuffer.length === 0) return;

    try {
      const logs = [...this.logBuffer];
      this.logBuffer = [];

      logStorage.storeLogs(logs);
      await logTransport.sendLogs(logs);
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

      logStorage.storeMetrics(metrics);
      await logTransport.sendMetrics(metrics);
    } catch (error) {
      console.error('Failed to flush metrics:', error);
      this.metricsBuffer.unshift(...this.metricsBuffer);
    }
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushLogs();
    this.flushMetrics();
  }
}
