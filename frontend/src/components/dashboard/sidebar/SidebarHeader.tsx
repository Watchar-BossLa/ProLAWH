
import React from 'react';
import { SidebarHeader as SidebarHeaderBase } from "@/components/ui/sidebar";
import { SidebarLogo } from './SidebarLogo';

export function SidebarHeader() {
  return (
    <SidebarHeaderBase>
      <SidebarLogo />
    </SidebarHeaderBase>
  );
}
