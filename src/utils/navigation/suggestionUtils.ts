import type { NavigationSuggestion } from '@/types/navigation';

export function generateNavigationSuggestions(currentPath: string): NavigationSuggestion[] {
  const suggestions: NavigationSuggestion[] = [];

  // Context-based suggestions
  if (currentPath === '/dashboard') {
    suggestions.push(
      {
        id: 'start-learning',
        title: 'Start Learning',
        description: 'Explore courses and learning paths',
        path: '/dashboard/learning',
        reason: 'Popular action from dashboard',
        priority: 1,
      },
      {
        id: 'view-skills',
        title: 'View Skills',
        description: 'Check your skill progress and badges',
        path: '/dashboard/skills',
        reason: 'Track your progress',
        priority: 2,
      }
    );
  }

  if (currentPath.includes('/learning')) {
    suggestions.push(
      {
        id: 'skills-assessment',
        title: 'Skills Assessment',
        description: 'Test your knowledge and earn badges',
        path: '/dashboard/skills',
        reason: 'Related to learning',
        priority: 1,
      }
    );
  }

  return suggestions.sort((a, b) => a.priority - b.priority);
}