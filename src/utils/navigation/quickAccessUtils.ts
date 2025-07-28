import type { QuickAccessItem } from '@/types/navigation';

export function getDefaultQuickAccess(): QuickAccessItem[] {
  return [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Your main dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      category: 'frequent'
    },
    {
      id: 'learning',
      title: 'Learning',
      description: 'Courses and skill development',
      path: '/dashboard/learning',
      icon: 'BookOpen',
      category: 'frequent'
    },
    {
      id: 'network',
      title: 'Network',
      description: 'Professional connections',
      path: '/dashboard/network',
      icon: 'Users',
      category: 'frequent'
    },
    {
      id: 'opportunities',
      title: 'Opportunities',
      description: 'Job and project opportunities',
      path: '/dashboard/opportunities',
      icon: 'Briefcase',
      category: 'suggested'
    }
  ];
}