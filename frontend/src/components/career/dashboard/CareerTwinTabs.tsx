
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, BarChart2, Target } from "lucide-react";

interface CareerTwinTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function CareerTwinTabs({ activeTab, onTabChange }: CareerTwinTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="recommendations" className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Recommendations
        </TabsTrigger>
        <TabsTrigger value="insights" className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          Insights
        </TabsTrigger>
        <TabsTrigger value="plans" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Implementation Plans
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
