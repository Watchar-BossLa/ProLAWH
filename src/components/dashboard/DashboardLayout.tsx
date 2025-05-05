
import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { 
  Sidebar,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

// Development flag to bypass authentication
const BYPASS_AUTH = true;

export function DashboardLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!BYPASS_AUTH && !isLoading && !user) {
      // Redirect to auth page with return URL
      navigate('/auth', { state: { returnUrl: location.pathname } });
    }
  }, [user, isLoading, navigate, location.pathname]);

  if (isLoading && !BYPASS_AUTH) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Allow access even without authentication during development
  const showContent = BYPASS_AUTH || user;

  if (!showContent) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
        <Sidebar>
          <DashboardSidebar />
        </Sidebar>
        
        <div className="flex-1 overflow-auto">
          <div className="flex justify-end p-4 border-b">
            <ThemeSwitcher />
          </div>
          <div className="p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
