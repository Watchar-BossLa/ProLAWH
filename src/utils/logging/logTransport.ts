
import { LogEntry, MetricEntry } from './types';
import { supabase } from '@/integrations/supabase/client';

export class LogTransport {
  async sendLogs(logs: LogEntry[]): Promise<void> {
    try {
      // In production, this would use a dedicated logging service
      // For now, we'll use a simple approach
      const { error } = await supabase
        .from('application_logs' as any)
        .insert(logs as any);

      if (error) {
        console.warn('Failed to send logs to backend:', error);
      }
    } catch (error) {
      console.warn('Backend logging not available:', error);
    }
  }

  async sendMetrics(metrics: MetricEntry[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('application_metrics' as any)
        .insert(metrics as any);

      if (error) {
        console.warn('Failed to send metrics to backend:', error);
      }
    } catch (error) {
      console.warn('Backend metrics not available:', error);
    }
  }
}

export const logTransport = new LogTransport();
