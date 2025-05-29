
import React from 'react';
import { SidebarHeader } from './SidebarHeader';
import { SidebarContent } from './SidebarContent';

export function SidebarWrapper() {
  return (
    <div className="flex flex-col h-full">
      <SidebarHeader />
      <SidebarContent />
    </div>
  );
}
