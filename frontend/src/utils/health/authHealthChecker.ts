
import { supabase } from '@/integrations/supabase/client';
import { HealthCheckResult } from './types';

export class AuthHealthChecker {
  static async checkAuthenticationHealth(): Promise<HealthCheckResult> {
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
}
