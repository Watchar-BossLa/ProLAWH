
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TypeData {
  name: string;
  value: number;
}

interface TypeDistributionChartProps {
  data: TypeData[];
}

export function TypeDistributionChart({ data }: TypeDistributionChartProps) {
  if (data.length === 0) {
    return (
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Recommendation Types</CardTitle>
          <CardDescription>Distribution by recommendation category</CardDescription>
        </CardHeader>
        <CardContent>
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
        <CardTitle>Recommendation Types</CardTitle>
        <CardDescription>Distribution by recommendation category</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => [`${value} recommendations`, 'Count']} />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
