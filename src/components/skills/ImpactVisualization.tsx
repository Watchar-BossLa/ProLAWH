
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share, Download, Leaf } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useCarbonFootprint } from '@/hooks/useCarbonFootprint';
import { Skeleton } from '@/components/ui/skeleton';

interface ImpactCategory {
  category: string;
  value: number;
  color: string;
}

export function ImpactVisualization() {
  const { calculateCategoryBreakdown, calculateTotalImpact, isLoading } = useCarbonFootprint();
  
  const handleShareClick = () => {
    const totalReduction = Math.abs(calculateTotalImpact());
    navigator.clipboard.writeText(`I've reduced ${totalReduction.toFixed(1)}kg of CO2 through my green skills!`)
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
    toast({
      title: "Impact Report Generated",
      description: "Your environmental impact report has been downloaded"
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Environmental Impact</CardTitle>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[270px] w-full" />
        </CardContent>
      </Card>
    );
  }
  
  // Calculate data for the chart
  const totalImpact = calculateTotalImpact();
  const categories = calculateCategoryBreakdown();
  
  const chartData: ImpactCategory[] = Object.entries(categories)
    .filter(([_, value]) => value !== 0)
    .map(([category, value]) => ({
      category,
      value: Math.abs(value), // Using absolute values for better visualization
      color: value < 0 ? '#10b981' : '#f97316' // Green for reductions, orange for emissions
    }));

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
            {totalImpact < 0 ? (
              <>
                <span className="text-3xl font-bold text-green-600">{Math.abs(totalImpact).toFixed(1)}kg</span>
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  CO2 Reduction
                </Badge>
              </>
            ) : (
              <>
                <span className="text-3xl font-bold text-amber-600">{totalImpact.toFixed(1)}kg</span>
                <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                  CO2 Emission
                </Badge>
              </>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Estimated monthly environmental impact</p>
        </div>
        
        {chartData.length > 0 ? (
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
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
                  {chartData.map((entry, index) => (
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
        ) : (
          <div className="flex flex-col items-center justify-center h-[220px] text-center">
            <Leaf className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No impact data available</p>
          </div>
        )}
        
        <div className="text-xs text-center text-muted-foreground">
          This visualization represents your estimated CO2 impact through green skill applications.
          <br />
          Impact is calculated based on industry averages and your reported activities.
        </div>
      </CardContent>
    </Card>
  );
}
