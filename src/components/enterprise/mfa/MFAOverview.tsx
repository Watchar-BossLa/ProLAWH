
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { MFAStatus } from '@/components/security/mfa/MFAStatus';

export function MFAOverview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Multi-Factor Authentication</h2>
      </div>
      
      <MFAStatus />
    </div>
  );
}
