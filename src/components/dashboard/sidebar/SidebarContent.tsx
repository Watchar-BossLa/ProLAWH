
import React from 'react';
import {
  SidebarContent as SidebarContentBase,
  SidebarGroup,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { SidebarMenuItem } from './SidebarMenuItem';
import { menuItems } from './menuItems';

interface SidebarContentProps {
  openSections: string[];
  toggleSection: (title: string) => void;
}

export function SidebarContent({ openSections, toggleSection }: SidebarContentProps) {
  return (
    <SidebarContentBase>
      <SidebarGroup>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem 
              key={item.title}
              item={item}
              openSections={openSections}
              toggleSection={toggleSection}
            />
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContentBase>
  );
}
