
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Play, Users } from 'lucide-react';

interface BulkOperationFormProps {
  selectedOperation: string;
  onOperationChange: (value: string) => void;
  selectedUsers: string[];
  operationData: any;
  onOperationDataChange: (data: any) => void;
  isExecuting: boolean;
  onExecute: () => void;
}

export function BulkOperationForm({
  selectedOperation,
  onOperationChange,
  selectedUsers,
  operationData,
  onOperationDataChange,
  isExecuting,
  onExecute
}: BulkOperationFormProps) {
  return (
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
            <Select value={selectedOperation} onValueChange={onOperationChange}>
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
              onValueChange={(value) => onOperationDataChange({...operationData, role: value})}
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
              onChange={(e) => onOperationDataChange({...operationData, message: e.target.value})}
              rows={4}
            />
          </div>
        )}

        <Button 
          onClick={onExecute}
          disabled={!selectedOperation || selectedUsers.length === 0 || isExecuting}
          className="w-full"
        >
          <Play className="h-4 w-4 mr-2" />
          {isExecuting ? 'Executing...' : 'Execute Operation'}
        </Button>
      </CardContent>
    </Card>
  );
}
