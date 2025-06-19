
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, UserPlus, Search, Filter, MoreHorizontal, Shield, Building2 } from 'lucide-react';
import { useTenantManagement } from '@/hooks/useTenantManagement';
import { UserProfile, Department } from '@/types/enterprise';

export function EnhancedUserManagement() {
  const { currentTenant, hasPermission } = useTenantManagement();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canManageUsers, setCanManageUsers] = useState(false);

  useEffect(() => {
    if (currentTenant) {
      checkPermissions();
      // Simulate loading users
      setTimeout(() => {
        setUsers([]);
        setDepartments([]);
        setIsLoading(false);
      }, 1000);
    }
  }, [currentTenant]);

  const checkPermissions = async () => {
    const canManage = await hasPermission('admin');
    setCanManageUsers(canManage);
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    // Simulate API call
    console.log('Updating user role:', userId, newRole);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.employee_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'outline';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'destructive';
      case 'admin': return 'default';
      case 'member': return 'secondary';
      default: return 'outline';
    }
  };

  if (!canManageUsers) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-muted-foreground">
              You don't have permission to manage users.
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
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">
            Manage users, roles, and permissions for {currentTenant?.name}
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full">
              <Building2 className="h-4 w-4 mr-2" />
              Bulk Actions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users ({filteredUsers.length})
          </CardTitle>
          <CardDescription>
            Manage user accounts, roles, and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.full_name || 'Unnamed User'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{user.employee_id || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeColor(user.status)}>
                        {user.status || 'active'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.last_login_at ? 
                        new Date(user.last_login_at).toLocaleDateString() : 
                        'Never'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={user.role}
                          onValueChange={(value) => updateUserRole(user.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="owner">Owner</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
