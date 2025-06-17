
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Plus, Trash2, AlertTriangle, Activity, Users, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTenantManagement } from '@/hooks/useTenantManagement';
import { handleAsyncError } from '@/utils/errorHandling';
import { toast } from '@/hooks/use-toast';

interface IPWhitelistEntry {
  id: string;
  ip_address: string;
  description?: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
}

interface SecurityAuditLog {
  id: string;
  event_type: string;
  event_details: any;
  ip_address?: string;
  user_agent?: string;
  risk_score: number;
  created_at: string;
}

export function EnhancedSecurityDashboard() {
  const { currentTenant, hasPermission } = useTenantManagement();
  const [ipWhitelist, setIpWhitelist] = useState<IPWhitelistEntry[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityAuditLog[]>([]);
  const [newIP, setNewIP] = useState('');
  const [newIPDescription, setNewIPDescription] = useState('');
  const [isAddingIP, setIsAddingIP] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [canManageSecurity, setCanManageSecurity] = useState(false);

  useEffect(() => {
    if (currentTenant) {
      checkPermissions();
      fetchIPWhitelist();
      fetchSecurityLogs();
    }
  }, [currentTenant]);

  const checkPermissions = async () => {
    const canManage = await hasPermission('admin');
    setCanManageSecurity(canManage);
  };

  const fetchIPWhitelist = async () => {
    if (!currentTenant) return;

    const { data } = await handleAsyncError(
      async () => {
        const { data, error } = await supabase
          .from('tenant_ip_whitelist')
          .select('*')
          .eq('tenant_id', currentTenant.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      { operation: 'fetch_ip_whitelist' }
    );

    if (data) {
      setIpWhitelist(data);
    }
  };

  const fetchSecurityLogs = async () => {
    if (!currentTenant) return;

    const { data } = await handleAsyncError(
      async () => {
        const { data, error } = await supabase
          .from('security_audit_logs')
          .select('*')
          .eq('tenant_id', currentTenant.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        return data;
      },
      { operation: 'fetch_security_logs' }
    );

    if (data) {
      setSecurityLogs(data);
    }
  };

  const addIPToWhitelist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant || !newIP.trim()) return;

    setIsAddingIP(true);
    const { error } = await handleAsyncError(
      async () => {
        const { error } = await supabase
          .from('tenant_ip_whitelist')
          .insert({
            tenant_id: currentTenant.id,
            ip_address: newIP,
            description: newIPDescription || null
          });

        if (error) throw error;
      },
      { operation: 'add_ip_whitelist' }
    );

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add IP to whitelist",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "IP address added to whitelist"
      });
      setNewIP('');
      setNewIPDescription('');
      setIsDialogOpen(false);
      fetchIPWhitelist();
    }
    setIsAddingIP(false);
  };

  const removeIPFromWhitelist = async (id: string) => {
    const { error } = await handleAsyncError(
      async () => {
        const { error } = await supabase
          .from('tenant_ip_whitelist')
          .delete()
          .eq('id', id);

        if (error) throw error;
      },
      { operation: 'remove_ip_whitelist', metadata: { id } }
    );

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove IP from whitelist",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "IP address removed from whitelist"
      });
      fetchIPWhitelist();
    }
  };

  const getRiskBadgeColor = (score: number) => {
    if (score >= 8) return 'destructive';
    if (score >= 5) return 'secondary';
    return 'default';
  };

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

      {/* Security Overview Cards */}
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

      {/* IP Whitelist Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>IP Whitelist</CardTitle>
              <CardDescription>
                Manage allowed IP addresses for enhanced security
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add IP
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add IP to Whitelist</DialogTitle>
                  <DialogDescription>
                    Add an IP address or CIDR block to the whitelist
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={addIPToWhitelist} className="space-y-4">
                  <div>
                    <Label htmlFor="ip">IP Address or CIDR</Label>
                    <Input
                      id="ip"
                      value={newIP}
                      onChange={(e) => setNewIP(e.target.value)}
                      placeholder="192.168.1.1 or 10.0.0.0/8"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      value={newIPDescription}
                      onChange={(e) => setNewIPDescription(e.target.value)}
                      placeholder="Office network"
                    />
                  </div>
                  <Button type="submit" disabled={isAddingIP} className="w-full">
                    {isAddingIP ? 'Adding...' : 'Add to Whitelist'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP Address</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ipWhitelist.map((ip) => (
                <TableRow key={ip.id}>
                  <TableCell className="font-mono">{ip.ip_address}</TableCell>
                  <TableCell>{ip.description || 'No description'}</TableCell>
                  <TableCell>
                    <Badge variant={ip.is_active ? 'default' : 'secondary'}>
                      {ip.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(ip.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIPFromWhitelist(ip.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Security Audit Logs */}
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
    </div>
  );
}
