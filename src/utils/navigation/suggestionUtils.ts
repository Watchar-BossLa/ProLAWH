import type { NavigationSuggestion } from '@/types/navigation';

const suggestions: Record<string, NavigationSuggestion[]> = {
  '/dashboard': [
    {
      id: 'learning-suggestion',
      title: 'Start Learning',
      description: 'Explore courses and skill development',
      path: '/dashboard/learning',
      reason: 'Continue your learning journey',
      priority: 1
    },
    {
      id: 'network-suggestion',
      title: 'Build Network',
      description: 'Connect with professionals in your field',
      path: '/dashboard/network',
      reason: 'Expand your professional network',
      priority: 2
    }
  ],
  '/dashboard/learning': [
    {
      id: 'skills-suggestion',
      title: 'View Skills',
      description: 'Check your progress and badges',
      path: '/dashboard/skills',
      reason: 'Track your skill development',
      priority: 1
    }
  ],
  '/dashboard/network': [
    {
      id: 'mentorship-suggestion',
      title: 'Find Mentors',
      description: 'Connect with experienced professionals',
      path: '/dashboard/mentorship',
      reason: 'Accelerate your growth with mentorship',
      priority: 1
    }
  ]
};

export function generateNavigationSuggestions(pathname: string): NavigationSuggestion[] {
  return suggestions[pathname] || [];
}