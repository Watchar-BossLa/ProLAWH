
import { ReactNode } from 'react';
import { useDashboardLayoutContext } from './DashboardLayoutProvider';

interface DashboardContainerProps {
  children: ReactNode;
}

export function DashboardContainer({ children }: DashboardContainerProps) {
  const { sidebarCollapsed } = useDashboardLayoutContext();

  return (
    <div className="flex flex-col flex-1 min-h-screen overflow-hidden">
      {children}
    </div>
  );
}
