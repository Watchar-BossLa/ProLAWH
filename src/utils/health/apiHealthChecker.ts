
import { HealthCheckResult } from './types';

export class ApiHealthChecker {
  static async checkAPIHealth(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    
    try {
      // Test API connectivity with a simple request
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }).catch(() => null);
      
      const responseTime = performance.now() - startTime;
      
      if (!response || !response.ok) {
        return {
          service: 'api',
          status: 'degraded', // Not critical if API health endpoint doesn't exist
          responseTime,
          error: 'API health endpoint not available'
        };
      }

      const status = responseTime > 1500 ? 'degraded' : 'healthy';
      
      return {
        service: 'api',
        status,
        responseTime
      };
    } catch (error) {
      return {
        service: 'api',
        status: 'degraded',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'API connectivity issue'
      };
    }
  }
}
