
import { Outlet } from 'react-router-dom';
import { Sidebar } from "@/components/ui/sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
