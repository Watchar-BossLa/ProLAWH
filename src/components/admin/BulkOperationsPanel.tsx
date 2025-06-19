
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBulkOperations } from '@/hooks/useBulkOperations';
import { BulkOperationForm } from './bulk/BulkOperationForm';
import { BulkOperationHistory } from './bulk/BulkOperationHistory';
import { BulkOperationAccessDenied } from './bulk/BulkOperationAccessDenied';

export function BulkOperationsPanel() {
  const {
    operations,
    selectedOperation,
    setSelectedOperation,
    selectedUsers,
    setSelectedUsers,
    operationData,
    setOperationData,
    isExecuting,
    canExecuteBulk,
    executeBulkOperation
  } = useBulkOperations();

  if (!canExecuteBulk) {
    return <BulkOperationAccessDenied />;
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
          <BulkOperationForm
            selectedOperation={selectedOperation}
            onOperationChange={setSelectedOperation}
            selectedUsers={selectedUsers}
            operationData={operationData}
            onOperationDataChange={setOperationData}
            isExecuting={isExecuting}
            onExecute={executeBulkOperation}
          />
        </TabsContent>

        <TabsContent value="history">
          <BulkOperationHistory operations={operations} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
