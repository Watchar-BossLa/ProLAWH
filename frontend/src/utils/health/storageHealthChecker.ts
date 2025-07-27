
import { HealthCheckResult } from './types';

export class StorageHealthChecker {
  static async checkStorageHealth(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    
    try {
      // Test localStorage
      const testKey = 'storage_health_test';
      const testValue = Date.now().toString();
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      const responseTime = performance.now() - startTime;
      
      if (retrieved !== testValue) {
        return {
          service: 'storage',
          status: 'unhealthy',
          responseTime,
          error: 'localStorage read/write test failed'
        };
      }
      
      // Check storage quota if available
      let quotaInfo = {};
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
          const estimate = await navigator.storage.estimate();
          quotaInfo = {
            quota: estimate.quota,
            usage: estimate.usage,
            usagePercentage: estimate.quota ? Math.round((estimate.usage || 0) / estimate.quota * 100) : 0
          };
        } catch {
          // Quota estimation not available
        }
      }
      
      const status = responseTime > 100 ? 'degraded' : 'healthy';
      
      return {
        service: 'storage',
        status,
        responseTime,
        metadata: quotaInfo
      };
    } catch (error) {
      return {
        service: 'storage',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown storage error'
      };
    }
  }
}
