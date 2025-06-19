
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield } from 'lucide-react';
import { Permission, RolePermission } from '@/types/enterprise';

interface PermissionMatrixProps {
  resourceType: string;
  permissions: Permission[];
  roles: string[];
  rolePermissions: RolePermission[];
  onTogglePermission: (role: string, permissionId: string, granted: boolean) => Promise<void>;
}

export function PermissionMatrix({ 
  resourceType, 
  permissions, 
  roles, 
  rolePermissions,
  onTogglePermission 
}: PermissionMatrixProps) {
  const hasRolePermission = (role: string, permissionId: string) => {
    return rolePermissions.some(rp => rp.role === role && rp.permission_id === permissionId);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'destructive';
      case 'admin': return 'default';
      case 'member': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card>
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
            {permissions.map((permission) => (
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
                        onTogglePermission(role, permission.id, hasRolePermission(role, permission.id))
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
  );
}
