
export interface RouteConfig {
  title: string;
  parent?: string;
}

export const routeConfig: Record<string, RouteConfig> = {
  '/dashboard': { title: 'Dashboard' },
  '/dashboard/home': { title: 'Home', parent: '/dashboard' },
  '/dashboard/learning': { title: 'Learning', parent: '/dashboard' },
  '/dashboard/opportunities': { title: 'Opportunities', parent: '/dashboard' },
  '/dashboard/network': { title: 'Network', parent: '/dashboard' },
  '/dashboard/mentorship': { title: 'Mentorship', parent: '/dashboard' },
  '/dashboard/skills': { title: 'Skills & Badges', parent: '/dashboard' },
  '/dashboard/green-skills': { title: 'Green Skills', parent: '/dashboard' },
  '/dashboard/career-twin': { title: 'Career Twin', parent: '/dashboard' },
  '/dashboard/arcade': { title: 'Arcade', parent: '/dashboard' },
  '/dashboard/staking': { title: 'Skill Staking', parent: '/dashboard' },
  '/dashboard/veriskill': { title: 'VeriSkill Network', parent: '/dashboard' },
  '/dashboard/study-bee': { title: 'StudyBee', parent: '/dashboard' },
  '/dashboard/quantum-matching': { title: 'Quantum Matching', parent: '/dashboard' },
  '/dashboard/quorumforge': { title: 'QuorumForge', parent: '/dashboard' },
  '/dashboard/enhanced-ai': { title: 'Enhanced AI', parent: '/dashboard' },
  '/dashboard/collaboration': { title: 'Collaboration', parent: '/dashboard' },
  '/dashboard/community': { title: 'Community', parent: '/dashboard' },
  '/dashboard/study-groups': { title: 'Study Groups', parent: '/dashboard' },
  '/dashboard/chat': { title: 'Real-Time Chat', parent: '/dashboard' },
};
