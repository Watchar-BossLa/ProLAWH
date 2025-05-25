
import { useState } from "react";
import { SidebarHeader } from "@/components/ui/sidebar";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarContent } from "./sidebar/SidebarContent";

export function DashboardSidebar() {
  const [openSections, setOpenSections] = useState<string[]>(['AI & Quantum']); // Default open

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  return (
    <div className="flex flex-col h-full">
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      
      <SidebarContent 
        openSections={openSections}
        toggleSection={toggleSection}
      />
    </div>
  );
}
