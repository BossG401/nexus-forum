"use client"

import * as React from "react"
import {
  ScrollText,
  Trophy,
  Users,
  Swords,
  Laugh,
  UserRound,
  Brain,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { Category } from "@/lib/types"

const iconMap: Record<string, LucideIcon> = {
  ScrollText,
  Trophy,
  Users,
  Swords,
  Laugh,
  UserRound,
  Brain,
}

const hudAccentColors: Record<string, string> = {
  "neon-blue": "border-l-neon-blue from-neon-blue/15 to-transparent text-neon-blue [text-shadow:0_0_8px_rgba(0,212,255,0.4)]",
  "neon-purple": "border-l-neon-purple from-neon-purple/15 to-transparent text-neon-purple [text-shadow:0_0_8px_rgba(168,85,247,0.4)]",
  "neon-gold": "border-l-neon-gold from-neon-gold/15 to-transparent text-neon-gold [text-shadow:0_0_8px_rgba(200,169,81,0.4)]",
}

const hudBadgeColors: Record<string, string> = {
  "neon-blue": "border-neon-blue/30 text-neon-blue bg-neon-blue/10",
  "neon-purple": "border-neon-purple/30 text-neon-purple bg-neon-purple/10",
  "neon-gold": "border-neon-gold/30 text-neon-gold bg-neon-gold/10",
}

interface SidebarProps {
  categories: Category[]
  activeCategory: string | null
  onCategoryChange: (id: string) => void
  className?: string
}

export function Sidebar({ categories, activeCategory, onCategoryChange, className }: SidebarProps) {
  return (
    <aside className={cn("flex flex-col w-[260px] bg-cyber-dark border-r border-cyber-border", className)}>
      {/* Header */}
      <div className="p-4 border-b border-cyber-border">
        <h2 className="text-xs font-display font-semibold uppercase tracking-[0.3em] text-slate-500">
          /// Categories
        </h2>
      </div>

      {/* Category list */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {categories.map((cat) => {
          const Icon = iconMap[cat.iconName]
          const isActive = activeCategory === cat.id

          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-all duration-200 group",
                "border-l-2 border-l-transparent",
                isActive
                  ? `bg-gradient-to-r ${hudAccentColors[cat.accentColor]}`
                  : "text-slate-400 hover:text-slate-200 hover:bg-cyber-surface/70"
              )}
            >
              {Icon && (
                <Icon
                  size={18}
                  className={cn(
                    "shrink-0 transition-all",
                    isActive
                      ? hudAccentColors[cat.accentColor].split(" ").filter(c => c.startsWith("text-")).join(" ")
                      : "text-slate-500 group-hover:text-slate-300"
                  )}
                />
              )}
              <span className={cn(
                "flex-1 text-sm font-medium truncate",
                isActive && "font-display tracking-wider uppercase text-[13px]"
              )}>
                {cat.name}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "shrink-0 text-[10px] px-1.5 py-0 h-5 min-w-[2rem] justify-center font-display font-semibold rounded-sm",
                  isActive
                    ? hudBadgeColors[cat.accentColor]
                    : "bg-cyber-surface border-cyber-border text-slate-500 group-hover:text-slate-400"
                )}
              >
                {cat.postCount > 999 ? `${(cat.postCount / 1000).toFixed(1)}k` : cat.postCount}
              </Badge>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-cyber-border">
        <p className="text-[10px] text-slate-600 text-center tracking-[0.3em] uppercase font-display">
          NEXUS // v1.0
        </p>
      </div>
    </aside>
  )
}
