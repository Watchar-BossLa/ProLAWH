
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { MockData } from "@/types/mocks";

export default function SettingsPage() {
  const { data: adminUsers, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">System Settings</h1>
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Admin Users</h3>
          <div className="space-y-2">
            {adminUsers?.map((admin: MockData) => (
              <div key={admin.id} className="flex items-center justify-between p-2 bg-secondary rounded">
                <span>{admin.id}</span>
                <span className="px-2 py-1 bg-primary text-primary-foreground rounded text-sm">
                  {admin.role || "Admin"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
