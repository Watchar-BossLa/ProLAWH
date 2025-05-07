
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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

interface ChartTooltipProps extends React.ComponentPropsWithoutRef<typeof Tooltip> {
  className?: string;
  // Fixed type issue: ChartTooltipProps now properly extends Tooltip props
  content?: React.ReactElement | ((props: any) => React.ReactNode);
}

const ChartTooltip = React.forwardRef<
  React.ElementRef<typeof Tooltip>,
  ChartTooltipProps
>(({ className, ...props }, ref) => (
  <Tooltip
    ref={ref}
    content={<CustomTooltip />}
    cursor={false}
    className={cn(className)}
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

export {
  Chart,
  ChartTooltip
};
