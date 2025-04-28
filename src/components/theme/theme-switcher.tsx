
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

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 px-0 ${theme === 'dynamic' ? 'gradient-border' : ''}`}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2">
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2">
          <Moon className="h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2">
          <Monitor className="h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dynamic")} 
          className={`gap-2 relative overflow-hidden transition-all duration-300 ${
            theme === 'dynamic' ? 'gradient-hover gradient-border' : ''
          }`}
        >
          <Palette className="h-4 w-4" />
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
