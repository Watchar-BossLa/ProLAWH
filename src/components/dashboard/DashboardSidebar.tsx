
import { useAuth } from "@/hooks/useAuth";
import { Brain, Briefcase, GraduationCap, Leaf, Coins, Gamepad2, Contrast, ActivitySquare } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAccessibility } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import { HighContrastContainer } from "@/components/ui/high-contrast";

export default function DashboardSidebar() {
  const { user } = useAuth();
  const { highContrast, toggleHighContrast, reducedMotion, toggleReducedMotion } = useAccessibility();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: GraduationCap, end: true },
    { to: "/dashboard/projects", label: "Projects", icon: Briefcase },
    { to: "/dashboard/career-twin", label: "Career Twin", icon: Brain },
    { to: "/dashboard/green-skills", label: "Green Skills", icon: Leaf },
    { to: "/dashboard/skill-staking", label: "Skill Staking", icon: Coins },
    { to: "/dashboard/arcade", label: "Nano Arcade", icon: Gamepad2 },
  ];

  return (
    <div className="h-full flex flex-col" role="navigation">
      <div className="space-y-4 py-4 flex-grow">
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold tracking-tight">
            {user ? `Welcome, ${user.email?.split("@")[0]}` : "Dashboard"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Navigate your learning journey
          </p>
        </div>

        <nav className="space-y-1 px-2" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`
              }
              end={item.end}
            >
              <item.icon className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="px-4 py-4 border-t">
        <div className="space-y-2">
          <h3 className="text-sm font-medium" id="accessibility-heading">Accessibility</h3>
          <div className="space-y-2" aria-labelledby="accessibility-heading">
            <Button 
              onClick={toggleHighContrast} 
              variant="outline" 
              size="sm"
              className="w-full justify-start"
              aria-pressed={highContrast}
            >
              <Contrast className="mr-2 h-4 w-4" aria-hidden="true" />
              {highContrast ? "Standard Contrast" : "High Contrast"}
            </Button>
            
            <Button 
              onClick={toggleReducedMotion} 
              variant="outline" 
              size="sm"
              className="w-full justify-start"
              aria-pressed={reducedMotion}
            >
              <ActivitySquare className="mr-2 h-4 w-4" aria-hidden="true" />
              {reducedMotion ? "Enable Animations" : "Reduce Motion"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
