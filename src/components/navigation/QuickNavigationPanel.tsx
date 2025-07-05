
import React, { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Clock, Star, Lightbulb, Keyboard } from 'lucide-react';
import { useNavigation } from './NavigationProvider';

interface QuickNavigationPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickNavigationPanel({ open, onOpenChange }: QuickNavigationPanelProps) {
  const { quickAccess, suggestions, navigate, history } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (path: string) => {
    navigate(path);
    onOpenChange(false);
    setSearchQuery('');
  };

  const recentPages = history.slice(0, 5);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl">
        <DialogHeader className="px-4 pt-4 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Quick Navigation
            <Badge variant="outline" className="ml-auto">
              <Keyboard className="h-3 w-3 mr-1" />
              Ctrl+K
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <Command className="border-0">
          <CommandInput
            placeholder="Search pages, features, or type a command..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="border-0"
          />
          <CommandEmpty>No results found.</CommandEmpty>
          
          {/* Quick Access */}
          <CommandGroup heading="Quick Access">
            {quickAccess.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => handleNavigate(item.path)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs">📊</span>
                  </div>
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {item.category === 'frequent' ? 'Frequent' : 
                   item.category === 'recent' ? 'Recent' : 'Suggested'}
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>

          {/* Recent Pages */}
          {recentPages.length > 0 && (
            <CommandGroup heading="Recent Pages">
              {recentPages.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleNavigate(item.path)}
                  className="flex items-center gap-3"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <CommandGroup heading="AI Suggestions">
              {suggestions.map((suggestion) => (
                <CommandItem
                  key={suggestion.id}
                  onSelect={() => handleNavigate(suggestion.path)}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Lightbulb className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{suggestion.title}</div>
                    <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                    <div className="text-xs text-blue-600 mt-1">{suggestion.reason}</div>
                  </div>
                  <Badge variant="secondary">
                    <Star className="h-3 w-3 mr-1" />
                    AI
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </DialogContent>
    </Dialog>
  );
}
