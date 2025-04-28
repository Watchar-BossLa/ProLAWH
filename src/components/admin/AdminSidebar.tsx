
import { useAdmin } from "@/hooks/useAdmin";
import { useNavigate } from "react-router-dom";
import { Users, BarChart, CreditCard, Settings } from "lucide-react";

export function AdminSidebar() {
  const { hasRole } = useAdmin();
  const navigate = useNavigate();

  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Admin Dashboard</h2>
        <div className="space-y-1">
          {hasRole("super_admin") && (
            <button
              onClick={() => navigate("/admin/users")}
              className="flex w-full items-center py-2 px-4 hover:bg-gray-100 rounded-lg"
            >
              <Users className="mr-2 h-4 w-4" />
              User Management
            </button>
          )}
          {(hasRole("super_admin") || hasRole("system_admin")) && (
            <button
              onClick={() => navigate("/admin/analytics")}
              className="flex w-full items-center py-2 px-4 hover:bg-gray-100 rounded-lg"
            >
              <BarChart className="mr-2 h-4 w-4" />
              System Analytics
            </button>
          )}
          {(hasRole("super_admin") || hasRole("finance_admin")) && (
            <button
              onClick={() => navigate("/admin/payments")}
              className="flex w-full items-center py-2 px-4 hover:bg-gray-100 rounded-lg"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Payment Management
            </button>
          )}
          {hasRole("super_admin") && (
            <button
              onClick={() => navigate("/admin/settings")}
              className="flex w-full items-center py-2 px-4 hover:bg-gray-100 rounded-lg"
            >
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
