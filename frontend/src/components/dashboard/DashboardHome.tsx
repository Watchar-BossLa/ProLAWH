
import React from "react";
import { PersonalizedDashboard } from "./PersonalizedDashboard";
import { OfflineIndicator } from "@/components/ui/offline-indicator";
import { InstallPrompt } from "@/components/ui/install-prompt";

export function DashboardHome() {
  return (
    <div className="space-y-6">
      <OfflineIndicator />
      <PersonalizedDashboard />
      <InstallPrompt />
    </div>
  );
}
