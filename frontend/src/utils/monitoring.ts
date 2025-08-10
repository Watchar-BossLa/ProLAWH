import { supabase } from '@/integrations/supabase/client';

interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  error?: string;
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  checks: HealthCheck[];
  timestamp: string;
}

export class MonitoringService {
  private static instance: MonitoringService;
  private healthCheckInterval?: ReturnType<typeof setInterval>;

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  async checkDatabaseHealth(): Promise<HealthCheck> {
    const startTime = performance.now();
    
    try {
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      const responseTime = performance.now() - startTime;
      
      if (error) {
        return {
          service: 'database',
          status: 'unhealthy',
          responseTime,
          error: error.message
        };
      }
      
      return {
        service: 'database',
        status: responseTime > 1000 ? 'degraded' : 'healthy',
        responseTime
      };
    } catch (error) {
      return {
        service: 'database',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async checkAuthHealth(): Promise<HealthCheck> {
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
      
      return {
        service: 'authentication',
        status: responseTime > 500 ? 'degraded' : 'healthy',
        responseTime
      };
    } catch (error) {
      return {
        service: 'authentication',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async performHealthCheck(): Promise<SystemHealth> {
    const checks = await Promise.all([
      this.checkDatabaseHealth(),
      this.checkAuthHealth()
    ]);

    const hasUnhealthy = checks.some(check => check.status === 'unhealthy');
    const hasDegraded = checks.some(check => check.status === 'degraded');

    let overall: 'healthy' | 'degraded' | 'unhealthy';
    if (hasUnhealthy) {
      overall = 'unhealthy';
    } else if (hasDegraded) {
      overall = 'degraded';
    } else {
      overall = 'healthy';
    }

    return {
      overall,
      checks,
      timestamp: new Date().toISOString()
    };
  }

  startHealthChecking(intervalMs: number = 30000) {
    this.stopHealthChecking();
    
    this.healthCheckInterval = setInterval(async () => {
      const health = await this.performHealthCheck();
      
      // Log health status
      console.log('[Health Check]', health);
      
      // Store in localStorage for debugging
      localStorage.setItem('prolawh_health', JSON.stringify(health));
      
      // Emit custom event for components to listen to
      window.dispatchEvent(new CustomEvent('health-check', { detail: health }));
    }, intervalMs);
  }

  stopHealthChecking() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
  }

  // Performance monitoring
  static trackPerformance(operation: string, duration: number, metadata?: Record<string, any>) {
    const performanceData = {
      operation,
      duration,
      timestamp: new Date().toISOString(),
      metadata
    };

    // Log performance data
    console.log('[Performance]', performanceData);
    
    // Store performance metrics
    const metrics = JSON.parse(localStorage.getItem('prolawh_metrics') || '[]');
    metrics.push(performanceData);
    
    // Keep only last 100 metrics
    if (metrics.length > 100) {
      metrics.splice(0, metrics.length - 100);
    }
    
    localStorage.setItem('prolawh_metrics', JSON.stringify(metrics));
  }

  // Error tracking
  static trackError(error: Error, context?: Record<string, any>) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Log error
    console.error('[Error Tracking]', errorData);
    
    // Store error data
    const errors = JSON.parse(localStorage.getItem('prolawh_errors') || '[]');
    errors.push(errorData);
    
    // Keep only last 50 errors
    if (errors.length > 50) {
      errors.splice(0, errors.length - 50);
    }
    
    localStorage.setItem('prolawh_errors', JSON.stringify(errors));
  }
}

// Initialize monitoring service
export const monitoring = MonitoringService.getInstance();
