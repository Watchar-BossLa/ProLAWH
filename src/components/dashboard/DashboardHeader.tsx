
import { Bell, Search, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useProductionAuth } from "@/components/auth/ProductionAuthProvider";
import { useDashboardLayoutContext } from "./layout/DashboardLayoutProvider";
import { TenantSwitcher } from "@/components/enterprise/TenantSwitcher";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SmartBreadcrumbNavigation } from "@/components/navigation/SmartBreadcrumbNavigation";
import { BreadcrumbNavigation } from "@/components/navigation/BreadcrumbNavigation";
import { BackForwardButtons } from "@/components/navigation/BackForwardButtons";
import { QuickNavigationPanel } from "@/components/navigation/QuickNavigationPanel";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { SemanticSearchBar } from "@/components/search/SemanticSearchBar";

export function DashboardHeader() {
  const { signOut } = useProductionAuth();
  const { user } = useDashboardLayoutContext();
  const { isEnabled } = useFeatureFlags();
  const navigate = useNavigate();
  const [quickNavOpen, setQuickNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const userInitials = user?.user_metadata?.full_name
    ?.split(" ")
    .map((name: string) => name[0])
    .join("")
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  // Keyboard shortcut for quick navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setQuickNavOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex h-16 items-center px-6 gap-4">
          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <BackForwardButtons />
            <div className="h-6 w-px bg-border mx-2" />
          </div>

          {/* Smart or Basic Breadcrumbs */}
          <div className="flex-1 max-w-md">
            {isEnabled('smartNavigation') ? (
              <SmartBreadcrumbNavigation />
            ) : (
              <BreadcrumbNavigation />
            )}
          </div>

          {/* AI-Enhanced Search */}
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            {isEnabled('aiEnhancedSearch') ? (
              <SemanticSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={(query) => console.log('Global search:', query)}
                placeholder="Search anything with AI..."
                className="flex-1"
              />
            ) : (
              <Button
                variant="outline"
                onClick={() => setQuickNavOpen(true)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search or jump to...</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuickNavOpen(true)}
              className="relative"
            >
              <Zap className="h-5 w-5" />
            </Button>
          </div>

          {/* Tenant Switcher */}
          <TenantSwitcher />

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name || "User"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.full_name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/admin/enterprise-security")}>
                Security Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <QuickNavigationPanel open={quickNavOpen} onOpenChange={setQuickNavOpen} />
    </>
  );
}
