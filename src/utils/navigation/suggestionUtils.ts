
import type { NavigationSuggestion } from '@/types/navigation';

export function generateNavigationSuggestions(currentPath: string): NavigationSuggestion[] {
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
}
