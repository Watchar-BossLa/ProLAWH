
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Shield, Mail, Download, Upload } from 'lucide-react';
import { BulkOperation } from '@/types/enterprise';

interface BulkOperationHistoryProps {
  operations: BulkOperation[];
}

export function BulkOperationHistory({ operations }: BulkOperationHistoryProps) {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'running': return 'default';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'role_assignment': return <Shield className="h-4 w-4" />;
      case 'send_message': return <Mail className="h-4 w-4" />;
      case 'export_data': return <Download className="h-4 w-4" />;
      case 'import_users': return <Upload className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Operation History
        </CardTitle>
        <CardDescription>
          Track the status and progress of bulk operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Operation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Completed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {operations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No bulk operations found
                </TableCell>
              </TableRow>
            ) : (
              operations.map((operation) => (
                <TableRow key={operation.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getOperationIcon(operation.operation_type)}
                      <span className="capitalize">
                        {operation.operation_type.replace('_', ' ')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeColor(operation.status)}>
                      {operation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {operation.processed_items}/{operation.total_items}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({operation.progress_percentage}%)
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{operation.total_items}</TableCell>
                  <TableCell>
                    {new Date(operation.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {operation.completed_at 
                      ? new Date(operation.completed_at).toLocaleString()
                      : '-'
                    }
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
