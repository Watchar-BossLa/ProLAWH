
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Activity, AlertTriangle } from 'lucide-react';
import { IPWhitelistEntry, SecurityAuditLog } from '@/types/security';

interface SecurityOverviewCardsProps {
  ipWhitelist: IPWhitelistEntry[];
  securityLogs: SecurityAuditLog[];
}

export function SecurityOverviewCards({ ipWhitelist, securityLogs }: SecurityOverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active IP Rules</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{ipWhitelist.filter(ip => ip.is_active).length}</div>
          <p className="text-xs text-muted-foreground">Whitelisted IP addresses</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Security Events</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{securityLogs.length}</div>
          <p className="text-xs text-muted-foreground">Events in last 24 hours</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High Risk Events</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {securityLogs.filter(log => log.risk_score >= 7).length}
          </div>
          <p className="text-xs text-muted-foreground">Require attention</p>
        </CardContent>
      </Card>
    </div>
  );
}
