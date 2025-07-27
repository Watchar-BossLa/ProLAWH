
import { supabase } from '@/integrations/supabase/client';
import { HealthCheckResult } from './types';

export class DatabaseHealthChecker {
  static async checkDatabaseHealth(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    
    try {
      const { error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      const responseTime = performance.now() - startTime;
      
      if (error) {
        return {
          service: 'database',
          status: 'unhealthy',
          responseTime,
          error: error.message
        };
      }

      const status = responseTime > 2000 ? 'degraded' : 'healthy';
      
      return {
        service: 'database',
        status,
        responseTime,
        metadata: { recordCount: count }
      };
    } catch (error) {
      return {
        service: 'database',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown database error'
      };
    }
  }
}
