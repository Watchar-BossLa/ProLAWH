
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { IPWhitelistEntry } from '@/types/security';
import { toast } from '@/hooks/use-toast';

interface IPWhitelistManagementProps {
  ipWhitelist: IPWhitelistEntry[];
  onAddIP: (ip: string, description: string) => Promise<void>;
  onRemoveIP: (id: string) => Promise<void>;
}

export function IPWhitelistManagement({ ipWhitelist, onAddIP, onRemoveIP }: IPWhitelistManagementProps) {
  const [newIP, setNewIP] = useState('');
  const [newIPDescription, setNewIPDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingIP, setIsAddingIP] = useState(false);

  const handleAddIP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIP.trim()) return;

    setIsAddingIP(true);
    try {
      await onAddIP(newIP, newIPDescription);
      setNewIP('');
      setNewIPDescription('');
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add IP to whitelist",
        variant: "destructive"
      });
    }
    setIsAddingIP(false);
  };

  return (
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
              <form onSubmit={handleAddIP} className="space-y-4">
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
                    onClick={() => onRemoveIP(ip.id)}
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
  );
}
