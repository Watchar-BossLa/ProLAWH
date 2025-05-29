
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface StatusDistributionChartProps {
  data: StatusData[];
}

export function StatusDistributionChart({ data }: StatusDistributionChartProps) {
  if (data.length === 0) {
    return (
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Recommendation Status</CardTitle>
          <CardDescription>Distribution of your recommendations by status</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="h-[250px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Recommendation Status</CardTitle>
        <CardDescription>Distribution of your recommendations by status</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} recommendations`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
