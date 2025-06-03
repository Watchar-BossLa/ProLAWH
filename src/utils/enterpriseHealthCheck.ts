
import { supabase } from '@/integrations/supabase/client';
import { enterpriseLogger } from './enterpriseLogging';

export interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  error?: string;
  metadata?: Record<string, any>;
}

export interface SystemHealthReport {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: HealthCheckResult[];
  uptime: number;
  version: string;
}

class EnterpriseHealthMonitor {
  private static instance: EnterpriseHealthMonitor;
  private healthCheckInterval?: NodeJS.Timeout;
  private startTime: number = Date.now();
  private healthHistory: SystemHealthReport[] = [];
  private readonly maxHistorySize = 288; // 24 hours at 5-minute intervals

  static getInstance(): EnterpriseHealthMonitor {
    if (!EnterpriseHealthMonitor.instance) {
      EnterpriseHealthMonitor.instance = new EnterpriseHealthMonitor();
    }
    return EnterpriseHealthMonitor.instance;
  }

  async performHealthCheck(): Promise<SystemHealthReport> {
    const startTime = performance.now();
    
    try {
      const checks = await Promise.allSettled([
        this.checkDatabaseHealth(),
        this.checkAuthenticationHealth(),
        this.checkStorageHealth(),
        this.checkAPIHealth(),
        this.checkClientHealth(),
        this.checkPerformanceHealth()
      ]);

      const healthResults: HealthCheckResult[] = checks.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          const serviceNames = ['database', 'authentication', 'storage', 'api', 'client', 'performance'];
          return {
            service: serviceNames[index],
            status: 'unhealthy' as const,
            responseTime: performance.now() - startTime,
            error: result.reason?.message || 'Unknown error'
          };
        }
      });

      const overall = this.calculateOverallHealth(healthResults);
      const totalTime = performance.now() - startTime;

      const report: SystemHealthReport = {
        overall,
        timestamp: new Date().toISOString(),
        checks: healthResults,
        uptime: Date.now() - this.startTime,
        version: '1.0.0' // This would come from your build process
      };

      // Store in history
      this.healthHistory.push(report);
      if (this.healthHistory.length > this.maxHistorySize) {
        this.healthHistory.shift();
      }

      // Log health status
      enterpriseLogger.info('Health check completed', {
        overall,
        totalTime,
        unhealthyServices: healthResults.filter(r => r.status === 'unhealthy').map(r => r.service)
      }, 'HealthMonitor');

      // Alert on unhealthy status
      if (overall === 'unhealthy') {
        enterpriseLogger.error('System health degraded to unhealthy', undefined, {
          healthReport: report
        }, 'HealthMonitor');
      }

      return report;
    } catch (error) {
      const errorReport: SystemHealthReport = {
        overall: 'unhealthy',
        timestamp: new Date().toISOString(),
        checks: [{
          service: 'health-monitor',
          status: 'unhealthy',
          responseTime: performance.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        }],
        uptime: Date.now() - this.startTime,
        version: '1.0.0'
      };

      enterpriseLogger.critical('Health check system failure', error as Error, {}, 'HealthMonitor');
      return errorReport;
    }
  }

  private async checkDatabaseHealth(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    
    try {
      const { error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      const responseTime = performance.now() - startTime;
      
      if (error) {
        return {
          service: 'database',
          status: 'unhealthy',
          responseTime,
          error: error.message
        };
      }

      const status = responseTime > 2000 ? 'degraded' : 'healthy';
      
      return {
        service: 'database',
        status,
        responseTime,
        metadata: { recordCount: count }
      };
    } catch (error) {
      return {
        service: 'database',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown database error'
      };
    }
  }

  private async checkAuthenticationHealth(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    
    try {
      const { error } = await supabase.auth.getSession();
      const responseTime = performance.now() - startTime;
      
      if (error) {
        return {
          service: 'authentication',
          status: 'unhealthy',
          responseTime,
          error: error.message
        };
      }

      const status = responseTime > 1000 ? 'degraded' : 'healthy';
      
      return {
        service: 'authentication',
        status,
        responseTime
      };
    } catch (error) {
      return {
        service: 'authentication',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown auth error'
      };
    }
  }

  private async checkStorageHealth(): Promise<HealthCheckResult> {
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

  private async checkAPIHealth(): Promise<HealthCheckResult> {
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

  private async checkClientHealth(): Promise<HealthCheckResult> {
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

  private async checkPerformanceHealth(): Promise<HealthCheckResult> {
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

  private calculateOverallHealth(checks: HealthCheckResult[]): 'healthy' | 'degraded' | 'unhealthy' {
    const unhealthyCount = checks.filter(check => check.status === 'unhealthy').length;
    const degradedCount = checks.filter(check => check.status === 'degraded').length;
    
    if (unhealthyCount > 0) {
      return 'unhealthy';
    }
    
    if (degradedCount > 1) {
      return 'degraded';
    }
    
    return 'healthy';
  }

  private getStorageQuota(): string {
    try {
      const quota = (navigator as any).storage?.estimate?.();
      return quota ? 'Available' : 'Unknown';
    } catch {
      return 'Unknown';
    }
  }

  startMonitoring(intervalMs: number = 300000) { // 5 minutes default
    this.stopMonitoring();
    
    // Initial health check
    this.performHealthCheck();
    
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, intervalMs);
    
    enterpriseLogger.info('Health monitoring started', { intervalMs }, 'HealthMonitor');
  }

  stopMonitoring() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
      enterpriseLogger.info('Health monitoring stopped', {}, 'HealthMonitor');
    }
  }

  getHealthHistory(): SystemHealthReport[] {
    return [...this.healthHistory];
  }

  getLatestHealthReport(): SystemHealthReport | null {
    return this.healthHistory[this.healthHistory.length - 1] || null;
  }

  // Export health data for external monitoring systems
  exportHealthData(): {
    summary: {
      uptime: number;
      totalChecks: number;
      healthyPercentage: number;
    };
    recentReports: SystemHealthReport[];
    trends: {
      averageResponseTimes: Record<string, number>;
      uptimePercentage: number;
    };
  } {
    const totalChecks = this.healthHistory.length;
    const healthyChecks = this.healthHistory.filter(report => report.overall === 'healthy').length;
    
    const serviceResponseTimes: Record<string, number[]> = {};
    
    this.healthHistory.forEach(report => {
      report.checks.forEach(check => {
        if (!serviceResponseTimes[check.service]) {
          serviceResponseTimes[check.service] = [];
        }
        serviceResponseTimes[check.service].push(check.responseTime);
      });
    });

    const averageResponseTimes: Record<string, number> = {};
    Object.entries(serviceResponseTimes).forEach(([service, times]) => {
      averageResponseTimes[service] = times.reduce((sum, time) => sum + time, 0) / times.length;
    });

    return {
      summary: {
        uptime: Date.now() - this.startTime,
        totalChecks,
        healthyPercentage: totalChecks > 0 ? (healthyChecks / totalChecks) * 100 : 0
      },
      recentReports: this.healthHistory.slice(-10),
      trends: {
        averageResponseTimes,
        uptimePercentage: totalChecks > 0 ? (healthyChecks / totalChecks) * 100 : 0
      }
    };
  }
}

// Export singleton instance
export const enterpriseHealthMonitor = EnterpriseHealthMonitor.getInstance();
