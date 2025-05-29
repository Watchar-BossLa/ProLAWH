
import { ReactNode } from 'react';

interface DashboardMainProps {
  children: ReactNode;
}

export function DashboardMain({ children }: DashboardMainProps) {
  return (
    <main className="flex-1 overflow-hidden">
      {children}
    </main>
  );
}
