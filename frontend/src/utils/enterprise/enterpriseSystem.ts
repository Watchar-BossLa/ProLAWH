
import { enterpriseLogger, PerformanceTracker } from '../logging';
import { enterpriseSecurity } from '../security';
import { enterpriseHealthMonitor } from '../health';
import { ErrorHandlers } from './errorHandlers';
import { PerformanceMonitoring } from './performanceMonitoring';
import { UserActionTracking } from './userActionTracking';
import { EnterpriseSystemStatus, EnterpriseInitConfig } from './types';

class EnterpriseSystem {
  private static instance: EnterpriseSystem;
  private initialized = false;

  static getInstance(): EnterpriseSystem {
    if (!EnterpriseSystem.instance) {
      EnterpriseSystem.instance = new EnterpriseSystem();
    }
    return EnterpriseSystem.instance;
  }

  async initialize(config: Partial<EnterpriseInitConfig> = {}): Promise<void> {
    if (this.initialized) {
      enterpriseLogger.warn('Enterprise system already initialized', {}, 'EnterpriseSystem');
      return;
    }

    const defaultConfig: EnterpriseInitConfig = {
      enableSecurity: true,
      enableHealthMonitoring: true,
      enableErrorHandlers: true,
      enablePerformanceMonitoring: true,
      enableUserTracking: true,
      healthMonitoringInterval: 300000 // 5 minutes
    };

    const finalConfig = { ...defaultConfig, ...config };

    try {
      const initTimer = PerformanceTracker.trackPageLoad('enterprise_initialization');

      // Initialize security monitoring
      if (finalConfig.enableSecurity) {
        enterpriseSecurity.initialize();
        enterpriseLogger.info('Enterprise security initialized', {}, 'EnterpriseSystem');
      }

      // Start health monitoring
      if (finalConfig.enableHealthMonitoring) {
        enterpriseHealthMonitor.startMonitoring(finalConfig.healthMonitoringInterval);
        enterpriseLogger.info('Enterprise health monitoring started', {}, 'EnterpriseSystem');
      }

      // Set up global error handlers
      if (finalConfig.enableErrorHandlers) {
        ErrorHandlers.setupGlobalErrorHandlers();
        enterpriseLogger.info('Global error handlers configured', {}, 'EnterpriseSystem');
      }

      // Set up performance monitoring
      if (finalConfig.enablePerformanceMonitoring) {
        PerformanceMonitoring.setupPerformanceMonitoring();
        enterpriseLogger.info('Performance monitoring configured', {}, 'EnterpriseSystem');
      }

      // Set up automatic logging for user actions
      if (finalConfig.enableUserTracking) {
        UserActionTracking.setupUserActionTracking();
        enterpriseLogger.info('User action tracking configured', {}, 'EnterpriseSystem');
      }

      this.initialized = true;
      initTimer.end();
      
      enterpriseLogger.info('Enterprise system fully initialized', {
        initializationComplete: true,
        timestamp: new Date().toISOString(),
        config: finalConfig
      }, 'EnterpriseSystem');

    } catch (error) {
      enterpriseLogger.critical('Failed to initialize enterprise system', error as Error, {}, 'EnterpriseSystem');
      throw error;
    }
  }

  getSystemStatus(): EnterpriseSystemStatus {
    return {
      initialized: this.initialized,
      timestamp: new Date().toISOString(),
      uptime: performance.now()
    };
  }

  async shutdown(): Promise<void> {
    if (!this.initialized) return;

    enterpriseLogger.info('Shutting down enterprise system', {}, 'EnterpriseSystem');
    
    enterpriseHealthMonitor.stopMonitoring();
    enterpriseLogger.destroy();
    
    this.initialized = false;
    
    console.log('Enterprise system shutdown complete');
  }
}

export { EnterpriseSystem };
