
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenantManagement } from './useTenantManagement';
import { handleAsyncError } from '@/utils/errorHandling';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  status: string;
  role: string;
  department_id: string;
  employee_id: string;
  hire_date: string;
  last_login_at: string;
  created_at: string;
  department?: {
    id: string;
    name: string;
  };
  teams?: Array<{
    id: string;
    name: string;
    role: string;
  }>;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  manager_id: string;
  budget: number;
  parent_department_id?: string;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  department_id: string;
  team_lead_id: string;
  max_members: number;
  member_count: number;
  created_at: string;
}

export function useAdvancedUserManagement() {
  const { currentTenant } = useTenantManagement();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    if (!currentTenant) return;

    const { data } = await handleAsyncError(
      async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            tenant_users!inner(role, tenant_id, department_id),
            departments(id, name),
            team_members(
              team_id,
              role,
              teams(id, name)
            )
          `)
          .eq('tenant_users.tenant_id', currentTenant.id);

        if (error) throw error;
        return data;
      },
      { operation: 'fetch_advanced_users' }
    );

    if (data) {
      const formattedUsers = data.map((user: any) => ({
        ...user,
        role: user.tenant_users[0]?.role || 'member',
        department_id: user.tenant_users[0]?.department_id,
        department: user.departments?.[0],
        teams: user.team_members?.map((tm: any) => ({
          ...tm.teams,
          role: tm.role
        })) || []
      }));
      setUsers(formattedUsers);
    }
  };

  const fetchDepartments = async () => {
    if (!currentTenant) return;

    const { data } = await handleAsyncError(
      async () => {
        const { data, error } = await supabase
          .from('departments')
          .select('*')
          .eq('tenant_id', currentTenant.id)
          .order('name');

        if (error) throw error;
        return data;
      },
      { operation: 'fetch_departments' }
    );

    if (data) {
      setDepartments(data);
    }
  };

  const fetchTeams = async () => {
    if (!currentTenant) return;

    const { data } = await handleAsyncError(
      async () => {
        const { data, error } = await supabase
          .from('teams')
          .select(`
            *,
            team_members(count)
          `)
          .eq('tenant_id', currentTenant.id)
          .order('name');

        if (error) throw error;
        return data;
      },
      { operation: 'fetch_teams' }
    );

    if (data) {
      const formattedTeams = data.map((team: any) => ({
        ...team,
        member_count: team.team_members?.[0]?.count || 0
      }));
      setTeams(formattedTeams);
    }
  };

  const createDepartment = async (departmentData: Partial<Department>) => {
    if (!currentTenant) return { error: 'No tenant selected' };

    const { data, error } = await handleAsyncError(
      async () => {
        const { data, error } = await supabase
          .from('departments')
          .insert({
            ...departmentData,
            tenant_id: currentTenant.id
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      { operation: 'create_department' }
    );

    if (data) {
      await fetchDepartments();
    }

    return { data, error };
  };

  const createTeam = async (teamData: Partial<Team>) => {
    if (!currentTenant) return { error: 'No tenant selected' };

    const { data, error } = await handleAsyncError(
      async () => {
        const { data, error } = await supabase
          .from('teams')
          .insert({
            ...teamData,
            tenant_id: currentTenant.id
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      { operation: 'create_team' }
    );

    if (data) {
      await fetchTeams();
    }

    return { data, error };
  };

  const assignUserToDepartment = async (userId: string, departmentId: string) => {
    const { error } = await handleAsyncError(
      async () => {
        const { error } = await supabase
          .from('tenant_users')
          .update({ department_id: departmentId })
          .eq('user_id', userId)
          .eq('tenant_id', currentTenant?.id);

        if (error) throw error;
      },
      { operation: 'assign_user_department' }
    );

    if (!error) {
      await fetchUsers();
    }

    return { error };
  };

  const assignUserToTeam = async (userId: string, teamId: string, role: string = 'member') => {
    const { error } = await handleAsyncError(
      async () => {
        const { error } = await supabase
          .from('team_members')
          .insert({
            team_id: teamId,
            user_id: userId,
            role
          });

        if (error) throw error;
      },
      { operation: 'assign_user_team' }
    );

    if (!error) {
      await fetchUsers();
      await fetchTeams();
    }

    return { error };
  };

  useEffect(() => {
    if (currentTenant) {
      Promise.all([
        fetchUsers(),
        fetchDepartments(),
        fetchTeams()
      ]).finally(() => setLoading(false));
    }
  }, [currentTenant]);

  return {
    users,
    departments,
    teams,
    loading,
    fetchUsers,
    fetchDepartments,
    fetchTeams,
    createDepartment,
    createTeam,
    assignUserToDepartment,
    assignUserToTeam
  };
}
