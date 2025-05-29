
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { DashboardLayoutProvider, useDashboardLayoutContext } from "./layout/DashboardLayoutProvider";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardContainer } from "./layout/DashboardContainer";
import { DashboardMain } from "./layout/DashboardMain";
import { DEVELOPMENT_CONFIG } from "@/config/development";

function DashboardLayoutContent() {
  const { user, loading } = useDashboardLayoutContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Skip auth check in development mode
  if (!DEVELOPMENT_CONFIG.BYPASS_AUTH && !user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex h-screen bg-background">
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
