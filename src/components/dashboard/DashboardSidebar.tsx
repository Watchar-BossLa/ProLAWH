
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useAdmin } from "@/hooks/useAdmin";
import { 
  Book, 
  GraduationCap, 
  Users,
  Network, 
  Trophy, 
  Briefcase, 
  BarChart, 
  LucideIcon, 
  Home, 
  Settings,
  Leaf,
  ShieldCheck,
  Brain,
  Wallet,
  School
} from 'lucide-react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
}

const NavItem = ({ icon: Icon, label, href, isActive }: NavItemProps) => {
  return (
    <Link 
      to={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-secondary"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

export function DashboardSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAdmin, isLoading } = useAdmin();

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Network, label: "Network", href: "/dashboard/network" },
    { icon: Book, label: "Learning Paths", href: "/dashboard/learning" },
    { icon: GraduationCap, label: "Skills & Badges", href: "/dashboard/skills" },
    { icon: Users, label: "Mentorship", href: "/dashboard/mentorship" },
    { icon: Briefcase, label: "Opportunities", href: "/dashboard/opportunities" },
    { icon: Trophy, label: "Nano-Arcade", href: "/dashboard/arcade" },
    { icon: BarChart, label: "Career Twin", href: "/dashboard/career-twin" },
    { icon: Leaf, label: "Green Skills", href: "/dashboard/green-skills" },
    { icon: School, label: "Campus Connector", href: "/dashboard/campus" },
    { icon: Book, label: "Study Bee", href: "/dashboard/study-bee" },
    { icon: Brain, label: "QuorumForge OS", href: "/dashboard/quorumforge" },
    { icon: Wallet, label: "VeriSkill Network", href: "/dashboard/veriskill" },
    { icon: Settings, label: "Settings", href: "/profile" }
  ];
  
  return (
    <nav className="w-64 border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-xl">ProLawh</h2>
        <p className="text-sm text-muted-foreground">Learning & Workforce Hub</p>
      </div>
      
      <div className="flex flex-col gap-1 p-2 flex-1">
        {navItems.map((item) => (
          <NavItem 
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={currentPath === item.href}
          />
        ))}
        
        {!isLoading && isAdmin && (
          <NavItem
            icon={ShieldCheck}
            label="Admin Dashboard"
            href="/admin"
            isActive={currentPath.startsWith("/admin")}
          />
        )}
      </div>
      
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-medium">PL</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">ProLawh User</span>
            <span className="text-xs text-muted-foreground">user@example.com</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
