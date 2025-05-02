
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChartContainer,
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface SDGData {
  sdgNumber: number;
  name: string;
  alignment: number;
  color: string;
}

interface SDGAlignmentChartProps {
  sdgData: SDGData[];
}

export function SDGAlignmentChart({ sdgData }: SDGAlignmentChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          SDG Alignment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] mb-4">
          <ChartContainer
            config={{
              sdg: {
                label: 'SDG',
                color: '#10b981',
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sdgData}>
                <XAxis 
                  dataKey="sdgNumber" 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `${value}`}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                />
                <Bar dataKey="alignment">
                  {sdgData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as SDGData;
                      return (
                        <ChartTooltipContent>
                          <div className="p-2">
                            <div className="font-medium">SDG {data.sdgNumber}: {data.name}</div>
                            <div className="text-sm text-muted-foreground">Alignment: {data.alignment}%</div>
                          </div>
                        </ChartTooltipContent>
                      );
                    }
                    return null;
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <ScrollArea className="h-[100px]">
          <div className="grid grid-cols-4 gap-2 text-xs">
            {sdgData.map((sdg) => (
              <div key={sdg.sdgNumber} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sdg.color }}></div>
                <span>{sdg.sdgNumber}: {sdg.name}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
