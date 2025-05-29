
import { ReactNode } from 'react';
import { useDashboardLayoutContext } from './DashboardLayoutProvider';

interface DashboardContainerProps {
  children: ReactNode;
}

export function DashboardContainer({ children }: DashboardContainerProps) {
  const { sidebarCollapsed } = useDashboardLayoutContext();

  return (
    <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-200 ${
      sidebarCollapsed ? 'ml-16' : 'ml-64'
    }`}>
      {children}
    </div>
  );
}
