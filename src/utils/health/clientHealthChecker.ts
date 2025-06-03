
import { HealthCheckResult } from './types';

export class ClientHealthChecker {
  static async checkClientHealth(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    
    try {
      const memoryInfo = (performance as any).memory;
      const connection = (navigator as any).connection;
      
      const metrics = {
        memoryUsage: memoryInfo ? {
          used: memoryInfo.usedJSHeapSize,
          total: memoryInfo.totalJSHeapSize,
          limit: memoryInfo.jsHeapSizeLimit
        } : null,
        connectionType: connection?.effectiveType || 'unknown',
        online: navigator.onLine,
        cookiesEnabled: navigator.cookieEnabled,
        userAgent: navigator.userAgent
      };

      const responseTime = performance.now() - startTime;
      
      // Check for potential issues
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      const issues: string[] = [];

      if (!navigator.onLine) {
        status = 'unhealthy';
        issues.push('Client is offline');
      }

      if (memoryInfo && memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.8) {
        status = 'degraded';
        issues.push('High memory usage detected');
      }

      return {
        service: 'client',
        status,
        responseTime,
        metadata: metrics,
        error: issues.length > 0 ? issues.join(', ') : undefined
      };
    } catch (error) {
      return {
        service: 'client',
        status: 'degraded',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Client health check failed'
      };
    }
  }
}
