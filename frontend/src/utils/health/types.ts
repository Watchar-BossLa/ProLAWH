
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

export interface HealthExportData {
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
}
