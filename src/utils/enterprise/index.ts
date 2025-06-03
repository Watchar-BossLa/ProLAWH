
export { EnterpriseSystem } from './enterpriseSystem';
export { ErrorHandlers } from './errorHandlers';
export { PerformanceMonitoring } from './performanceMonitoring';
export { UserActionTracking } from './userActionTracking';
export type { EnterpriseSystemStatus, EnterpriseInitConfig } from './types';

// Import the class to create the singleton instance
import { EnterpriseSystem } from './enterpriseSystem';

// Create and export the singleton instance
const enterpriseSystem = EnterpriseSystem.getInstance();

// Auto-initialize in production or when explicitly requested
if (process.env.NODE_ENV === 'production' || localStorage.getItem('prolawh_enterprise_mode') === 'true') {
  enterpriseSystem.initialize().catch(error => {
    console.error('Failed to auto-initialize enterprise system:', error);
  });
}

export { enterpriseSystem };
