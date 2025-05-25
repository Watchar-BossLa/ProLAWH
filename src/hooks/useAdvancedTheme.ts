
import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type AccentColor = 'blue' | 'green' | 'purple' | 'orange' | 'red';
export type FontSize = 'small' | 'medium' | 'large';

interface ThemeConfig {
  mode: ThemeMode;
  accentColor: AccentColor;
  fontSize: FontSize;
  reducedMotion: boolean;
  highContrast: boolean;
}

const defaultTheme: ThemeConfig = {
  mode: 'auto',
  accentColor: 'blue',
  fontSize: 'medium',
  reducedMotion: false,
  highContrast: false
};

export function useAdvancedTheme() {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const stored = localStorage.getItem('advanced-theme');
    return stored ? JSON.parse(stored) : defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem('advanced-theme', JSON.stringify(theme));
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (config: ThemeConfig) => {
    const root = document.documentElement;
    
    // Apply theme mode
    if (config.mode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', config.mode === 'dark');
    }

    // Apply accent color
    root.setAttribute('data-accent', config.accentColor);

    // Apply font size
    root.setAttribute('data-font-size', config.fontSize);

    // Apply accessibility options
    root.classList.toggle('reduce-motion', config.reducedMotion);
    root.classList.toggle('high-contrast', config.highContrast);
  };

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  return {
    theme,
    updateTheme
  };
}
