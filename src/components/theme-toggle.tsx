"use client"

import * as React from "react"
import { IconMoon, IconSun } from "@tabler/icons-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { SidebarMenuButton } from "@/components/ui/sidebar"

export function ThemeToggle({ inSidebar = false }: { inSidebar?: boolean }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // Show a placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    if (inSidebar) {
      return (
        <SidebarMenuButton 
          className="w-full justify-start"
          disabled
        >
          <div className="h-4 w-4" />
          <span>Theme</span>
        </SidebarMenuButton>
      )
    }
    
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        aria-label="Theme toggle"
      >
        <div className="h-4 w-4" />
      </Button>
    )
  }

  if (inSidebar) {
    return (
      <SidebarMenuButton 
        onClick={toggleTheme}
        tooltip={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        className="w-full justify-start"
      >
        {theme === "light" ? (
          <IconMoon className="h-4 w-4" />
        ) : (
          <IconSun className="h-4 w-4" />
        )}
        <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
      </SidebarMenuButton>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        <IconMoon className="h-4 w-4" />
      ) : (
        <IconSun className="h-4 w-4" />
      )}
    </Button>
  )
}
