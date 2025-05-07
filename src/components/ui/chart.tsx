
import * as React from "react";
import {
  Area, AreaChart, Bar, CartesianGrid, Cell,
  Legend, Line, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Sector, XAxis, YAxis,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  Pie
} from "recharts";

// Type definitions
type ValueType = string | number | Array<string | number>;
type NameType = string | number;

// Chart components for export
export interface ChartTooltipContentProps {
  children: React.ReactNode;
}

export function ChartTooltipContent({ children }: ChartTooltipContentProps) {
  return (
    <div className="rounded-md border bg-background p-2 shadow-md">
      {children}
    </div>
  );
}

export interface ChartConfig {
  [key: string]: {
    label?: string;
    color?: string;
  };
}

export interface ChartTooltipProps {
  content?: (props: { active?: boolean; payload?: any[]; label?: string }) => React.ReactElement | null;
}

// Fix the typing for the recharts tooltip
export function ChartTooltip({ content }: ChartTooltipProps) {
  // The content is a function that returns a React element or null, not directly a React node
  return <RechartsTooltip content={content || undefined} />;
}

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: ChartConfig;
  children: React.ReactNode;
}

export function ChartContainer({
  config,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <div {...props}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

// PieChart Component
interface PieChartProps {
  data: Array<Record<string, any>>;
  valueKey: string;
  categoryKey: string;
  colors?: string[];
  className?: string;
}

export function PieChart({
  data,
  valueKey,
  categoryKey,
  colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"],
  className,
}: PieChartProps) {
  return (
    <div className={`w-full h-[300px] flex justify-center ${className}`}>
      <RechartsPieChart width={400} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey={valueKey}
          nameKey={categoryKey}
          label={(entry) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <RechartsTooltip formatter={(value: any) => [`${value}`, '']} />
        <Legend />
      </RechartsPieChart>
    </div>
  );
}

// LineChart Component
interface LineChartProps {
  data: Array<Record<string, any>>;
  valueKey: string;
  categoryKey: string;
  colors?: string[];
  className?: string;
}

export function LineChart({
  data,
  valueKey,
  categoryKey,
  colors = ["#0088FE"],
  className,
}: LineChartProps) {
  return (
    <div className={`w-full h-[300px] ${className}`}>
      <RechartsLineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={categoryKey} />
        <YAxis />
        <RechartsTooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={valueKey}
          stroke={colors[0]}
          activeDot={{ r: 8 }}
        />
      </RechartsLineChart>
    </div>
  );
}

// BarChart Component
interface BarChartProps {
  data: Array<Record<string, any>>;
  valueKey: string;
  categoryKey: string;
  colors?: string[];
  className?: string;
}

export function BarChart({
  data,
  valueKey,
  categoryKey,
  colors = ["#0088FE"],
  className,
}: BarChartProps) {
  return (
    <div className={`w-full h-[300px] ${className}`}>
      <RechartsBarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={categoryKey} />
        <YAxis />
        <RechartsTooltip />
        <Legend />
        <Bar dataKey={valueKey} fill={colors[0]} />
      </RechartsBarChart>
    </div>
  );
}
