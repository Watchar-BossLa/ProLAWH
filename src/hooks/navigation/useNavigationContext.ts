
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateBreadcrumbs } from '@/utils/navigation/breadcrumbUtils';
import { generateNavigationSuggestions } from '@/utils/navigation/suggestionUtils';
import { getDefaultQuickAccess } from '@/utils/navigation/quickAccessUtils';
import type { NavigationItem, QuickAccessItem } from '@/types/navigation';

const MAX_HISTORY_ITEMS = 50;

export function useNavigationContext() {
  const location = useLocation();
  const navigate = useNavigate();
  const [history, setHistory] = useState<NavigationItem[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [quickAccess, setQuickAccess] = useState<QuickAccessItem[]>([]);

  // Add item to navigation history
  const addToHistory = useCallback((path: string, title?: string) => {
    const newItem: NavigationItem = {
      id: crypto.randomUUID(),
      path,
      title: title || generateBreadcrumbs(path).pop()?.label || path,
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
      return [item, ...filtered].slice(0, 10);
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
      setQuickAccess(getDefaultQuickAccess());
    }
  }, [quickAccess.length]);

  return {
    history,
    currentPath: location.pathname,
    breadcrumbs: generateBreadcrumbs(location.pathname),
    canGoBack: currentHistoryIndex < history.length - 1,
    canGoForward: currentHistoryIndex > 0,
    quickAccess,
    suggestions: generateNavigationSuggestions(location.pathname),
    navigate: navigateTo,
    goBack,
    goForward,
    addToQuickAccess,
    removeFromQuickAccess
  };
}
