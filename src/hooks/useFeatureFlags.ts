
import { useState, useEffect } from 'react';

interface FeatureFlags {
  enhancedUI: boolean;
  glassEffects: boolean;
  advancedAnimations: boolean;
  smartNavigation: boolean;
  aiEnhancedSearch: boolean;
  modernLayoutEngine: boolean;
}

const defaultFlags: FeatureFlags = {
  enhancedUI: true,
  glassEffects: true,
  advancedAnimations: true,
  smartNavigation: true, // Now enabled by default
  aiEnhancedSearch: false, // Gradual rollout
  modernLayoutEngine: false // Gradual rollout
};

export function useFeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);

  useEffect(() => {
    // Load feature flags from localStorage or API
    const savedFlags = localStorage.getItem('prolawh-feature-flags');
    if (savedFlags) {
      try {
        const parsedFlags = JSON.parse(savedFlags);
        setFlags({ ...defaultFlags, ...parsedFlags });
      } catch (error) {
        console.warn('Failed to parse feature flags from localStorage');
      }
    }
  }, []);

  const updateFlag = (flagName: keyof FeatureFlags, value: boolean) => {
    const newFlags = { ...flags, [flagName]: value };
    setFlags(newFlags);
    localStorage.setItem('prolawh-feature-flags', JSON.stringify(newFlags));
  };

  const isEnabled = (flagName: keyof FeatureFlags): boolean => {
    return flags[flagName];
  };

  return {
    flags,
    updateFlag,
    isEnabled
  };
}
