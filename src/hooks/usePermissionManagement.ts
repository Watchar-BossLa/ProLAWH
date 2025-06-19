
import { useState, useEffect } from 'react';
import { Permission, RolePermission } from '@/types/enterprise';
import { toast } from '@/hooks/use-toast';

export function usePermissionManagement() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      // Mock data - replace with actual API calls when database is ready
      const mockPermissions: Permission[] = [
        {
          id: '1',
          name: 'user.read',
          description: 'View user profiles',
          resource_type: 'user',
          action: 'read'
        },
        {
          id: '2',
          name: 'user.write',
          description: 'Edit user profiles',
          resource_type: 'user',
          action: 'write'
        },
        {
          id: '3',
          name: 'tenant.admin',
          description: 'Manage tenant settings',
          resource_type: 'tenant',
          action: 'admin'
        }
      ];

      const mockRolePermissions: RolePermission[] = [
        {
          role: 'owner',
          permission_id: '1',
          granted_at: new Date().toISOString()
        },
        {
          role: 'owner',
          permission_id: '2',
          granted_at: new Date().toISOString()
        },
        {
          role: 'owner',
          permission_id: '3',
          granted_at: new Date().toISOString()
        },
        {
          role: 'admin',
          permission_id: '1',
          granted_at: new Date().toISOString()
        }
      ];

      setPermissions(mockPermissions);
      setRolePermissions(mockRolePermissions);
    } catch (error) {
      console.error('Failed to load permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPermission = async (permissionData: {
    name: string;
    description: string;
    resource_type: string;
    action: string;
  }) => {
    // Mock API call
    console.log('Creating permission:', permissionData);
    
    const newPermission: Permission = {
      id: Date.now().toString(),
      ...permissionData
    };

    setPermissions(prev => [...prev, newPermission]);
  };

  const togglePermission = async (role: string, permissionId: string, currentlyGranted: boolean) => {
    // Mock API call
    console.log('Toggle permission:', role, permissionId, !currentlyGranted);
    
    if (currentlyGranted) {
      // Remove permission
      setRolePermissions(prev => 
        prev.filter(rp => !(rp.role === role && rp.permission_id === permissionId))
      );
    } else {
      // Add permission
      const newRolePermission: RolePermission = {
        role,
        permission_id: permissionId,
        granted_at: new Date().toISOString()
      };
      setRolePermissions(prev => [...prev, newRolePermission]);
    }

    toast({
      title: "Success",
      description: currentlyGranted ? "Permission removed" : "Permission granted"
    });
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource_type]) {
      acc[permission.resource_type] = [];
    }
    acc[permission.resource_type].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return {
    permissions,
    rolePermissions,
    groupedPermissions,
    loading,
    createPermission,
    togglePermission,
    refreshPermissions: loadPermissions
  };
}
