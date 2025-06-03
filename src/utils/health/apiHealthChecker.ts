
import { supabase } from '@/integrations/supabase/client';
import { HealthCheckResult } from './types';

export class ApiHealthChecker {
  static async checkAPIHealth(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    
    try {
      // Test basic Supabase connectivity
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      const responseTime = performance.now() - startTime;
      
      if (error) {
        return {
          service: 'api',
          status: 'unhealthy',
          responseTime,
          error: error.message
        };
      }

      const status = responseTime > 2000 ? 'degraded' : 'healthy';
      
      return {
        service: 'api',
        status,
        responseTime,
        metadata: {
          endpoint: 'supabase',
          responseTime
        }
      };
    } catch (error) {
      return {
        service: 'api',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown API error'
      };
    }
  }
}
