
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
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
  ChevronDown,
  ChevronRight
} from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const menuItems = [
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

export function DashboardSidebar() {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<string[]>(['AI & Quantum']); // Default open

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="flex flex-col h-full">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-lg">ProLawh</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.items ? (
                  <Collapsible 
                    open={openSections.includes(item.title)}
                    onOpenChange={() => toggleSection(item.title)}
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full">
                        <div className="flex items-center gap-3 w-full">
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1 text-left">{item.title}</span>
                          {openSections.includes(item.title) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.href}>
                            <SidebarMenuSubButton 
                              asChild
                              isActive={isActive(subItem.href)}
                            >
                              <Link 
                                to={subItem.href}
                                className={cn(
                                  "flex items-center gap-3 w-full pl-6",
                                  isActive(subItem.href) && "bg-accent text-accent-foreground"
                                )}
                              >
                                <subItem.icon className="h-4 w-4" />
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive(item.href)}
                  >
                    <Link 
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 w-full",
                        isActive(item.href) && "bg-accent text-accent-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </div>
  );
}
