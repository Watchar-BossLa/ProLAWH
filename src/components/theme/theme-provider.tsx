
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { useEffect } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Add prefetching for theme to prevent flash of incorrect theme
  useEffect(() => {
    document.documentElement.classList.add('theme-ready')
  }, [])
  
  return (
    <NextThemesProvider 
      attribute="class"
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
