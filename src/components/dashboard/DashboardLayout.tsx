
import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { 
  Sidebar,
  SidebarProvider,
} from "@/components/ui/sidebar"

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100 text-gray-700">
        <Sidebar>
          <DashboardSidebar />
        </Sidebar>
        
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
