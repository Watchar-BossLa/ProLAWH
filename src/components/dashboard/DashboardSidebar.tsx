import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useSidebar } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Leaf, Settings } from "lucide-react"

export function DashboardSidebar() {
  const { user, signOut } = useAuth()
  const { pathname } = useLocation()
  const { setOpen } = useSidebar()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    setIsSigningOut(false)
    setOpen(false)
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <Button variant="link" asChild>
            <NavLink to="/dashboard">ProLawh</NavLink>
          </Button>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Settings"
                isActive={pathname === "/dashboard/settings"}
              >
                <NavLink to="/dashboard/settings">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Green Skills */}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Green Skills"
                isActive={pathname === "/dashboard/green-skill-index"}
              >
                <NavLink to="/dashboard/green-skill-index">
                  <Leaf className="h-5 w-5" />
                  <span>Green-Skill Index</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 w-full justify-start">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image} alt={user?.name || "Avatar"} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="line-clamp-1 text-left">
                <div className="font-medium line-clamp-1">{user?.name}</div>
                <div className="text-muted-foreground text-sm line-clamp-1">
                  {user?.email}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end" forceMount>
            <DropdownMenuItem>
              <NavLink to="/dashboard/settings">Edit Profile</NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
              {isSigningOut ? "Signing Out..." : "Sign Out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
