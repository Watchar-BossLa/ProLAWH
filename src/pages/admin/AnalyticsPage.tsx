
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function AnalyticsPage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["system-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">System Analytics</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">
            {metrics?.find(m => m.metric_name === 'total_users')?.metric_value || 0}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Active Users</h3>
          <p className="text-3xl font-bold">
            {metrics?.find(m => m.metric_name === 'active_users')?.metric_value || 0}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Revenue</h3>
          <p className="text-3xl font-bold">
            ${metrics?.find(m => m.metric_name === 'total_revenue')?.metric_value || 0}
          </p>
        </Card>
      </div>
    </div>
  );
}
