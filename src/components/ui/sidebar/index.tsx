
import React from "react";

/**
 * Lightweight SidebarProvider + Sidebar to satisfy imports from "@/components/ui/sidebar".
 * This keeps things simple while the full sidebar system exists under frontend/.
 */
export function SidebarProvider({ children }: { children?: React.ReactNode }) {
  return <div data-sidebar-provider="" className="h-full">{children}</div>;
}

export function Sidebar({ children }: { children?: React.ReactNode }) {
  return (
    <aside
      data-sidebar=""
      className="w-64 shrink-0 border-r bg-card text-card-foreground"
    >
      {children}
    </aside>
  );
}
