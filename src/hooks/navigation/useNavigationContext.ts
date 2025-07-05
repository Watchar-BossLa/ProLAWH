
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { NavigationItem, BreadcrumbItem, QuickAccessItem, NavigationSuggestion } from '@/types/navigation';

const MAX_HISTORY_ITEMS = 50;

// Route configuration for breadcrumbs and titles
const routeConfig: Record<string, { title: string; parent?: string }> = {
  '/dashboard': { title: 'Dashboard' },
  '/dashboard/home': { title: 'Home', parent: '/dashboard' },
  '/dashboard/learning': { title: 'Learning', parent: '/dashboard' },
  '/dashboard/opportunities': { title: 'Opportunities', parent: '/dashboard' },
  '/dashboard/network': { title: 'Network', parent: '/dashboard' },
  '/dashboard/mentorship': { title: 'Mentorship', parent: '/dashboard' },
  '/dashboard/skills': { title: 'Skills & Badges', parent: '/dashboard' },
  '/dashboard/green-skills': { title: 'Green Skills', parent: '/dashboard' },
  '/dashboard/career-twin': { title: 'Career Twin', parent: '/dashboard' },
  '/dashboard/arcade': { title: 'Arcade', parent: '/dashboard' },
  '/dashboard/staking': { title: 'Skill Staking', parent: '/dashboard' },
  '/dashboard/veriskill': { title: 'VeriSkill Network', parent: '/dashboard' },
  '/dashboard/study-bee': { title: 'StudyBee', parent: '/dashboard' },
  '/dashboard/quantum-matching': { title: 'Quantum Matching', parent: '/dashboard' },
  '/dashboard/quorumforge': { title: 'QuorumForge', parent: '/dashboard' },
  '/dashboard/enhanced-ai': { title: 'Enhanced AI', parent: '/dashboard' },
  '/dashboard/collaboration': { title: 'Collaboration', parent: '/dashboard' },
  '/dashboard/community': { title: 'Community', parent: '/dashboard' },
  '/dashboard/study-groups': { title: 'Study Groups', parent: '/dashboard' },
  '/dashboard/chat': { title: 'Real-Time Chat', parent: '/dashboard' },
};

export function useNavigationContext() {
  const location = useLocation();
  const navigate = useNavigate();
  const [history, setHistory] = useState<NavigationItem[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [quickAccess, setQuickAccess] = useState<QuickAccessItem[]>([]);

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = useCallback((path: string): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];
    const config = routeConfig[path];
    
    if (!config) return breadcrumbs;

    // Build breadcrumb chain
    const buildChain = (currentPath: string) => {
      const currentConfig = routeConfig[currentPath];
      if (!currentConfig) return;

      if (currentConfig.parent) {
        buildChain(currentConfig.parent);
      }

      breadcrumbs.push({
        label: currentConfig.title,
        href: currentPath === path ? undefined : currentPath,
        current: currentPath === path
      });
    };

    buildChain(path);
    return breadcrumbs;
  }, []);

  // Generate smart navigation suggestions
  const generateSuggestions = useCallback((currentPath: string): NavigationSuggestion[] => {
    const suggestions: NavigationSuggestion[] = [];

    // Context-aware suggestions based on current page
    switch (currentPath) {
      case '/dashboard/opportunities':
        suggestions.push(
          {
            id: 'skills-check',
            title: 'Review Your Skills',
            description: 'Update your skills to get better opportunity matches',
            path: '/dashboard/skills',
            reason: 'Better matches with updated skills',
            priority: 1
          },
          {
            id: 'ai-matching',
            title: 'AI Career Intelligence',
            description: 'Get AI-powered career recommendations',
            path: '/dashboard/enhanced-ai',
            reason: 'AI can help optimize your career path',
            priority: 2
          }
        );
        break;
      
      case '/dashboard/learning':
        suggestions.push(
          {
            id: 'career-twin',
            title: 'Career Twin Analysis',
            description: 'See how your learning aligns with career goals',
            path: '/dashboard/career-twin',
            reason: 'Optimize learning for career growth',
            priority: 1
          }
        );
        break;

      case '/dashboard/skills':
        suggestions.push(
          {
            id: 'skill-staking',
            title: 'Stake Your Skills',
            description: 'Earn rewards by staking verified skills',
            path: '/dashboard/staking',
            reason: 'Monetize your expertise',
            priority: 1
          }
        );
        break;
    }

    return suggestions;
  }, []);

  // Add item to navigation history
  const addToHistory = useCallback((path: string, title?: string) => {
    const config = routeConfig[path];
    const itemTitle = title || config?.title || path;
    
    const newItem: NavigationItem = {
      id: crypto.randomUUID(),
      path,
      title: itemTitle,
      timestamp: Date.now()
    };

    setHistory(prev => {
      const filtered = prev.filter(item => item.path !== path);
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      setCurrentHistoryIndex(0);
      return updated;
    });
  }, []);

  // Navigation methods
  const navigateTo = useCallback((path: string, title?: string) => {
    navigate(path);
    addToHistory(path, title);
  }, [navigate, addToHistory]);

  const goBack = useCallback(() => {
    if (currentHistoryIndex < history.length - 1) {
      const nextIndex = currentHistoryIndex + 1;
      const targetItem = history[nextIndex];
      setCurrentHistoryIndex(nextIndex);
      navigate(targetItem.path);
    }
  }, [history, currentHistoryIndex, navigate]);

  const goForward = useCallback(() => {
    if (currentHistoryIndex > 0) {
      const nextIndex = currentHistoryIndex - 1;
      const targetItem = history[nextIndex];
      setCurrentHistoryIndex(nextIndex);
      navigate(targetItem.path);
    }
  }, [history, currentHistoryIndex, navigate]);

  // Quick access management
  const addToQuickAccess = useCallback((item: QuickAccessItem) => {
    setQuickAccess(prev => {
      const filtered = prev.filter(qa => qa.id !== item.id);
      return [item, ...filtered].slice(0, 10); // Keep max 10 items
    });
  }, []);

  const removeFromQuickAccess = useCallback((id: string) => {
    setQuickAccess(prev => prev.filter(qa => qa.id !== id));
  }, []);

  // Update history when location changes
  useEffect(() => {
    const path = location.pathname;
    if (history.length === 0 || history[0].path !== path) {
      addToHistory(path);
    }
  }, [location.pathname, history, addToHistory]);

  // Initialize quick access items
  useEffect(() => {
    if (quickAccess.length === 0) {
      const defaultQuickAccess: QuickAccessItem[] = [
        {
          id: 'opportunities',
          title: 'Opportunities',
          description: 'Browse green career opportunities',
          path: '/dashboard/opportunities',
          icon: 'briefcase',
          category: 'frequent'
        },
        {
          id: 'learning',
          title: 'Learning',
          description: 'Continue your learning journey',
          path: '/dashboard/learning',
          icon: 'book-open',
          category: 'frequent'
        },
        {
          id: 'network',
          title: 'Network',
          description: 'Connect with professionals',
          path: '/dashboard/network',
          icon: 'users',
          category: 'frequent'
        }
      ];
      setQuickAccess(defaultQuickAccess);
    }
  }, [quickAccess.length]);

  return {
    history,
    currentPath: location.pathname,
    breadcrumbs: generateBreadcrumbs(location.pathname),
    canGoBack: currentHistoryIndex < history.length - 1,
    canGoForward: currentHistoryIndex > 0,
    quickAccess,
    suggestions: generateSuggestions(location.pathname),
    navigate: navigateTo,
    goBack,
    goForward,
    addToQuickAccess,
    removeFromQuickAccess
  };
}
