
import { useAuth } from "@/hooks/useAuth";
import { Brain, Briefcase, GraduationCap } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function DashboardSidebar() {
  const { user } = useAuth();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: GraduationCap },
    { to: "/dashboard/projects", label: "Projects", icon: Briefcase },
    { to: "/dashboard/career-twin", label: "Career Twin", icon: Brain },
  ];

  return (
    <div className="h-full border-r bg-muted/40 w-64 hidden md:block overflow-y-auto">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold tracking-tight">
            {user ? `Welcome, ${user.email?.split("@")[0]}` : "Dashboard"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Navigate your learning journey
          </p>
        </div>

        <nav className="space-y-1 px-2">
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
              end={item.to === "/dashboard"}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
