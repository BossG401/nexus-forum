"use client"

import * as React from "react"

type Theme = "dark" | "light"

interface ThemeContextValue {
  theme: Theme | null
  resolvedTheme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider")
  return ctx
}

const THEME_KEY = "theme"
const emptySubscribe = () => () => {}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: {
  children: React.ReactNode
  defaultTheme?: Theme
}) {
  // The blocking <script> in <head> already set .dark / .light on <html>
  // before React hydrates, so we can read the class without any effect.
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof document === "undefined") return defaultTheme
    return document.documentElement.classList.contains("dark") ? "dark" : "light"
  })

  // Hydration-safe "are we on the client yet?" flag — avoids setState-in-effect.
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  // Resolved: use the live theme once mounted, fall back to default during SSR.
  const resolvedTheme: Theme = mounted ? theme : defaultTheme

  const setTheme = React.useCallback(
    (next: Theme) => {
      const root = document.documentElement
      if (next === "dark") {
        root.classList.add("dark")
        root.style.colorScheme = "dark"
      } else {
        root.classList.remove("dark")
        root.style.colorScheme = "light"
      }
      try {
        localStorage.setItem(THEME_KEY, next)
      } catch {
        // localStorage disabled (private browsing, quota, etc.) — fine.
      }
      setThemeState(next)
    },
    [],
  )

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme: mounted ? theme : null, resolvedTheme, setTheme }),
    [theme, mounted, resolvedTheme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
