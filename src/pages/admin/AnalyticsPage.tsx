
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { MockData } from "@/types/mocks";

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

  const findMetric = (name: string): number => {
    if (!metrics || !Array.isArray(metrics)) return 0;
    
    const metric = metrics.find(m => {
      if (typeof m === 'object' && m !== null) {
        return (m as MockData).metric_name === name;
      }
      return false;
    });
    
    return metric ? ((metric as MockData).metric_value || 0) : 0;
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">System Analytics</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{findMetric('total_users')}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Active Users</h3>
          <p className="text-3xl font-bold">{findMetric('active_users')}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Revenue</h3>
          <p className="text-3xl font-bold">${findMetric('total_revenue')}</p>
        </Card>
      </div>
    </div>
  );
}
