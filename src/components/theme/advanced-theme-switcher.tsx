
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Palette, Settings } from "lucide-react";
import { useAdvancedTheme, ThemeMode, AccentColor, FontSize } from "@/hooks/useAdvancedTheme";

export function AdvancedThemeSwitcher() {
  const { theme, updateTheme } = useAdvancedTheme();

  const accentColors: { value: AccentColor; label: string; color: string }[] = [
    { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
    { value: 'green', label: 'Green', color: 'bg-green-500' },
    { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
    { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
    { value: 'red', label: 'Red', color: 'bg-red-500' }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Palette className="h-4 w-4 mr-2" />
          Theme
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Appearance</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Theme Mode */}
          <div className="space-y-2">
            <Label>Theme Mode</Label>
            <Select
              value={theme.mode}
              onValueChange={(value: ThemeMode) => updateTheme({ mode: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Accent Color */}
          <div className="space-y-3">
            <Label>Accent Color</Label>
            <div className="grid grid-cols-5 gap-2">
              {accentColors.map((color) => (
                <button
                  key={color.value}
                  className={`w-10 h-10 rounded-full ${color.color} border-2 ${
                    theme.accentColor === color.value ? 'border-foreground' : 'border-transparent'
                  }`}
                  onClick={() => updateTheme({ accentColor: color.value })}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <Label>Font Size</Label>
            <Select
              value={theme.fontSize}
              onValueChange={(value: FontSize) => updateTheme({ fontSize: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Accessibility Options */}
          <div className="space-y-4">
            <Label>Accessibility</Label>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="reduced-motion" className="text-sm">
                Reduce Motion
              </Label>
              <Switch
                id="reduced-motion"
                checked={theme.reducedMotion}
                onCheckedChange={(checked) => updateTheme({ reducedMotion: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast" className="text-sm">
                High Contrast
              </Label>
              <Switch
                id="high-contrast"
                checked={theme.highContrast}
                onCheckedChange={(checked) => updateTheme({ highContrast: checked })}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
