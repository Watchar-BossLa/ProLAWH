
import { HealthCheckResult, SystemHealthReport, HealthExportData } from './types';

export class HealthUtils {
  static calculateOverallHealth(checks: HealthCheckResult[]): 'healthy' | 'degraded' | 'unhealthy' {
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

  static exportHealthData(
    startTime: number,
    healthHistory: SystemHealthReport[]
  ): HealthExportData {
    const totalChecks = healthHistory.length;
    const healthyChecks = healthHistory.filter(report => report.overall === 'healthy').length;
    
    const serviceResponseTimes: Record<string, number[]> = {};
    
    healthHistory.forEach(report => {
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
        uptime: Date.now() - startTime,
        totalChecks,
        healthyPercentage: totalChecks > 0 ? (healthyChecks / totalChecks) * 100 : 0
      },
      recentReports: healthHistory.slice(-10),
      trends: {
        averageResponseTimes,
        uptimePercentage: totalChecks > 0 ? (healthyChecks / totalChecks) * 100 : 0
      }
    };
  }
}
