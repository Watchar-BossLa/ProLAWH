import type { QuickAccessItem } from '@/types/navigation';

export function getDefaultQuickAccess(): QuickAccessItem[] {
  return [
    {
      id: 'dashboard-home',
      title: 'Dashboard',
      description: 'Your personalized dashboard',
      path: '/dashboard',
      icon: 'Home',
      category: 'frequent',
    },
    {
      id: 'learning-center',
      title: 'Learning Center',
      description: 'Explore courses and learning paths',
      path: '/dashboard/learning',
      icon: 'BookOpen',
      category: 'frequent',
    },
    {
      id: 'skills-badges',
      title: 'Skills & Badges',
      description: 'Track your skill progress',
      path: '/dashboard/skills',
      icon: 'Trophy',
      category: 'frequent',
    },
    {
      id: 'chat',
      title: 'Real-Time Chat',
      description: 'Connect with peers and mentors',
      path: '/dashboard/chat',
      icon: 'MessageCircle',
      category: 'suggested',
    },
  ];
}