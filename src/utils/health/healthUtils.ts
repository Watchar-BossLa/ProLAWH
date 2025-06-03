
import { SystemHealthReport, HealthExportData, HealthCheckResult } from './types';

export class HealthUtils {
  static calculateOverallHealth(checks: HealthCheckResult[]): 'healthy' | 'degraded' | 'unhealthy' {
    if (checks.some(check => check.status === 'unhealthy')) {
      return 'unhealthy';
    }
    if (checks.some(check => check.status === 'degraded')) {
      return 'degraded';
    }
    return 'healthy';
  }

  static exportHealthData(startTime: number, healthHistory: SystemHealthReport[]): HealthExportData {
    const uptime = Date.now() - startTime;
    const totalChecks = healthHistory.length;
    const healthyCount = healthHistory.filter(report => report.overall === 'healthy').length;
    const healthyPercentage = totalChecks > 0 ? Math.round((healthyCount / totalChecks) * 100) : 100;

    // Calculate average response times per service
    const averageResponseTimes: Record<string, number> = {};
    const serviceCounts: Record<string, number> = {};

    healthHistory.forEach(report => {
      report.checks.forEach(check => {
        if (!averageResponseTimes[check.service]) {
          averageResponseTimes[check.service] = 0;
          serviceCounts[check.service] = 0;
        }
        averageResponseTimes[check.service] += check.responseTime;
        serviceCounts[check.service]++;
      });
    });

    // Calculate averages
    Object.keys(averageResponseTimes).forEach(service => {
      averageResponseTimes[service] = Math.round(averageResponseTimes[service] / serviceCounts[service]);
    });

    return {
      summary: {
        uptime,
        totalChecks,
        healthyPercentage
      },
      recentReports: healthHistory.slice(-10), // Last 10 reports
      trends: {
        averageResponseTimes,
        uptimePercentage: healthyPercentage
      }
    };
  }
}
