
import React, { createContext, useContext, useState, ReactNode } from "react";

interface DashboardLayoutContextValue {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (val: boolean) => void;
  toggleSidebar: () => void;
}

const DashboardLayoutContext = createContext<DashboardLayoutContextValue | undefined>(undefined);

export function DashboardLayoutProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  return (
    <DashboardLayoutContext.Provider
      value={{ sidebarCollapsed, setSidebarCollapsed, toggleSidebar }}
    >
      {children}
    </DashboardLayoutContext.Provider>
  );
}

export function useDashboardLayoutContext() {
  const ctx = useContext(DashboardLayoutContext);
  if (!ctx) {
    throw new Error("useDashboardLayoutContext must be used within DashboardLayoutProvider");
  }
  return ctx;
}
