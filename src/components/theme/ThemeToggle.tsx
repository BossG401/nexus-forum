"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme/ThemeProvider"
import { cn } from "@/lib/utils"

const emptySubscribe = () => () => {}

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  // Hydration-safe guard: returns false during SSR + the hydration render,
  // then true on subsequent client renders. Avoids text-content mismatch.
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  // Render a stable placeholder until mounted (no theme-dependent text).
  if (!mounted) {
    return (
      <div
        className={cn(
          "h-10 w-10 rounded-xl border border-border bg-card sm:w-auto sm:px-3",
          className,
        )}
        aria-hidden
      />
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:px-3",
        className,
      )}
    >
      {isDark ? <Moon size={17} /> : <Sun size={17} />}
      <span className="hidden sm:inline">{isDark ? "Dark Mode" : "Light Mode"}</span>
    </button>
  )
}
