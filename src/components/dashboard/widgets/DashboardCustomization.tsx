
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings } from "lucide-react";
import { AvailableWidget, WidgetConfig } from '@/hooks/dashboard/usePersonalizedDashboard';

interface DashboardCustomizationProps {
  widgets: WidgetConfig[];
  availableWidgets: AvailableWidget[];
  onToggleWidget: (widgetId: string, enabled: boolean) => void;
}

export function DashboardCustomization({
  widgets,
  availableWidgets,
  onToggleWidget
}: DashboardCustomizationProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Customize
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize Dashboard</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose which widgets to display on your dashboard
          </p>
          {availableWidgets.map((widget) => {
            const isEnabled = widgets.find(w => w.id === widget.id)?.enabled ?? false;
            return (
              <div key={widget.id} className="flex items-center space-x-2">
                <Checkbox
                  id={widget.id}
                  checked={isEnabled}
                  onCheckedChange={(checked) => 
                    onToggleWidget(widget.id, checked as boolean)
                  }
                />
                <label
                  htmlFor={widget.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {widget.name}
                </label>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
