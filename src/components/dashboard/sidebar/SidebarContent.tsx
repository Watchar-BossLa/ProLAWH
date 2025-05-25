
import React from 'react';
import {
  SidebarContent as SidebarContentBase,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { SidebarMenu } from './SidebarMenu';

export function SidebarContent() {
  return (
    <SidebarContentBase>
      <SidebarGroup>
        <SidebarMenu />
      </SidebarGroup>
    </SidebarContentBase>
  );
}
