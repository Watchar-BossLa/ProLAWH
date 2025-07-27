
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useEnterpriseAuth } from '@/components/auth/EnterpriseAuthProvider';
import { CONFIG, ENV } from "@/config";

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
  const { user, isLoading } = useEnterpriseAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Use development bypass if enabled
  const effectiveUser = (!ENV.isProduction && CONFIG.BYPASS_AUTH) ? CONFIG.MOCK_USER : user;
  const effectiveLoading = (!ENV.isProduction && CONFIG.BYPASS_AUTH) ? false : isLoading;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  // Add development mode indicator
  if (!ENV.isProduction && CONFIG.BYPASS_AUTH) {
    console.log('🚀 Development mode: Authentication bypass enabled');
  }

  const value = {
    user: effectiveUser,
    loading: effectiveLoading,
    sidebarCollapsed,
    toggleSidebar
  };

  return (
    <DashboardLayoutContext.Provider value={value}>
      {children}
    </DashboardLayoutContext.Provider>
  );
}
