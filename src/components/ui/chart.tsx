
// This file provides reusable chart components using recharts

import React from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

// Custom tooltip formatter
const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-2 rounded-md shadow-sm text-sm">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={`tooltip-${index}`} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Bar Chart Component
interface BarChartProps {
  data: any[];
  valueKey: string;
  categoryKey: string;
  colors?: string[];
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  valueKey, 
  categoryKey, 
  colors = ["#2563eb"], 
  height = 300 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis 
          dataKey={categoryKey} 
          tick={{ fill: "var(--muted-foreground)" }}
          axisLine={{ stroke: "var(--border)" }}
        />
        <YAxis 
          tick={{ fill: "var(--muted-foreground)" }}
          axisLine={{ stroke: "var(--border)" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={valueKey} fill={colors[0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

// Line Chart Component
interface LineChartProps {
  data: any[];
  valueKey: string;
  categoryKey: string;
  colors?: string[];
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  valueKey, 
  categoryKey, 
  colors = ["#2563eb"], 
  height = 300 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis 
          dataKey={categoryKey}
          tick={{ fill: "var(--muted-foreground)" }}
          axisLine={{ stroke: "var(--border)" }}
        />
        <YAxis 
          tick={{ fill: "var(--muted-foreground)" }}
          axisLine={{ stroke: "var(--border)" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey={valueKey} 
          stroke={colors[0]} 
          strokeWidth={2}
          dot={{ r: 4 }} 
          activeDot={{ r: 6, stroke: "var(--background)", strokeWidth: 2 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

// Pie Chart Component
interface PieChartProps {
  data: any[];
  valueKey: string;
  categoryKey: string;
  colors?: string[];
  height?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  valueKey, 
  categoryKey, 
  colors = ["#2563eb", "#d97706", "#059669", "#7c3aed", "#e11d48"], 
  height = 300 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          innerRadius={40}
          fill="#8884d8"
          dataKey={valueKey}
          nameKey={categoryKey}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
