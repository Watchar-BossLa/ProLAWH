
import { Sun, Moon, Monitor, Palette, Contrast } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { useAccessibility } from "./theme-provider"

export function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme()
  const { highContrast, toggleHighContrast } = useAccessibility()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Dispatch custom event when theme changes to notify listeners
    const event = new CustomEvent('theme-change', { detail: { theme } });
    window.dispatchEvent(event);
    
    // Apply dynamic class if needed
    if (theme === 'dynamic') {
      document.documentElement.classList.add('dynamic');
    } else {
      document.documentElement.classList.remove('dynamic');
    }
  }, [theme]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    
    // Custom event to help other components react to theme changes
    const event = new CustomEvent('theme-change', { detail: { theme: newTheme } });
    window.dispatchEvent(event);
    
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} theme activated`,
      description: newTheme === 'dynamic' ? 'High contrast gradient theme enabled' : `Switched to ${newTheme} mode`,
      duration: 2000,
    })
  }

  const handleHighContrastToggle = () => {
    toggleHighContrast();
    
    toast({
      title: highContrast ? 'Standard contrast mode' : 'High contrast mode',
      description: highContrast ? 'Standard contrast mode enabled' : 'High contrast mode enabled for better readability',
      duration: 2000,
    });
  };

  if (!mounted) return null

  const effectiveTheme = theme === 'system' ? systemTheme : theme;
  const isDynamicTheme = theme === 'dynamic';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 px-0 relative ${isDynamicTheme ? 'gradient-border' : ''}`}
          aria-label="Select a theme"
        >
          {isDynamicTheme && (
            <div className="absolute inset-0 -z-10 opacity-20 rounded-md pointer-events-none" style={{ background: 'var(--gradient-primary)' }} />
          )}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 z-50 bg-popover" style={{ opacity: 1 }}>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("light")} 
          className={`gap-2 cursor-pointer ${theme === 'light' ? 'bg-accent text-accent-foreground' : ''}`}
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("dark")} 
          className={`gap-2 cursor-pointer ${theme === 'dark' ? 'bg-accent text-accent-foreground' : ''}`}
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("system")} 
          className={`gap-2 cursor-pointer ${theme === 'system' ? 'bg-accent text-accent-foreground' : ''}`}
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("dynamic")} 
          className={`gap-2 cursor-pointer relative overflow-hidden transition-all duration-300 ${
            isDynamicTheme ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <Palette className={`h-4 w-4 ${isDynamicTheme ? 'gradient-text' : ''}`} />
          <span className={isDynamicTheme ? 'gradient-text' : ''}>Dynamic</span>
          {isDynamicTheme && (
            <div 
              className="absolute inset-0 -z-10 opacity-10 pointer-events-none" 
              style={{ backgroundImage: 'var(--gradient-primary)' }}
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleHighContrastToggle} 
          className={`gap-2 cursor-pointer ${highContrast ? 'bg-accent text-accent-foreground' : ''}`}
        >
          <Contrast className="h-4 w-4" />
          <span>High Contrast</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
