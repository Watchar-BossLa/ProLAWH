
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';

export function BulkOperationAccessDenied() {
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
