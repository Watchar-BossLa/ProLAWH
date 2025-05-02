
import { Sun, Moon, Monitor, Palette } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} theme activated`,
      description: newTheme === 'dynamic' ? 'High contrast gradient theme enabled' : `Switched to ${newTheme} mode`,
      duration: 2000,
    })
  }

  if (!mounted) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 px-0 relative ${theme === 'dynamic' ? 'gradient-border' : ''}`}
          aria-label="Select a theme"
        >
          {theme === 'dynamic' && (
            <div className="absolute inset-0 -z-10 opacity-20 rounded-md pointer-events-none" style={{ background: 'var(--gradient-primary)' }} />
          )}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
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
            theme === 'dynamic' ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <Palette className={`h-4 w-4 ${theme === 'dynamic' ? 'gradient-text' : ''}`} />
          <span className={theme === 'dynamic' ? 'gradient-text' : ''}>Dynamic</span>
          {theme === "dynamic" && (
            <div 
              className="absolute inset-0 -z-10 opacity-10 pointer-events-none" 
              style={{ backgroundImage: 'var(--gradient-primary)' }}
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
