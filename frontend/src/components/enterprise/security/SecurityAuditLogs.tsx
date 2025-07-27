
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { SecurityAuditLog } from '@/types/security';

interface SecurityAuditLogsProps {
  securityLogs: SecurityAuditLog[];
}

export function SecurityAuditLogs({ securityLogs }: SecurityAuditLogsProps) {
  const getRiskBadgeColor = (score: number) => {
    if (score >= 8) return 'destructive';
    if (score >= 5) return 'secondary';
    return 'default';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Audit Logs</CardTitle>
        <CardDescription>
          Recent security events and activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Risk Score</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {securityLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {log.event_type}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRiskBadgeColor(log.risk_score)}>
                    {log.risk_score}/10
                  </Badge>
                </TableCell>
                <TableCell className="font-mono">
                  {log.ip_address || 'Unknown'}
                </TableCell>
                <TableCell>
                  {new Date(log.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
