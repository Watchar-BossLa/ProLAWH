
"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

// Create an accessibility context to manage accessibility settings
interface AccessibilityContextValue {
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  toggleHighContrast: () => void;
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
  toggleReducedMotion: () => void;
}

export const AccessibilityContext = React.createContext<AccessibilityContextValue>({
  highContrast: false,
  setHighContrast: () => null,
  toggleHighContrast: () => null,
  reducedMotion: false,
  setReducedMotion: () => null,
  toggleReducedMotion: () => null,
});

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [highContrast, setHighContrast] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem('accessibility-highContrast') === 'true';
    }
    return false;
  });
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== "undefined") {
      // Check localStorage first, then fall back to system preference
      const storedPreference = localStorage.getItem('accessibility-reducedMotion');
      if (storedPreference !== null) {
        return storedPreference === 'true';
      }
      // Check system preference
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Add prefetching for theme to prevent flash of incorrect theme
  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add('theme-ready');
    
    // Check for high contrast mode from localStorage
    const storedHighContrast = localStorage.getItem('accessibility-highContrast');
    if (storedHighContrast === 'true') {
      document.documentElement.classList.add('high-contrast');
    }

    // Check for reduced motion preference
    const storedReducedMotion = localStorage.getItem('accessibility-reducedMotion');
    if (storedReducedMotion === 'true' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('reduce-motion');
    }
  }, []);
  
  // Handle dynamic theme as an enhancement layer on top of base themes
  useEffect(() => {
    const handleThemeChange = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const isDynamic = localStorage.getItem('theme') === 'dynamic';
      
      // Apply dynamic class
      if (isDynamic) {
        document.documentElement.classList.add('dynamic');
      } else {
        document.documentElement.classList.remove('dynamic');
      }

      // Apply high-contrast class
      if (highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }

      // Apply reduce-motion class
      if (reducedMotion) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
    };
    
    // Initial setup
    handleThemeChange();
    
    // Listen for theme changes
    window.addEventListener('theme-change', handleThemeChange);

    // Listen for system preference changes
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't explicitly set a preference
      if (localStorage.getItem('accessibility-reducedMotion') === null) {
        setReducedMotion(e.matches);
      }
    };
    
    prefersReducedMotion.addEventListener('change', handleReducedMotionChange);
    
    return () => {
      window.removeEventListener('theme-change', handleThemeChange);
      prefersReducedMotion.removeEventListener('change', handleReducedMotionChange);
    };
  }, [highContrast, reducedMotion]);

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('accessibility-highContrast', newValue.toString());
    document.documentElement.classList.toggle('high-contrast', newValue);
    
    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent('accessibility-change', { 
      detail: { highContrast: newValue } 
    }));
  };

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    localStorage.setItem('accessibility-reducedMotion', newValue.toString());
    document.documentElement.classList.toggle('reduce-motion', newValue);
    
    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent('accessibility-change', { 
      detail: { reducedMotion: newValue } 
    }));
  };

  const accessibilityValue = {
    highContrast,
    setHighContrast,
    toggleHighContrast,
    reducedMotion,
    setReducedMotion,
    toggleReducedMotion,
  };
  
  return (
    <AccessibilityContext.Provider value={accessibilityValue}>
      <NextThemesProvider 
        attribute="data-theme"
        defaultTheme="system"
        value={{
          light: "light",
          dark: "dark",
          system: "system",
          dynamic: "dynamic"
        }}
        enableSystem
        disableTransitionOnChange
        {...props}
      >
        {mounted ? children : 
          <div style={{ visibility: "hidden" }}>
            {children}
          </div>
        }
      </NextThemesProvider>
    </AccessibilityContext.Provider>
  );
}

// Hook to use accessibility context
export const useAccessibility = () => {
  const context = React.useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
