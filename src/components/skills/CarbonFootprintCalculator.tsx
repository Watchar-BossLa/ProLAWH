
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Leaf, Globe, Car, Home, ShoppingBag, Bus, Sun, Recycle } from "lucide-react";
import { useCarbonFootprint } from '@/hooks/useCarbonFootprint';
import { Skeleton } from '@/components/ui/skeleton';

export function CarbonFootprintCalculator() {
  const { 
    activities, 
    handleValueChange, 
    calculateTotalImpact, 
    saveResults,
    isLoading,
    isSaving
  } = useCarbonFootprint();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'car': return <Car className="h-4 w-4 text-blue-500" />;
      case 'home': return <Home className="h-4 w-4 text-yellow-500" />;
      case 'shopping-bag': return <ShoppingBag className="h-4 w-4 text-red-500" />;
      case 'leaf': return <Leaf className="h-4 w-4 text-green-500" />;
      case 'bus': return <Bus className="h-4 w-4 text-purple-500" />;
      case 'sun': return <Sun className="h-4 w-4 text-amber-500" />;
      case 'recycle': return <Recycle className="h-4 w-4 text-teal-500" />;
      default: return <Globe className="h-4 w-4 text-sky-500" />;
    }
  };

  const totalImpact = calculateTotalImpact();
  const isPositiveImpact = totalImpact < 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Carbon Footprint Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-[300px] w-full" />
          <Separator />
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-[150px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Carbon Footprint Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4 mb-4">
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getIcon(activity.icon)}
                    <div>
                      <div className="font-medium">{activity.name}</div>
                      <div className="text-xs text-muted-foreground">{activity.category}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {activity.value} {activity.unit}/{activity.frequency}
                  </div>
                </div>
                <Slider 
                  min={0} 
                  max={activity.maxValue} 
                  step={1} 
                  value={[activity.value]} 
                  onValueChange={(value) => handleValueChange(index, value[0])}
                />
                <div className="text-xs text-right text-muted-foreground">
                  Impact: {(activity.impactPerUnit * activity.value).toFixed(1)} kg CO2e/{activity.frequency}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <Separator className="my-4" />
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-muted-foreground">Monthly Carbon Impact</div>
            <div className={`text-2xl font-bold ${isPositiveImpact ? 'text-green-600' : 'text-amber-600'}`}>
              {isPositiveImpact ? "-" : ""}{Math.abs(totalImpact).toFixed(1)} kg CO2e
            </div>
          </div>
          <div>
            <Button onClick={saveResults} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Results"}
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Negative values represent carbon reduction due to sustainable choices.
        </div>
      </CardContent>
    </Card>
  );
}
