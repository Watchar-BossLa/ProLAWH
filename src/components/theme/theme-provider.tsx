
"use client"

import * as React from "react"
import { useEffect } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Add prefetching for theme to prevent flash of incorrect theme
  useEffect(() => {
    document.documentElement.classList.add('theme-ready')
  }, [])
  
  // Handle dynamic theme as an enhancement layer on top of base themes
  useEffect(() => {
    const handleThemeChange = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const isDynamic = localStorage.getItem('theme') === 'dynamic';
      
      if (isDynamic) {
        document.documentElement.classList.add('dynamic');
      } else {
        document.documentElement.classList.remove('dynamic');
      }
    }
    
    // Initial setup
    handleThemeChange();
    
    // Listen for theme changes
    window.addEventListener('theme-change', handleThemeChange);
    
    return () => {
      window.removeEventListener('theme-change', handleThemeChange);
    }
  }, []);
  
  return (
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
      {children}
    </NextThemesProvider>
  )
}
