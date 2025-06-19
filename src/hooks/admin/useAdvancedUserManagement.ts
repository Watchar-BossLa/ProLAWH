
import { useUserManagement } from './useUserManagement';
import { useDepartmentManagement } from './useDepartmentManagement';
import { useTeamManagement } from './useTeamManagement';

export function useAdvancedUserManagement() {
  const {
    users,
    loading: usersLoading,
    fetchUsers,
    assignUserToDepartment,
    assignUserToTeam
  } = useUserManagement();

  const {
    departments,
    loading: departmentsLoading,
    fetchDepartments,
    createDepartment
  } = useDepartmentManagement();

  const {
    teams,
    loading: teamsLoading,
    fetchTeams,
    createTeam
  } = useTeamManagement();

  const loading = usersLoading || departmentsLoading || teamsLoading;

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
