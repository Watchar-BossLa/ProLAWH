
import { createContext, useContext, ReactNode } from 'react';
import { useDashboardLayout } from '@/hooks/dashboard/useDashboardLayout';

interface DashboardLayoutContextType {
  user: any;
  loading: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const DashboardLayoutContext = createContext<DashboardLayoutContextType | undefined>(undefined);

export function useDashboardLayoutContext() {
  const context = useContext(DashboardLayoutContext);
  if (!context) {
    throw new Error('useDashboardLayoutContext must be used within DashboardLayoutProvider');
  }
  return context;
}

interface DashboardLayoutProviderProps {
  children: ReactNode;
}

export function DashboardLayoutProvider({ children }: DashboardLayoutProviderProps) {
  const layoutState = useDashboardLayout();

  return (
    <DashboardLayoutContext.Provider value={layoutState}>
      {children}
    </DashboardLayoutContext.Provider>
  );
}
