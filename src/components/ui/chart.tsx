
import * as React from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, Sector, Tooltip, XAxis, YAxis } from "recharts";

// Type definitions
type ValueType = string | number | Array<string | number>;
type NameType = string | number;

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
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey={valueKey}
          nameKey={categoryKey}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}`, '']} />
        <Legend />
      </PieChart>
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
      <LineChart
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
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={valueKey}
          stroke={colors[0]}
          activeDot={{ r: 8 }}
        />
      </LineChart>
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
      <BarChart
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
        <Tooltip />
        <Legend />
        <Bar dataKey={valueKey} fill={colors[0]} />
      </BarChart>
    </div>
  );
}
