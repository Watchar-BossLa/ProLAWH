
import React, { useState } from 'react';
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Package, Shield, Building2 } from 'lucide-react';
import { EnhancedUserManagement } from '@/components/admin/EnhancedUserManagement';
import { BulkOperationsPanel } from '@/components/admin/BulkOperationsPanel';
import { RolePermissionMatrix } from '@/components/admin/RolePermissionMatrix';

export default function UsersPage() {
  return (
    <PageWrapper
      title="User Management"
      description="Advanced user management, roles, permissions, and bulk operations."
    >
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Bulk Operations
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <EnhancedUserManagement />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkOperationsPanel />
        </TabsContent>

        <TabsContent value="permissions">
          <RolePermissionMatrix />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
