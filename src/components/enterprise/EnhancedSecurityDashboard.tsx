
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import { useSecurityDashboard } from '@/hooks/useSecurityDashboard';
import { SecurityOverviewCards } from './security/SecurityOverviewCards';
import { IPWhitelistManagement } from './security/IPWhitelistManagement';
import { SecurityAuditLogs } from './security/SecurityAuditLogs';

export function EnhancedSecurityDashboard() {
  const { 
    ipWhitelist, 
    securityLogs, 
    canManageSecurity, 
    addIPToWhitelist, 
    removeIPFromWhitelist 
  } = useSecurityDashboard();

  if (!canManageSecurity) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access security settings.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Enhanced Security Dashboard</h2>
      </div>

      <SecurityOverviewCards 
        ipWhitelist={ipWhitelist} 
        securityLogs={securityLogs} 
      />

      <IPWhitelistManagement
        ipWhitelist={ipWhitelist}
        onAddIP={addIPToWhitelist}
        onRemoveIP={removeIPFromWhitelist}
      />

      <SecurityAuditLogs securityLogs={securityLogs} />
    </div>
  );
}
