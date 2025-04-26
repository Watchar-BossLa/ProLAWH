
import { NetworkStats } from "@/types/network";
import { Card, CardContent } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface NetworkMetricsProps {
  stats: NetworkStats;
}

export function NetworkMetrics({ stats }: NetworkMetricsProps) {
  const data = [
    { name: "Mentors", value: stats.mentors },
    { name: "Peers", value: stats.peers },
    { name: "Colleagues", value: stats.colleagues },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
