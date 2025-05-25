
import React from 'react';
import { SidebarProvider } from './SidebarProvider';
import { SidebarHeader } from './SidebarHeader';
import { SidebarContent } from './SidebarContent';

export function SidebarWrapper() {
  return (
    <SidebarProvider>
      <div className="flex flex-col h-full">
        <SidebarHeader />
        <SidebarContent />
      </div>
    </SidebarProvider>
  );
}
