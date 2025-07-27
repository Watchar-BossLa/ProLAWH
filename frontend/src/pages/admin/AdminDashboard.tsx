
import { useAdmin } from "@/hooks/useAdmin";

export default function AdminDashboard() {
  const { currentAdminUser } = useAdmin();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-2">Welcome</h3>
          <p className="text-sm text-muted-foreground">
            You are logged in as: {currentAdminUser?.role}
          </p>
        </div>
      </div>
    </div>
  );
}
