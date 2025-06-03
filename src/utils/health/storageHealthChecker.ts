
import { HealthCheckResult } from './types';

export class StorageHealthChecker {
  static async checkStorageHealth(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    
    try {
      // Check if localStorage is accessible
      const testKey = 'prolawh_health_test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      
      const responseTime = performance.now() - startTime;
      
      return {
        service: 'storage',
        status: 'healthy',
        responseTime,
        metadata: {
          localStorageAvailable: true,
          storageQuota: this.getStorageQuota()
        }
      };
    } catch (error) {
      return {
        service: 'storage',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Storage unavailable'
      };
    }
  }

  private static getStorageQuota(): string {
    try {
      const quota = (navigator as any).storage?.estimate?.();
      return quota ? 'Available' : 'Unknown';
    } catch {
      return 'Unknown';
    }
  }
}
