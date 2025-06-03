
import { HealthCheckResult } from './types';

export class PerformanceHealthChecker {
  static async checkPerformanceHealth(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    
    try {
      const performanceEntries = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      const metrics = {
        domContentLoaded: performanceEntries?.domContentLoadedEventEnd - performanceEntries?.domContentLoadedEventStart,
        loadComplete: performanceEntries?.loadEventEnd - performanceEntries?.loadEventStart,
        firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime,
        firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime
      };

      const responseTime = performance.now() - startTime;
      
      // Performance thresholds
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      
      if (metrics.firstContentfulPaint && metrics.firstContentfulPaint > 3000) {
        status = 'degraded';
      }
      
      if (metrics.loadComplete > 5000) {
        status = 'degraded';
      }

      return {
        service: 'performance',
        status,
        responseTime,
        metadata: metrics
      };
    } catch (error) {
      return {
        service: 'performance',
        status: 'degraded',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Performance metrics unavailable'
      };
    }
  }
}
