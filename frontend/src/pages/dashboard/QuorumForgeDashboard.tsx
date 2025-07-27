
import React from 'react';
import { QuorumForgeDashboard as Dashboard } from '@/components/quorumforge/QuorumForgeDashboard';

export default function QuorumForgeDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">QuorumForge OS</h1>
        <p className="text-muted-foreground">
          AI-native zero-trust software engineering platform
        </p>
      </div>
      
      <Dashboard />
    </div>
  );
}
