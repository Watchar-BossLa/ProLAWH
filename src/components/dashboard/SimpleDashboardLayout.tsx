import React, { useState } from 'react';
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { CONFIG, ENV } from "@/config";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Home,
  BookOpen,
  Users,
  Trophy,
  Brain,
  Menu,
  Settings,
  LogOut,
  Zap,
  UserCheck,
  Briefcase,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Bot,
  Atom,
  Leaf,
  Grid3X3,
  MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

const navigationItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard", type: "simple" },
  { icon: BookOpen, label: "Learning", href: "/dashboard/learning", type: "simple" },
  { icon: Trophy, label: "Skills & Badges", href: "/dashboard/skills", type: "simple" },
  { icon: UserCheck, label: "Mentorship", href: "/dashboard/mentorship", type: "simple" },
  { icon: Briefcase, label: "Opportunities", href: "/dashboard/opportunities", type: "simple" },
  { icon: Users, label: "Network", href: "/dashboard/network", type: "simple" },
  { icon: MessageSquare, label: "Social & Collaboration", href: "/dashboard/collaboration", type: "simple" },
  { 
    icon: Bot, 
    label: "AI & Quantum", 
    type: "expandable",
    children: [
      { icon: Brain, label: "Enhanced AI Dashboard", href: "/dashboard/ai-enhanced" },
      { icon: Atom, label: "Quantum Matching", href: "/dashboard/quantum-matching" },
      { icon: Brain, label: "Career Twin", href: "/dashboard/career-twin" },
    ]
  },
  { 
    icon: Leaf, 
    label: "Green Economy", 
    type: "expandable",
    children: [
      { icon: Leaf, label: "Green Skills", href: "/dashboard/green-skills" },
      { icon: Leaf, label: "Sustainability", href: "/dashboard/sustainability" },
    ]
  },
  { 
    icon: Grid3X3, 
    label: "Platforms", 
    type: "expandable",
    children: [
      { icon: Zap, label: "Arcade", href: "/dashboard/arcade" },
      { icon: Grid3X3, label: "Learning Platforms", href: "/dashboard/platforms" },
    ]
  },
  { icon: MessageCircle, label: "Real-Time Chat", href: "/dashboard/chat", type: "simple" },
];

function Sidebar({ className, onItemClick }: { className?: string; onItemClick?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>(['AI & Quantum']);

  const handleNavigation = (href: string) => {
    navigate(href);
    onItemClick?.();
  };

  const toggleSection = (sectionLabel: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionLabel)
        ? prev.filter(s => s !== sectionLabel)
        : [...prev, sectionLabel]
    );
  };

  const renderNavigationItem = (item: any) => {
    if (item.type === "expandable") {
      const isExpanded = expandedSections.includes(item.label);
      return (
        <div key={item.label} className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-between text-left"
            onClick={() => toggleSection(item.label)}
          >
            <div className="flex items-center">
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </div>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          {isExpanded && (
            <div className="ml-6 space-y-1">
              {item.children.map((child: any) => (
                <Button
                  key={child.href}
                  variant={location.pathname === child.href ? "default" : "ghost"}
                  className="w-full justify-start text-sm"
                  onClick={() => handleNavigation(child.href)}
                >
                  <child.icon className="mr-2 h-4 w-4" />
                  {child.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <Button
          key={item.href}
          variant={location.pathname === item.href ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleNavigation(item.href)}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.label}
        </Button>
      );
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-card border-r", className)}>
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold">ProLAWH</h1>
        <p className="text-sm text-muted-foreground">Learning & Workforce Hub</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map(renderNavigationItem)}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/profile")}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export function SimpleDashboardLayout() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Skip auth check in development mode if bypass is enabled
  if (!ENV.isProduction && CONFIG.BYPASS_AUTH) {
    // Allow access in development bypass mode
  } else if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-64">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <h2 className="text-lg font-semibold">Dashboard</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Welcome, {user?.user_metadata?.full_name || user?.email || 'User'}
              </span>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
        
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar onItemClick={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}