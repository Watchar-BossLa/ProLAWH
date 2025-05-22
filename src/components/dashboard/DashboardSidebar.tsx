
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Code, Home, Settings, User, Users, Zap } from 'lucide-react';

export const DashboardSidebar: React.FC = () => {
  return (
    <div className="flex flex-col h-full py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">ProLawh</h2>
        <div className="space-y-1">
          <NavLink 
            to="/dashboard" 
            end
            className={({ isActive }) => 
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
                isActive ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground'
              }`
            }
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/dashboard/network" 
            className={({ isActive }) => 
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
                isActive ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground'
              }`
            }
          >
            <Users className="h-4 w-4" />
            <span>Network</span>
          </NavLink>
          
          <NavLink 
            to="/dashboard/quorumforge" 
            className={({ isActive }) => 
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
                isActive ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground'
              }`
            }
          >
            <Code className="h-4 w-4" />
            <span>QuorumForge OS</span>
          </NavLink>
          
          <NavLink 
            to="/dashboard/profile" 
            className={({ isActive }) => 
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
                isActive ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground'
              }`
            }
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </NavLink>
          
          <NavLink 
            to="/dashboard/settings" 
            className={({ isActive }) => 
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
                isActive ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground'
              }`
            }
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
