
import React from "react";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarContent } from "./sidebar/SidebarContent";

export function DashboardSidebar() {
  return (
    <SidebarProvider>
      <Sidebar>
        <div className="flex flex-col h-full">
          <SidebarHeader />
          <SidebarContent />
        </div>
      </Sidebar>
    </SidebarProvider>
  );
}
