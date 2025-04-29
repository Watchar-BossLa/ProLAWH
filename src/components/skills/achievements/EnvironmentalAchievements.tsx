
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Award, Leaf, Droplet, Globe, Sun, Check } from "lucide-react";
import { useEnvironmentalAchievements } from '@/hooks/useEnvironmentalAchievements';
import { Skeleton } from '@/components/ui/skeleton';

export function EnvironmentalAchievements() {
  const { achievements, isLoading } = useEnvironmentalAchievements();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'leaf': return <Leaf className="h-6 w-6 text-green-600" />;
      case 'droplet': return <Droplet className="h-6 w-6 text-blue-600" />;
      case 'sun': return <Sun className="h-6 w-6 text-amber-600" />;
      case 'globe': return <Globe className="h-6 w-6 text-sky-600" />;
      default: return <Award className="h-6 w-6 text-purple-600" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Environmental Impact Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Group achievements by earned status for better display
  const earnedAchievements = achievements.filter(a => a.earned);
  const unlockedAchievements = achievements.filter(a => !a.earned);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Environmental Impact Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Earn badges by completing sustainability challenges and making real-world impact.
        </p>
        
        <ScrollArea className="h-[230px]">
          {earnedAchievements.length > 0 && (
            <>
              <h3 className="font-medium text-sm mb-3">Earned Badges</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {earnedAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex flex-col items-center">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                        {getIcon(achievement.icon_name)}
                      </div>
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                        <Check className="h-3 w-3" />
                      </div>
                    </div>
                    <span className="text-xs text-center font-medium">{achievement.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {unlockedAchievements.length > 0 && (
            <>
              <h3 className="font-medium text-sm mb-3">Available Badges</h3>
              <div className="grid grid-cols-3 gap-4">
                {unlockedAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex flex-col items-center opacity-50">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                      {getIcon(achievement.icon_name)}
                    </div>
                    <span className="text-xs text-center">{achievement.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {achievements.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Award className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="font-medium">No badges available</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
                Check back later for sustainability achievements
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
