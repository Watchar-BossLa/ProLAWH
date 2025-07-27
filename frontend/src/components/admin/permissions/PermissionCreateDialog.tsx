
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PermissionCreateDialogProps {
  onCreatePermission: (permission: {
    name: string;
    description: string;
    resource_type: string;
    action: string;
  }) => Promise<void>;
}

export function PermissionCreateDialog({ onCreatePermission }: PermissionCreateDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newPermission, setNewPermission] = useState({
    name: '',
    description: '',
    resource_type: '',
    action: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onCreatePermission(newPermission);
      setNewPermission({ name: '', description: '', resource_type: '', action: '' });
      setIsOpen(false);
      
      toast({
        title: "Success",
        description: "Permission created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create permission",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Permission
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Permission</DialogTitle>
          <DialogDescription>
            Add a new permission to the system
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Permission Name</Label>
            <Input
              id="name"
              value={newPermission.name}
              onChange={(e) => setNewPermission({...newPermission, name: e.target.value})}
              placeholder="e.g., user.read"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newPermission.description}
              onChange={(e) => setNewPermission({...newPermission, description: e.target.value})}
              placeholder="Brief description of the permission"
              required
            />
          </div>
          <div>
            <Label htmlFor="resource">Resource Type</Label>
            <Input
              id="resource"
              value={newPermission.resource_type}
              onChange={(e) => setNewPermission({...newPermission, resource_type: e.target.value})}
              placeholder="e.g., user, tenant, department"
              required
            />
          </div>
          <div>
            <Label htmlFor="action">Action</Label>
            <Input
              id="action"
              value={newPermission.action}
              onChange={(e) => setNewPermission({...newPermission, action: e.target.value})}
              placeholder="e.g., read, write, delete"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Create Permission
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
