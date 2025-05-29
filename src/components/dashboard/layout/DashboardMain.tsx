
import { ReactNode } from 'react';

interface DashboardMainProps {
  children: ReactNode;
}

export function DashboardMain({ children }: DashboardMainProps) {
  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto max-w-7xl p-6 space-y-6">
        {children}
      </div>
    </main>
  );
}
