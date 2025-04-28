
import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { 
  Sidebar,
  SidebarProvider,
} from "@/components/ui/sidebar"

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar>
          <DashboardSidebar />
        </Sidebar>
        
        <div className="flex-1 p-4">
          <div className="flex justify-end mb-4">
            <ThemeSwitcher />
          </div>
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
