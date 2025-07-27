
import React from 'react';
import {
  SidebarMenu as SidebarMenuBase,
} from "@/components/ui/sidebar";
import { SidebarMenuItem } from './SidebarMenuItem';
import { menuItems } from './menuItems';
import { useSidebarContext } from './SidebarProvider';

export function SidebarMenu() {
  const { openSections, toggleSection } = useSidebarContext();

  return (
    <SidebarMenuBase>
      {menuItems.map((item) => (
        <SidebarMenuItem 
          key={item.title}
          item={item}
          openSections={openSections}
          toggleSection={toggleSection}
        />
      ))}
    </SidebarMenuBase>
  );
}
