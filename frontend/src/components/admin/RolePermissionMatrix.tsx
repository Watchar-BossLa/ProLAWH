
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { useTenantManagement } from '@/hooks/useTenantManagement';
import { usePermissionManagement } from '@/hooks/usePermissionManagement';
import { PermissionCreateDialog } from './permissions/PermissionCreateDialog';
import { PermissionMatrix } from './permissions/PermissionMatrix';

export function RolePermissionMatrix() {
  const { currentTenant, hasPermission } = useTenantManagement();
  const { 
    groupedPermissions, 
    rolePermissions, 
    loading,
    createPermission,
    togglePermission 
  } = usePermissionManagement();
  
  const [roles] = useState(['owner', 'admin', 'member']);
  const [canManagePermissions, setCanManagePermissions] = useState(false);

  useEffect(() => {
    if (currentTenant) {
      checkPermissions();
    }
  }, [currentTenant]);

  const checkPermissions = async () => {
    const canManage = await hasPermission('admin');
    setCanManagePermissions(canManage);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading permissions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!canManagePermissions) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-muted-foreground">
              You don't have permission to manage roles and permissions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Role & Permission Matrix</h2>
          <p className="text-muted-foreground">
            Manage granular permissions for each role
          </p>
        </div>
        <PermissionCreateDialog onCreatePermission={createPermission} />
      </div>

      {Object.entries(groupedPermissions).map(([resourceType, resourcePermissions]) => (
        <PermissionMatrix
          key={resourceType}
          resourceType={resourceType}
          permissions={resourcePermissions}
          roles={roles}
          rolePermissions={rolePermissions}
          onTogglePermission={togglePermission}
        />
      ))}

      {Object.keys(groupedPermissions).length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Permissions Found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first permission to get started.
              </p>
              <PermissionCreateDialog onCreatePermission={createPermission} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
