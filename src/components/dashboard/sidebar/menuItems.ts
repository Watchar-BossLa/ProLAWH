
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Users,
  Briefcase,
  Star,
  Gamepad2,
  Brain,
  Leaf,
  Coins,
  Target,
  Network,
  Zap,
  Atom,
  LucideIcon
} from "lucide-react";

export interface MenuItem {
  title: string;
  icon: LucideIcon;
  href?: string;
  items?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Learning",
    icon: BookOpen,
    href: "/dashboard/learning",
  },
  {
    title: "Skills & Badges",
    icon: Trophy,
    href: "/dashboard/skills",
  },
  {
    title: "Mentorship",
    icon: Users,
    href: "/dashboard/mentorship",
  },
  {
    title: "Opportunities",
    icon: Briefcase,
    href: "/dashboard/opportunities",
  },
  {
    title: "Network",
    icon: Network,
    href: "/dashboard/network",
  },
  {
    title: "AI & Quantum",
    icon: Atom,
    items: [
      {
        title: "Quantum Matching",
        icon: Atom,
        href: "/dashboard/quantum-matching",
      },
      {
        title: "Career Twin",
        icon: Brain,
        href: "/dashboard/career-twin",
      },
    ]
  },
  {
    title: "Green Economy",
    icon: Leaf,
    items: [
      {
        title: "Green Skills",
        icon: Leaf,
        href: "/dashboard/green-skills",
      },
      {
        title: "Skill Staking",
        icon: Coins,
        href: "/dashboard/staking",
      },
    ]
  },
  {
    title: "Platforms",
    icon: Zap,
    items: [
      {
        title: "Arcade",
        icon: Gamepad2,
        href: "/dashboard/arcade",
      },
      {
        title: "StudyBee",
        icon: Target,
        href: "/dashboard/study-bee",
      },
      {
        title: "QuorumForge",
        icon: Zap,
        href: "/dashboard/quorumforge",
      },
      {
        title: "VeriSkill",
        icon: Star,
        href: "/dashboard/veriskill",
      },
    ]
  },
];
