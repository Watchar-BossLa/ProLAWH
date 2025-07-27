
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Leaf, Globe, Car, Home, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface CarbonActivity {
  name: string;
  category: string;
  icon: React.ReactNode;
  impactPerUnit: number;
  unit: string;
  frequency: string;
  value: number;
  maxValue: number;
}

export function CarbonFootprintCalculator() {
  const [activities, setActivities] = useState<CarbonActivity[]>([
    { 
      name: "Car Travel", 
      category: "Transportation", 
      icon: <Car className="h-4 w-4 text-blue-500" />, 
      impactPerUnit: 2.3, 
      unit: "km", 
      frequency: "weekly",
      value: 50,
      maxValue: 500
    },
    { 
      name: "Electricity Usage", 
      category: "Home", 
      icon: <Home className="h-4 w-4 text-yellow-500" />, 
      impactPerUnit: 0.5, 
      unit: "kWh", 
      frequency: "weekly",
      value: 100,
      maxValue: 300
    },
    { 
      name: "Meat Consumption", 
      category: "Food", 
      icon: <ShoppingBag className="h-4 w-4 text-red-500" />, 
      impactPerUnit: 6.0, 
      unit: "meals", 
      frequency: "weekly",
      value: 3,
      maxValue: 21
    },
    { 
      name: "Plant-Based Meals", 
      category: "Food", 
      icon: <Leaf className="h-4 w-4 text-green-500" />, 
      impactPerUnit: -1.5, 
      unit: "meals", 
      frequency: "weekly",
      value: 5,
      maxValue: 21
    },
    { 
      name: "Public Transit", 
      category: "Transportation", 
      icon: <Car className="h-4 w-4 text-purple-500" />, 
      impactPerUnit: -0.8, 
      unit: "trips", 
      frequency: "weekly",
      value: 3,
      maxValue: 20
    }
  ]);

  const handleValueChange = (index: number, newValue: number[]) => {
    const newActivities = [...activities];
    newActivities[index].value = newValue[0];
    setActivities(newActivities);
  };

  const calculateTotalImpact = () => {
    return activities.reduce((total, activity) => {
      // Convert to monthly impact
      const monthlyMultiplier = activity.frequency === 'weekly' ? 4.3 : 1;
      return total + (activity.impactPerUnit * activity.value * monthlyMultiplier);
    }, 0);
  };

  const handleSaveResults = () => {
    toast({
      title: "Carbon Footprint Saved",
      description: "Your carbon footprint has been calculated and saved to your profile."
    });
  };

  const totalImpact = calculateTotalImpact();
  const isPositiveImpact = totalImpact < 0;

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
                    {activity.icon}
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
                  onValueChange={(value) => handleValueChange(index, value)}
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
            <Button onClick={handleSaveResults}>Save Results</Button>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Negative values represent carbon reduction due to sustainable choices.
        </div>
      </CardContent>
    </Card>
  );
}
