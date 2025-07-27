
import React from 'react';
import { PageWrapper } from "@/components/ui/page-wrapper";
import { EnhancedSecurityDashboard } from '@/components/enterprise/EnhancedSecurityDashboard';
import { MultiFactorAuthManager } from '@/components/enterprise/MultiFactorAuthManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Key, Users, Settings } from 'lucide-react';

export default function EnterpriseSecurityPage() {
  return (
    <PageWrapper
      title="Enterprise Security"
      description="Advanced security management and multi-factor authentication for enterprise-grade protection."
    >
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="mfa" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            MFA
          </TabsTrigger>
          <TabsTrigger value="access" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Access Control
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <EnhancedSecurityDashboard />
        </TabsContent>

        <TabsContent value="mfa">
          <MultiFactorAuthManager />
        </TabsContent>

        <TabsContent value="access">
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Control Management</h3>
            <p className="text-muted-foreground">
              Advanced access control features coming in Phase 2
            </p>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="text-center py-12">
            <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Security Settings</h3>
            <p className="text-muted-foreground">
              Advanced security configuration coming in Phase 2
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
