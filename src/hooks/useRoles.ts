
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { handleAsyncError } from '@/utils/errorHandling';

export type UserRole = 'admin' | 'mentor' | 'learner' | 'employer';

interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export function useRoles() {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRoles = async () => {
    if (!user) {
      setUserRoles([]);
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await handleAsyncError(
      async () => {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
        
        if (error) throw error;
        return data;
      },
      { operation: 'fetch_user_roles', user_id: user.id }
    );

    if (fetchError) {
      setError(fetchError.message);
      setUserRoles([]);
    } else {
      setUserRoles(data?.map((row: any) => row.role) || []);
      setError(null);
    }
    
    setLoading(false);
  };

  const hasRole = (role: UserRole): boolean => {
    return userRoles.includes(role);
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => userRoles.includes(role));
  };

  const isAdmin = (): boolean => hasRole('admin');
  const isMentor = (): boolean => hasRole('mentor');
  const isLearner = (): boolean => hasRole('learner');
  const isEmployer = (): boolean => hasRole('employer');

  const assignRole = async (targetUserId: string, role: UserRole) => {
    if (!user || !isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }

    const { error: assignError } = await handleAsyncError(
      async () => {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: targetUserId, role });
        
        if (error) throw error;
      },
      { operation: 'assign_role', target_user_id: targetUserId, role }
    );

    if (assignError) {
      throw new Error(`Failed to assign role: ${assignError.message}`);
    }
  };

  useEffect(() => {
    fetchUserRoles();
  }, [user]);

  return {
    userRoles,
    loading,
    error,
    hasRole,
    hasAnyRole,
    isAdmin,
    isMentor,
    isLearner,
    isEmployer,
    assignRole,
    refetch: fetchUserRoles
  };
}
