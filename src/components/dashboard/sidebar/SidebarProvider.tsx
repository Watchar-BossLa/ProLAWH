
import React, { createContext, useContext, useState } from 'react';

interface SidebarContextType {
  openSections: string[];
  toggleSection: (title: string) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpenSections?: string[];
}

export function SidebarProvider({ children, defaultOpenSections = ['AI & Quantum'] }: SidebarProviderProps) {
  const [openSections, setOpenSections] = useState<string[]>(defaultOpenSections);

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  return (
    <SidebarContext.Provider value={{ openSections, toggleSection }}>
      {children}
    </SidebarContext.Provider>
  );
}
