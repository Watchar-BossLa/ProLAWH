
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTenantManagement } from '@/hooks/useTenantManagement';
import { handleAsyncError } from '@/utils/errorHandling';
import { toast } from '@/hooks/use-toast';

interface Permission {
  id: string;
  name: string;
  description: string;
  resource_type: string;
  action: string;
}

interface RolePermission {
  role: string;
  permission_id: string;
  granted_at: string;
}

export function RolePermissionMatrix() {
  const { currentTenant, hasPermission } = useTenantManagement();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [roles] = useState(['owner', 'admin', 'member']);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPermission, setNewPermission] = useState({
    name: '',
    description: '',
    resource_type: '',
    action: ''
  });
  const [canManagePermissions, setCanManagePermissions] = useState(false);

  useEffect(() => {
    if (currentTenant) {
      checkPermissions();
      fetchPermissions();
      fetchRolePermissions();
    }
  }, [currentTenant]);

  const checkPermissions = async () => {
    const canManage = await hasPermission('admin');
    setCanManagePermissions(canManage);
  };

  const fetchPermissions = async () => {
    const { data } = await handleAsyncError(
      async () => {
        const { data, error } = await supabase
          .from('permissions')
          .select('*')
          .order('resource_type', { ascending: true });

        if (error) throw error;
        return data;
      },
      { operation: 'fetch_permissions' }
    );

    if (data) {
      setPermissions(data);
    }
  };

  const fetchRolePermissions = async () => {
    if (!currentTenant) return;

    const { data } = await handleAsyncError(
      async () => {
        const { data, error } = await supabase
          .from('role_permissions')
          .select('*')
          .eq('tenant_id', currentTenant.id);

        if (error) throw error;
        return data;
      },
      { operation: 'fetch_role_permissions' }
    );

    if (data) {
      setRolePermissions(data);
    }
  };

  const togglePermission = async (role: string, permissionId: string, granted: boolean) => {
    if (!currentTenant) return;

    if (granted) {
      // Remove permission
      const { error } = await handleAsyncError(
        async () => {
          const { error } = await supabase
            .from('role_permissions')
            .delete()
            .eq('tenant_id', currentTenant.id)
            .eq('role', role)
            .eq('permission_id', permissionId);

          if (error) throw error;
        },
        { operation: 'remove_role_permission' }
      );

      if (error) {
        toast({
          title: "Error",
          description: "Failed to remove permission",
          variant: "destructive"
        });
      }
    } else {
      // Add permission
      const { error } = await handleAsyncError(
        async () => {
          const { error } = await supabase
            .from('role_permissions')
            .insert({
              tenant_id: currentTenant.id,
              role,
              permission_id: permissionId,
              granted_by: (await supabase.auth.getUser()).data.user?.id
            });

          if (error) throw error;
        },
        { operation: 'add_role_permission' }
      );

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add permission",
          variant: "destructive"
        });
      }
    }

    if (!error) {
      fetchRolePermissions();
    }
  };

  const createPermission = async () => {
    const { error } = await handleAsyncError(
      async () => {
        const { error } = await supabase
          .from('permissions')
          .insert(newPermission);

        if (error) throw error;
      },
      { operation: 'create_permission' }
    );

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create permission",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Permission created successfully"
      });
      setIsCreateDialogOpen(false);
      setNewPermission({ name: '', description: '', resource_type: '', action: '' });
      fetchPermissions();
    }
  };

  const hasRolePermission = (role: string, permissionId: string) => {
    return rolePermissions.some(rp => rp.role === role && rp.permission_id === permissionId);
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource_type]) {
      acc[permission.resource_type] = [];
    }
    acc[permission.resource_type].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'destructive';
      case 'admin': return 'default';
      case 'member': return 'secondary';
      default: return 'outline';
    }
  };

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
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Permission
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Permission</DialogTitle>
              <DialogDescription>
                Add a new permission to the system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Permission Name</Label>
                <Input
                  id="name"
                  value={newPermission.name}
                  onChange={(e) => setNewPermission({...newPermission, name: e.target.value})}
                  placeholder="e.g., user.read"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newPermission.description}
                  onChange={(e) => setNewPermission({...newPermission, description: e.target.value})}
                  placeholder="Brief description of the permission"
                />
              </div>
              <div>
                <Label htmlFor="resource">Resource Type</Label>
                <Input
                  id="resource"
                  value={newPermission.resource_type}
                  onChange={(e) => setNewPermission({...newPermission, resource_type: e.target.value})}
                  placeholder="e.g., user, tenant, department"
                />
              </div>
              <div>
                <Label htmlFor="action">Action</Label>
                <Input
                  id="action"
                  value={newPermission.action}
                  onChange={(e) => setNewPermission({...newPermission, action: e.target.value})}
                  placeholder="e.g., read, write, delete"
                />
              </div>
              <Button onClick={createPermission} className="w-full">
                Create Permission
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {Object.entries(groupedPermissions).map(([resourceType, resourcePermissions]) => (
        <Card key={resourceType}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 capitalize">
              <Shield className="h-5 w-5" />
              {resourceType} Permissions
            </CardTitle>
            <CardDescription>
              Manage {resourceType}-related permissions for each role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permission</TableHead>
                  {roles.map(role => (
                    <TableHead key={role} className="text-center">
                      <Badge variant={getRoleBadgeColor(role)} className="capitalize">
                        {role}
                      </Badge>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {resourcePermissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{permission.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {permission.description}
                        </div>
                      </div>
                    </TableCell>
                    {roles.map(role => (
                      <TableCell key={role} className="text-center">
                        <Switch
                          checked={hasRolePermission(role, permission.id)}
                          onCheckedChange={(checked) => 
                            togglePermission(role, permission.id, hasRolePermission(role, permission.id))
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
