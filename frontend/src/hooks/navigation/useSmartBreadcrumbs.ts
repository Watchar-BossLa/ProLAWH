
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { generateBreadcrumbs } from '@/utils/navigation/breadcrumbUtils';
import type { BreadcrumbItem } from '@/types/navigation';

interface JourneyMetrics {
  path: string;
  timeSpent: number;
  visitCount: number;
  confidence: number;
  lastVisited: number;
}

interface SmartBreadcrumbItem extends BreadcrumbItem {
  timeSpent?: number;
  confidence?: number;
  isFrequent?: boolean;
}

const STORAGE_KEY = 'prolawh-journey-metrics';

export function useSmartBreadcrumbs() {
  const location = useLocation();
  const [journeyMetrics, setJourneyMetrics] = useState<Record<string, JourneyMetrics>>({});
  const [pageStartTime, setPageStartTime] = useState(Date.now());

  // Load journey metrics from storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setJourneyMetrics(JSON.parse(stored));
      } catch (error) {
        console.warn('Failed to parse journey metrics');
      }
    }
  }, []);

  // Track page visit and time spent
  useEffect(() => {
    const currentPath = location.pathname;
    const startTime = Date.now();
    setPageStartTime(startTime);

    return () => {
      const timeSpent = Date.now() - startTime;
      
      setJourneyMetrics(prev => {
        const current = prev[currentPath] || {
          path: currentPath,
          timeSpent: 0,
          visitCount: 0,
          confidence: 0,
          lastVisited: 0
        };

        const updated = {
          ...current,
          timeSpent: current.timeSpent + timeSpent,
          visitCount: current.visitCount + 1,
          lastVisited: Date.now(),
          confidence: Math.min(100, current.visitCount * 10 + (timeSpent / 1000))
        };

        const newMetrics = { ...prev, [currentPath]: updated };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newMetrics));
        
        return newMetrics;
      });
    };
  }, [location.pathname]);

  const getSmartBreadcrumbs = useCallback((): SmartBreadcrumbItem[] => {
    const baseBreadcrumbs = generateBreadcrumbs(location.pathname);
    
    return baseBreadcrumbs.map(crumb => {
      const metrics = journeyMetrics[crumb.href || location.pathname];
      
      return {
        ...crumb,
        timeSpent: metrics?.timeSpent || 0,
        confidence: metrics?.confidence || 0,
        isFrequent: (metrics?.visitCount || 0) > 5
      };
    });
  }, [location.pathname, journeyMetrics]);

  const getJourneyInsights = useCallback(() => {
    const sortedPaths = Object.values(journeyMetrics)
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, 5);

    return {
      mostVisited: sortedPaths,
      totalPages: Object.keys(journeyMetrics).length,
      averageTimePerPage: Object.values(journeyMetrics).reduce((acc, m) => acc + m.timeSpent, 0) / Object.keys(journeyMetrics).length || 0
    };
  }, [journeyMetrics]);

  return {
    smartBreadcrumbs: getSmartBreadcrumbs(),
    journeyInsights: getJourneyInsights(),
    currentPageMetrics: journeyMetrics[location.pathname]
  };
}
