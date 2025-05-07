
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  BarChart as RechartsBarChart, 
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";

import { cn } from "@/lib/utils";

interface ChartProps {
  children?: React.ReactNode;
  className?: string;
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("aspect-[4/3] w-full p-4", className)}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        <div className="h-full w-full">{children}</div>
      </ResponsiveContainer>
    </div>
  )
);
Chart.displayName = "Chart";

interface ChartTooltipProps {
  className?: string;
  content?: React.ReactElement | ((props: any) => React.ReactNode);
}

const ChartTooltip = React.forwardRef<
  React.ElementRef<typeof RechartsTooltip>,
  ChartTooltipProps
>(({ className, content, ...props }, ref) => (
  <RechartsTooltip
    ref={ref}
    content={content || <CustomTooltip />}
    cursor={false}
    wrapperClassName={cn(className)}
    {...props}
  />
));
ChartTooltip.displayName = "ChartTooltip";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Value
            </span>
            <span className="font-bold text-muted-foreground">
              {payload[0].value}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Date
            </span>
            <span className="font-bold">{label}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// PieChart Component
interface PieChartProps {
  data: Array<any>;
  valueKey: string;
  categoryKey: string;
  colors?: string[];
}

const PieChart = ({
  data,
  valueKey,
  categoryKey,
  colors = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
}: PieChartProps) => {
  return (
    <RechartsPieChart width={400} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={100}
        fill="#8884d8"
        dataKey={valueKey}
        nameKey={categoryKey}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <ChartTooltip />
    </RechartsPieChart>
  );
};

// LineChart Component
interface LineChartProps {
  data: Array<any>;
  valueKey: string;
  categoryKey: string;
  colors?: string[];
}

const LineChart = ({
  data,
  valueKey,
  categoryKey,
  colors = ["#2563eb"]
}: LineChartProps) => {
  return (
    <RechartsLineChart data={data}>
      <XAxis dataKey={categoryKey} stroke="#888888" />
      <YAxis stroke="#888888" />
      <CartesianGrid strokeDasharray="3 3" />
      <Line
        type="monotone"
        dataKey={valueKey}
        stroke={colors[0]}
        activeDot={{ r: 8 }}
      />
      <ChartTooltip />
    </RechartsLineChart>
  );
};

// BarChart Component
interface BarChartProps {
  data: Array<any>;
  valueKey: string;
  categoryKey: string;
  colors?: string[];
}

const BarChart = ({
  data,
  valueKey,
  categoryKey,
  colors = ["#2563eb"]
}: BarChartProps) => {
  return (
    <RechartsBarChart data={data}>
      <XAxis dataKey={categoryKey} stroke="#888888" />
      <YAxis stroke="#888888" />
      <CartesianGrid strokeDasharray="3 3" />
      <Bar dataKey={valueKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
      <ChartTooltip />
    </RechartsBarChart>
  );
};

export {
  Chart,
  ChartTooltip,
  PieChart,
  LineChart,
  BarChart
};
