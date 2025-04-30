
import { Outlet } from 'react-router-dom';
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { 
  SidebarProvider,
  Sidebar 
} from "@/components/ui/sidebar";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <DashboardSidebar />
        </Sidebar>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
