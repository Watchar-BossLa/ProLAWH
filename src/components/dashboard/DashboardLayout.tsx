
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
