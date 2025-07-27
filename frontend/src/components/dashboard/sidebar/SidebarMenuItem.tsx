
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  SidebarMenuButton,
  SidebarMenuItem as SidebarMenuItemBase,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MenuItem } from './menuItems';

interface SidebarMenuItemProps {
  item: MenuItem;
  openSections: string[];
  toggleSection: (title: string) => void;
}

export function SidebarMenuItem({ item, openSections, toggleSection }: SidebarMenuItemProps) {
  const location = useLocation();
  
  const isActive = (href: string) => location.pathname === href;

  if (item.items) {
    return (
      <SidebarMenuItemBase>
        <Collapsible 
          open={openSections.includes(item.title)}
          onOpenChange={() => toggleSection(item.title)}
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="w-full">
              <div className="flex items-center gap-3 w-full">
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.title}</span>
                {openSections.includes(item.title) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((subItem) => (
                <SidebarMenuSubItem key={subItem.href}>
                  <SidebarMenuSubButton 
                    asChild
                    isActive={subItem.href ? isActive(subItem.href) : false}
                  >
                    <Link 
                      to={subItem.href!}
                      className={cn(
                        "flex items-center gap-3 w-full pl-6",
                        subItem.href && isActive(subItem.href) && "bg-accent text-accent-foreground"
                      )}
                    >
                      <subItem.icon className="h-4 w-4" />
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItemBase>
    );
  }

  return (
    <SidebarMenuItemBase>
      <SidebarMenuButton 
        asChild
        isActive={item.href ? isActive(item.href) : false}
      >
        <Link 
          to={item.href!}
          className={cn(
            "flex items-center gap-3 w-full",
            item.href && isActive(item.href) && "bg-accent text-accent-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItemBase>
  );
}
