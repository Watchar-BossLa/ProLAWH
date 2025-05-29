
import React from 'react';
import {
  SidebarContent as SidebarContentBase,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { SidebarMenu } from './SidebarMenu';
import { SidebarProvider } from './SidebarProvider';

export function SidebarContent() {
  return (
    <SidebarContentBase>
      <SidebarGroup>
        <SidebarProvider>
          <SidebarMenu />
        </SidebarProvider>
      </SidebarGroup>
    </SidebarContentBase>
  );
}
