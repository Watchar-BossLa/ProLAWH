
import { NetworkStats } from "@/types/network";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell,
  PieChart, 
  Pie, 
  Legend 
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NetworkMetricsProps {
  stats: NetworkStats;
}

export function NetworkMetrics({ stats }: NetworkMetricsProps) {
  const barData = [
    { name: "Mentors", value: stats.mentors, color: "#8b5cf6" },
    { name: "Peers", value: stats.peers, color: "#3b82f6" },
    { name: "Colleagues", value: stats.colleagues, color: "#10b981" },
  ];

  const pieData = [
    { name: "Mentors", value: stats.mentors, color: "#8b5cf6" },
    { name: "Peers", value: stats.peers, color: "#3b82f6" },
    { name: "Colleagues", value: stats.colleagues, color: "#10b981" },
  ];

  // Calculate skill growth (mock data)
  const growthData = [
    { name: "Jan", growth: 5 },
    { name: "Feb", growth: 8 },
    { name: "Mar", growth: 12 },
    { name: "Apr", growth: 15 },
    { name: "May", growth: 20 },
    { name: "Jun", growth: 25 },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 rounded border shadow-sm">
          <p className="font-medium text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Network Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="breakdown">
          <TabsList className="mb-4 grid grid-cols-3">
            <TabsTrigger value="breakdown">Connection Types</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="growth">Network Growth</TabsTrigger>
          </TabsList>
          
          <TabsContent value="breakdown">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                >
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="distribution">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="growth">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={growthData}>
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip />
                <Bar 
                  dataKey="growth" 
                  fill="url(#growthGradient)" 
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
