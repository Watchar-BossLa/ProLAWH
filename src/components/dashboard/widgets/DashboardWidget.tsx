
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WidgetProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
  size?: 'small' | 'medium' | 'large';
}

export function DashboardWidget({ 
  id, 
  title, 
  description, 
  children, 
  className,
  onRemove,
  onConfigure,
  size = 'medium'
}: WidgetProps) {
  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-2', 
    large: 'col-span-3'
  };

  return (
    <Card className={cn("relative group", sizeClasses[size], className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <CardDescription className="text-sm">{description}</CardDescription>
            )}
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            {onConfigure && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onConfigure(id)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
