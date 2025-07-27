
export interface EnterpriseSystemStatus {
  initialized: boolean;
  timestamp: string;
  uptime: number;
}

export interface EnterpriseInitConfig {
  enableSecurity: boolean;
  enableHealthMonitoring: boolean;
  enableErrorHandlers: boolean;
  enablePerformanceMonitoring: boolean;
  enableUserTracking: boolean;
  healthMonitoringInterval: number;
}
