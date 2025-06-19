
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Play, Download, Upload, Users, Mail, Shield } from 'lucide-react';
import { useTenantManagement } from '@/hooks/useTenantManagement';
import { handleAsyncError } from '@/utils/errorHandling';
import { toast } from '@/hooks/use-toast';
import { BulkOperation } from '@/types/enterprise';

export function BulkOperationsPanel() {
  const { currentTenant, hasPermission } = useTenantManagement();
  const [operations, setOperations] = useState<BulkOperation[]>([]);
  const [selectedOperation, setSelectedOperation] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [operationData, setOperationData] = useState<any>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [canExecuteBulk, setCanExecuteBulk] = useState(false);

  useEffect(() => {
    if (currentTenant) {
      checkPermissions();
    }
  }, [currentTenant]);

  const checkPermissions = async () => {
    const canExecute = await hasPermission('admin');
    setCanExecuteBulk(canExecute);
  };

  const executeBulkOperation = async () => {
    if (!currentTenant || !selectedOperation || selectedUsers.length === 0) return;

    setIsExecuting(true);
    
    // Simulate bulk operation for demo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Success",
      description: "Bulk operation started successfully"
    });
    
    // Reset form
    setSelectedOperation('');
    setSelectedUsers([]);
    setOperationData({});
    setIsExecuting(false);
  };

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

  if (!canExecuteBulk) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-muted-foreground">
              You don't have permission to execute bulk operations.
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
          <h2 className="text-2xl font-bold">Bulk Operations</h2>
          <p className="text-muted-foreground">
            Execute operations on multiple users simultaneously
          </p>
        </div>
      </div>

      <Tabs defaultValue="execute" className="space-y-4">
        <TabsList>
          <TabsTrigger value="execute">Execute Operations</TabsTrigger>
          <TabsTrigger value="history">Operation History</TabsTrigger>
        </TabsList>

        <TabsContent value="execute">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Execute Bulk Operation
              </CardTitle>
              <CardDescription>
                Select an operation type and target users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Operation Type</label>
                  <Select value={selectedOperation} onValueChange={setSelectedOperation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select operation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="role_assignment">Role Assignment</SelectItem>
                      <SelectItem value="status_update">Status Update</SelectItem>
                      <SelectItem value="send_message">Send Message</SelectItem>
                      <SelectItem value="export_data">Export User Data</SelectItem>
                      <SelectItem value="department_assignment">Department Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Target Users</label>
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Select Users ({selectedUsers.length})
                  </Button>
                </div>
              </div>

              {selectedOperation === 'role_assignment' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">New Role</label>
                  <Select 
                    value={operationData.role || ''} 
                    onValueChange={(value) => setOperationData({...operationData, role: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedOperation === 'send_message' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    placeholder="Enter message to send to selected users..."
                    value={operationData.message || ''}
                    onChange={(e) => setOperationData({...operationData, message: e.target.value})}
                    rows={4}
                  />
                </div>
              )}

              <Button 
                onClick={executeBulkOperation}
                disabled={!selectedOperation || selectedUsers.length === 0 || isExecuting}
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                {isExecuting ? 'Executing...' : 'Execute Operation'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
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
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No bulk operations found
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
