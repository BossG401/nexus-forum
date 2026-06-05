"use client"

import * as React from "react"
import {
  Brain,
  Laugh,
  ScrollText,
  Search,
  Swords,
  Trophy,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Category } from "@/lib/types"
import { cn } from "@/lib/utils"

const iconMap: Record<string, LucideIcon> = {
  Brain,
  Laugh,
  ScrollText,
  Swords,
  Trophy,
  UserRound,
  Users,
}

interface SidebarProps {
  categories: Category[]
  activeCategory: string | null
  onCategoryChange: (id: string) => void
  className?: string
}

export function Sidebar({ categories, activeCategory, onCategoryChange, className }: SidebarProps) {
  return (
    <aside className={cn("flex w-[280px] flex-col bg-card", className)}>
      <div className="border-b border-border px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Communities
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Browse</h2>
      </div>

      <div className="border-b border-border px-5 py-4">
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            placeholder="Search..."
            className="h-11 w-full rounded-xl border border-border bg-background px-3 pl-10 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/45 focus:ring-3 focus:ring-primary/15"
          />
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {categories.map((category) => {
          const Icon = iconMap[category.iconName]
          const isActive = activeCategory === category.id

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                isActive
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {Icon ? (
                <Icon
                  size={18}
                  className={cn("shrink-0", isActive ? "text-primary" : "text-muted-foreground")}
                />
              ) : null}
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {category.name.replace("#", "")}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "h-6 min-w-8 rounded-full border-border px-2 text-xs",
                  isActive
                    ? "bg-primary/12 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {category.postCount > 999
                  ? `${(category.postCount / 1000).toFixed(1)}k`
                  : category.postCount}
              </Badge>
            </button>
          )
        })}
      </nav>

      <div className="border-t border-border px-5 py-4">
        <p className="text-xs text-muted-foreground">NEXUS community forum</p>
      </div>
    </aside>
  )
}
