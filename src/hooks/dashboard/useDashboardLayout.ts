
import { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { DEVELOPMENT_CONFIG } from "@/config/development";

export function useDashboardLayout() {
  const { user, loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Use development bypass if enabled
  const effectiveUser = DEVELOPMENT_CONFIG.BYPASS_AUTH ? DEVELOPMENT_CONFIG.MOCK_USER : user;
  const effectiveLoading = DEVELOPMENT_CONFIG.BYPASS_AUTH ? false : loading;

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

  return {
    user: effectiveUser,
    loading: effectiveLoading,
    sidebarCollapsed,
    toggleSidebar
  };
}
