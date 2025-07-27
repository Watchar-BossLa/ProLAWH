
import React, { createContext, useContext, ReactNode } from 'react';
import { useNavigationContext } from '@/hooks/navigation/useNavigationContext';
import type { NavigationContextType } from '@/types/navigation';

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const navigationState = useNavigationContext();

  return (
    <NavigationContext.Provider value={navigationState}>
      {children}
    </NavigationContext.Provider>
  );
}
