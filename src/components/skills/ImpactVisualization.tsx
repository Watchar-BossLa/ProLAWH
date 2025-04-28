
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImpactCategory {
  category: string;
  value: number;
  color: string;
}

interface ImpactVisualizationProps {
  environmentalImpact: ImpactCategory[];
  totalReduction: number;
}

export function ImpactVisualization({ environmentalImpact, totalReduction }: ImpactVisualizationProps) {
  const handleShareClick = () => {
    // In a real implementation, this would generate a shareable link
    navigator.clipboard.writeText(`I've reduced ${totalReduction}kg of CO2 through my green skills!`)
      .then(() => {
        toast({
          title: "Link copied to clipboard",
          description: "Share your environmental impact with others"
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  const handleDownloadClick = () => {
    // In a real implementation, this would generate a PDF report
    toast({
      title: "Impact Report Generated",
      description: "Your environmental impact report has been downloaded"
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Environmental Impact</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShareClick}>
            <Share className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadClick}>
            <Download className="h-4 w-4 mr-1" />
            Report
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-green-600">{totalReduction}kg</span>
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              CO2 Reduction
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Estimated annual environmental impact</p>
        </div>
        
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={environmentalImpact}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                nameKey="category"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {environmentalImpact.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value}kg CO2`, name]}
                labelFormatter={() => ''}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="text-xs text-center text-muted-foreground">
          This visualization represents your estimated CO2 reduction through green skill applications.
          <br />
          Impact is calculated based on industry averages and your reported activities.
        </div>
      </CardContent>
    </Card>
  );
}
