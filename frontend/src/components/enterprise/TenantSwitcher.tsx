
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Settings } from 'lucide-react';
import { useTenantManagement } from '@/hooks/useTenantManagement';
import { toast } from '@/hooks/use-toast';

export function TenantSwitcher() {
  const { currentTenant, userTenants, switchTenant, createTenant } = useTenantManagement();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantSlug, setNewTenantSlug] = useState('');
  const [newTenantDomain, setNewTenantDomain] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName.trim() || !newTenantSlug.trim()) return;

    setIsCreating(true);
    const { error } = await createTenant({
      name: newTenantName,
      slug: newTenantSlug,
      domain: newTenantDomain || undefined
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Organization created successfully"
      });
      setIsCreateOpen(false);
      setNewTenantName('');
      setNewTenantSlug('');
      setNewTenantDomain('');
    }
    setIsCreating(false);
  };

  if (userTenants.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            No Organization
          </CardTitle>
          <CardDescription>
            You need to create or join an organization to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Organization
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Organization</DialogTitle>
                <DialogDescription>
                  Set up a new organization to get started with ProLawh
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTenant} className="space-y-4">
                <div>
                  <Label htmlFor="name">Organization Name</Label>
                  <Input
                    id="name"
                    value={newTenantName}
                    onChange={(e) => setNewTenantName(e.target.value)}
                    placeholder="Acme Corp"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={newTenantSlug}
                    onChange={(e) => setNewTenantSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="acme-corp"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="domain">Custom Domain (Optional)</Label>
                  <Input
                    id="domain"
                    value={newTenantDomain}
                    onChange={(e) => setNewTenantDomain(e.target.value)}
                    placeholder="acme.com"
                  />
                </div>
                <Button type="submit" disabled={isCreating} className="w-full">
                  {isCreating ? 'Creating...' : 'Create Organization'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentTenant?.id || ''}
        onValueChange={switchTenant}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select organization">
            {currentTenant && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {currentTenant.name}
                <Badge variant="secondary" className="text-xs">
                  {currentTenant.plan_type}
                </Badge>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {userTenants.map((tenant) => (
            <SelectItem key={tenant.id} value={tenant.id}>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {tenant.name}
                <Badge variant="secondary" className="text-xs">
                  {tenant.plan_type}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
            <DialogDescription>
              Add another organization to your account
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTenant} className="space-y-4">
            <div>
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                value={newTenantName}
                onChange={(e) => setNewTenantName(e.target.value)}
                placeholder="Acme Corp"
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={newTenantSlug}
                onChange={(e) => setNewTenantSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="acme-corp"
                required
              />
            </div>
            <div>
              <Label htmlFor="domain">Custom Domain (Optional)</Label>
              <Input
                id="domain"
                value={newTenantDomain}
                onChange={(e) => setNewTenantDomain(e.target.value)}
                placeholder="acme.com"
              />
            </div>
            <Button type="submit" disabled={isCreating} className="w-full">
              {isCreating ? 'Creating...' : 'Create Organization'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
