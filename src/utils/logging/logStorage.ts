import { LogEntry, MetricEntry } from './types';

export class LogStorage {
  storeLogs(logs: LogEntry[]): void {
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

  storeMetrics(metrics: MetricEntry[]): void {
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

  getLogs(): LogEntry[] {
    try {
      return JSON.parse(localStorage.getItem('prolawh_logs') || '[]');
    } catch {
      return [];
    }
  }

  getMetrics(): MetricEntry[] {
    try {
      return JSON.parse(localStorage.getItem('prolawh_metrics') || '[]');
    } catch {
      return [];
    }
  }

  clearLogs(): void {
    localStorage.removeItem('prolawh_logs');
  }

  clearMetrics(): void {
    localStorage.removeItem('prolawh_metrics');
  }
}

export const logStorage = new LogStorage();
