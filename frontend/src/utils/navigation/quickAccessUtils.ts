
import type { QuickAccessItem } from '@/types/navigation';

export function getDefaultQuickAccess(): QuickAccessItem[] {
  return [
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
}
