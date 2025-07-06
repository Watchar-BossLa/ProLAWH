
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSmartBreadcrumbs } from './useSmartBreadcrumbs';
import type { QuickAccessItem, NavigationSuggestion } from '@/types/navigation';

interface ContextualNavigation {
  suggestions: NavigationSuggestion[];
  quickActions: QuickAccessItem[];
  workflowHints: string[];
}

export function useContextualNavigation(): ContextualNavigation {
  const location = useLocation();
  const { journeyInsights } = useSmartBreadcrumbs();

  const contextualData = useMemo((): ContextualNavigation => {
    const currentPath = location.pathname;
    
    // Generate context-aware suggestions based on current page
    const suggestions: NavigationSuggestion[] = [];
    const quickActions: QuickAccessItem[] = [];
    const workflowHints: string[] = [];

    // Learning page context
    if (currentPath.includes('/learning')) {
      suggestions.push({
        id: 'skills-from-learning',
        title: 'Skills & Badges',
        description: 'Track progress and earn certifications',
        path: '/dashboard/skills',
        reason: 'Complete your learning journey',
        priority: 90
      });
      
      quickActions.push({
        id: 'my-courses',
        title: 'My Courses',
        description: 'Continue learning',
        path: '/dashboard/learning',
        icon: 'book-open',
        category: 'recent'
      });

      workflowHints.push('Complete courses to unlock skill badges');
    }

    // Skills page context
    if (currentPath.includes('/skills')) {
      suggestions.push({
        id: 'opportunities-from-skills',
        title: 'Opportunities',
        description: 'Find roles matching your skills',
        path: '/dashboard/opportunities',
        reason: 'Leverage your certified skills',
        priority: 85
      });

      quickActions.push({
        id: 'skill-staking',
        title: 'Skill Staking',
        description: 'Stake your verified skills',
        path: '/dashboard/staking',
        icon: 'coins',
        category: 'suggested'
      });

      workflowHints.push('Stake verified skills to increase earning potential');
    }

    // Opportunities page context
    if (currentPath.includes('/opportunities')) {
      suggestions.push({
        id: 'network-from-opportunities',
        title: 'Network',
        description: 'Connect with professionals in these roles',
        path: '/dashboard/network',
        reason: 'Build connections for career growth',
        priority: 80
      });

      quickActions.push({
        id: 'green-skills',
        title: 'Green Skills',
        description: 'Develop sustainable expertise',
        path: '/dashboard/green-skills',
        icon: 'leaf',
        category: 'suggested'
      });

      workflowHints.push('Network with professionals to get insider insights');
    }

    // Network page context
    if (currentPath.includes('/network')) {
      suggestions.push({
        id: 'mentorship-from-network',
        title: 'Mentorship',
        description: 'Request mentorship from connections',
        path: '/dashboard/mentorship',
        reason: 'Get guidance from your network',
        priority: 88
      });

      quickActions.push({
        id: 'chat',
        title: 'Real-Time Chat',
        description: 'Message your connections',
        path: '/dashboard/chat',
        icon: 'message-square',
        category: 'frequent'
      });

      workflowHints.push('Engage regularly to strengthen professional relationships');
    }

    // Add suggestions based on user journey patterns
    if (journeyInsights.mostVisited.length > 0) {
      const topPage = journeyInsights.mostVisited[0];
      if (topPage.path !== currentPath) {
        suggestions.push({
          id: 'return-to-frequent',
          title: 'Return to Frequent Page',
          description: `Go back to ${topPage.path.split('/').pop()?.replace('-', ' ')}`,
          path: topPage.path,
          reason: 'You spend a lot of time here',
          priority: 75
        });
      }
    }

    return {
      suggestions: suggestions.sort((a, b) => b.priority - a.priority),
      quickActions,
      workflowHints
    };
  }, [currentPath, journeyInsights]);

  return contextualData;
}
