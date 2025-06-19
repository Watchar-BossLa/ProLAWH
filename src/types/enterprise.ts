
export interface BulkOperation {
  id: string;
  operation_type: string;
  status: string;
  progress_percentage: number;
  total_items: number;
  processed_items: number;
  failed_items: number;
  created_at: string;
  completed_at: string;
  error_log: any[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource_type: string;
  action: string;
}

export interface RolePermission {
  role: string;
  permission_id: string;
  granted_at: string;
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

export interface BackupCode {
  id: string;
  code: string;
  used: boolean;
  used_at?: string;
  created_at: string;
}
