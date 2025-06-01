
import { supabase } from '@/integrations/supabase/client';
import { handleAsyncError } from '@/utils/errorHandling';
import { DeviceSession } from '../types';

export class SessionService {
  static async createSession(userId: string, deviceId: string, deviceInfo: any): Promise<{ error?: any }> {
    const { error } = await handleAsyncError(
      async () => {
        try {
          // First, mark all other sessions for this device as inactive
          await supabase
            .from('user_sessions' as any)
            .update({ is_current: false } as any)
            .eq('user_id', userId)
            .eq('device_id', deviceId);

          // Create new session
          const { error } = await supabase
            .from('user_sessions' as any)
            .insert({
              user_id: userId,
              device_id: deviceId,
              device_name: deviceInfo.device_name,
              device_type: deviceInfo.device_type,
              browser: deviceInfo.browser,
              ip_address: 'client-side',
              is_current: true,
              last_activity: new Date().toISOString(),
              expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            } as any);

          if (error) throw error;
        } catch (tableError) {
          console.warn('User sessions table not available yet');
        }
      },
      { operation: 'create_session' }
    );

    return { error };
  }

  static async fetchSessions(userId: string): Promise<{ data?: DeviceSession[]; error?: any }> {
    const { data, error } = await handleAsyncError(
      async () => {
        try {
          const { data, error } = await supabase
            .from('user_sessions' as any)
            .select('*')
            .eq('user_id', userId)
            .gt('expires_at', new Date().toISOString())
            .order('last_activity', { ascending: false });

          if (error) throw error;
          return data || [];
        } catch (tableError) {
          console.warn('User sessions table not available yet');
          return [];
        }
      },
      { operation: 'fetch_sessions' }
    );

    return { data: data as DeviceSession[], error };
  }

  static async updateActivity(sessionId: string): Promise<{ error?: any }> {
    const { error } = await handleAsyncError(
      async () => {
        try {
          const { error } = await supabase
            .from('user_sessions' as any)
            .update({ 
              last_activity: new Date().toISOString() 
            } as any)
            .eq('id', sessionId);

          if (error) throw error;
        } catch (tableError) {
          console.warn('User sessions table not available yet');
        }
      },
      { operation: 'update_activity' }
    );

    return { error };
  }

  static async revokeSession(sessionId: string): Promise<{ error?: any }> {
    const { error } = await handleAsyncError(
      async () => {
        try {
          const { error } = await supabase
            .from('user_sessions' as any)
            .delete()
            .eq('id', sessionId);

          if (error) throw error;
        } catch (tableError) {
          console.warn('User sessions table not available yet');
        }
      },
      { operation: 'revoke_session', session_id: sessionId }
    );

    return { error };
  }

  static async revokeAllOtherSessions(userId: string, currentSessionId: string): Promise<{ error?: any }> {
    const { error } = await handleAsyncError(
      async () => {
        try {
          const { error } = await supabase
            .from('user_sessions' as any)
            .delete()
            .eq('user_id', userId)
            .neq('id', currentSessionId);

          if (error) throw error;
        } catch (tableError) {
          console.warn('User sessions table not available yet');
        }
      },
      { operation: 'revoke_all_sessions' }
    );

    return { error };
  }
}
