import type { BreadcrumbItem } from '@/types/navigation';

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/learning': 'Learning',
  '/dashboard/skills': 'Skills & Badges',
  '/dashboard/network': 'Network',
  '/dashboard/mentorship': 'Mentorship',
  '/dashboard/opportunities': 'Opportunities',
  '/dashboard/collaboration': 'Collaboration',
  '/dashboard/ai-enhanced': 'Enhanced AI',
  '/dashboard/quantum-matching': 'Quantum Matching',
  '/dashboard/career-twin': 'Career Twin',
  '/dashboard/green-skills': 'Green Skills',
  '/dashboard/sustainability': 'Sustainability',
  '/dashboard/arcade': 'Arcade',
  '/dashboard/platforms': 'Learning Platforms',
  '/dashboard/chat': 'Real-Time Chat',
  '/admin': 'Admin',
  '/profile': 'Profile',
};

export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    breadcrumbs.push({
      label: routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1),
      href: isLast ? undefined : currentPath,
      current: isLast,
    });
  });

  return breadcrumbs;
}