
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { toast } from "@/components/ui/use-toast";

export function AdminLayout() {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin area.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar>
          <AdminSidebar />
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
