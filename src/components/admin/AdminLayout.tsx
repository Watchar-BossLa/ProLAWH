
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { Sidebar } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout() {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar>
        <AdminSidebar />
      </Sidebar>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
