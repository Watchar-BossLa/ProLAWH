import type { BreadcrumbItem } from '@/types/navigation';

const pathMappings: Record<string, string> = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/dashboard/learning': 'Learning',
  '/dashboard/skills': 'Skills & Badges',
  '/dashboard/network': 'Network',
  '/dashboard/mentorship': 'Mentorship',
  '/dashboard/opportunities': 'Opportunities',
  '/dashboard/career-twin': 'Career Twin',
  '/dashboard/arcade': 'Arcade',
  '/dashboard/staking': 'Skill Staking',
  '/dashboard/study-bee': 'Study Bee',
  '/dashboard/veriskill': 'VeriSkill',
  '/dashboard/quantum-matching': 'Quantum Matching',
  '/dashboard/quorumforge': 'QuorumForge',
  '/dashboard/enhanced-ai': 'Enhanced AI',
  '/dashboard/sustainability': 'Sustainability',
  '/dashboard/collaboration': 'Collaboration',
  '/dashboard/community': 'Community',
  '/dashboard/study-groups': 'Study Groups',
  '/dashboard/chat': 'Chat',
  '/admin': 'Admin',
  '/admin/users': 'Users',
  '/admin/analytics': 'Analytics',
  '/admin/payments': 'Payments',
  '/admin/settings': 'Settings',
  '/profile': 'Profile',
  '/auth': 'Authentication',
};

export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Add home
  breadcrumbs.push({
    label: 'Home',
    href: '/',
    current: pathname === '/'
  });

  // Build path progressively
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;
    
    const label = pathMappings[currentPath] || 
      segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
      current: isLast
    });
  });

  return breadcrumbs;
}