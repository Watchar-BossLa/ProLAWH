
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { DashboardLayoutProvider, useDashboardLayoutContext } from "./layout/DashboardLayoutProvider";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardContainer } from "./layout/DashboardContainer";
import { DashboardMain } from "./layout/DashboardMain";
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { CONFIG, ENV } from "@/config";
import { useState } from "react";

function DashboardLayoutContent() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Skip auth check in development mode if bypass is enabled
  if (!ENV.isProduction && CONFIG.BYPASS_AUTH) {
    // Allow access in development bypass mode
  } else if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex h-screen bg-background w-full">
      <DashboardSidebar />
      <DashboardContainer>
        <DashboardHeader />
        <DashboardMain>
          <Outlet />
        </DashboardMain>
      </DashboardContainer>
    </div>
  );
}

export function DashboardLayout() {
  return (
    <DashboardLayoutProvider>
      <DashboardLayoutContent />
    </DashboardLayoutProvider>
  );
}
