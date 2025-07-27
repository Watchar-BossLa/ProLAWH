
import { enterpriseLogger } from '../logging';
import { SystemHealthReport, HealthCheckResult, HealthExportData } from './types';
import { DatabaseHealthChecker } from './databaseHealthChecker';
import { AuthHealthChecker } from './authHealthChecker';
import { StorageHealthChecker } from './storageHealthChecker';
import { ApiHealthChecker } from './apiHealthChecker';
import { ClientHealthChecker } from './clientHealthChecker';
import { PerformanceHealthChecker } from './performanceHealthChecker';
import { HealthUtils } from './healthUtils';

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
        DatabaseHealthChecker.checkDatabaseHealth(),
        AuthHealthChecker.checkAuthenticationHealth(),
        StorageHealthChecker.checkStorageHealth(),
        ApiHealthChecker.checkAPIHealth(),
        ClientHealthChecker.checkClientHealth(),
        PerformanceHealthChecker.checkPerformanceHealth()
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

      const overall = HealthUtils.calculateOverallHealth(healthResults);
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

  exportHealthData(): HealthExportData {
    return HealthUtils.exportHealthData(this.startTime, this.healthHistory);
  }
}

// Export singleton instance
export const enterpriseHealthMonitor = EnterpriseHealthMonitor.getInstance();
