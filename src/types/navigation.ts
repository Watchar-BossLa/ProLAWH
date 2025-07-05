
export interface NavigationItem {
  id: string;
  path: string;
  title: string;
  timestamp: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface QuickAccessItem {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: string;
  category: 'recent' | 'frequent' | 'suggested';
}

export interface NavigationSuggestion {
  id: string;
  title: string;
  description: string;
  path: string;
  reason: string;
  priority: number;
}

export interface NavigationContextType {
  history: NavigationItem[];
  currentPath: string;
  breadcrumbs: BreadcrumbItem[];
  canGoBack: boolean;
  canGoForward: boolean;
  quickAccess: QuickAccessItem[];
  suggestions: NavigationSuggestion[];
  navigate: (path: string, title?: string) => void;
  goBack: () => void;
  goForward: () => void;
  addToQuickAccess: (item: QuickAccessItem) => void;
  removeFromQuickAccess: (id: string) => void;
}
