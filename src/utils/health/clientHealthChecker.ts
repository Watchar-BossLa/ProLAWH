
import { HealthCheckResult } from './types';

export class ClientHealthChecker {
  static async checkClientHealth(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    
    try {
      // Check memory usage if available
      const memoryInfo = (performance as any).memory;
      let memoryStatus = 'healthy';
      let memoryMetadata = {};
      
      if (memoryInfo) {
        const memoryUsage = memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize;
        memoryMetadata = {
          usedMemory: memoryInfo.usedJSHeapSize,
          totalMemory: memoryInfo.totalJSHeapSize,
          memoryUsage: Math.round(memoryUsage * 100)
        };
        
        if (memoryUsage > 0.9) memoryStatus = 'unhealthy';
        else if (memoryUsage > 0.7) memoryStatus = 'degraded';
      }
      
      // Check local storage availability
      let storageAvailable = true;
      try {
        localStorage.setItem('health_test', 'test');
        localStorage.removeItem('health_test');
      } catch {
        storageAvailable = false;
      }
      
      const responseTime = performance.now() - startTime;
      const status = memoryStatus === 'unhealthy' || !storageAvailable ? 'unhealthy' :
                    memoryStatus === 'degraded' ? 'degraded' : 'healthy';
      
      return {
        service: 'client',
        status,
        responseTime,
        metadata: {
          ...memoryMetadata,
          storageAvailable,
          userAgent: navigator.userAgent,
          online: navigator.onLine
        }
      };
    } catch (error) {
      return {
        service: 'client',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown client error'
      };
    }
  }
}
