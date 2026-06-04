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
  "neon-blue": "border-l-neon-blue from-neon-blue/[0.12] to-transparent text-neon-blue [text-shadow:0_0_8px_rgba(0,212,255,0.35)]",
  "neon-purple": "border-l-neon-purple from-neon-purple/[0.12] to-transparent text-neon-purple [text-shadow:0_0_8px_rgba(168,85,247,0.35)]",
  "neon-gold": "border-l-neon-gold from-neon-gold/[0.12] to-transparent text-neon-gold [text-shadow:0_0_8px_rgba(200,169,81,0.35)]",
}

const hudBadgeColors: Record<string, string> = {
  "neon-blue": "border-neon-blue/25 text-neon-blue bg-neon-blue/[0.08]",
  "neon-purple": "border-neon-purple/25 text-neon-purple bg-neon-purple/[0.08]",
  "neon-gold": "border-neon-gold/25 text-neon-gold bg-neon-gold/[0.08]",
}

interface SidebarProps {
  categories: Category[]
  activeCategory: string | null
  onCategoryChange: (id: string) => void
  className?: string
}

export function Sidebar({ categories, activeCategory, onCategoryChange, className }: SidebarProps) {
  return (
    <aside className={cn("flex flex-col w-[260px] bg-cyber-dark border-r border-white/[0.04]", className)}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.04]">
        <h2 className="text-[10px] font-display font-semibold uppercase tracking-[0.35em] text-slate-500/80">
          /// Categories
        </h2>
      </div>

      {/* Category list with stagger animation */}
      <nav className="flex-1 p-2.5 space-y-0.5 overflow-y-auto stagger-children">
        {categories.map((cat, index) => {
          const Icon = iconMap[cat.iconName]
          const isActive = activeCategory === cat.id

          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              style={{ "--stagger": index } as React.CSSProperties}
              className={cn(
                "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-left group",
                "border-l-2 border-l-transparent",
                "active:scale-[0.98] transition-all duration-200",
                isActive
                  ? `bg-gradient-to-r ${hudAccentColors[cat.accentColor]}`
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] hover:border-l-white/[0.06]"
              )}
            >
              {Icon && (
                <Icon
                  size={16}
                  className={cn(
                    "shrink-0 transition-all duration-200",
                    isActive
                      ? hudAccentColors[cat.accentColor].split(" ").filter(c => c.startsWith("text-")).join(" ")
                      : "text-slate-500/70 group-hover:text-slate-400"
                  )}
                />
              )}
              <span className={cn(
                "flex-1 text-[13px] truncate transition-all duration-200",
                isActive
                  ? "font-display font-semibold tracking-wider uppercase text-[12px]"
                  : "font-medium"
              )}>
                {cat.name}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "shrink-0 text-[10px] px-1.5 py-0 h-5 min-w-[2rem] justify-center font-display font-semibold rounded-sm transition-all duration-200",
                  isActive
                    ? hudBadgeColors[cat.accentColor]
                    : "bg-white/[0.02] border-white/[0.06] text-slate-500/70 group-hover:text-slate-400 group-hover:border-white/[0.1]"
                )}
              >
                {cat.postCount > 999 ? `${(cat.postCount / 1000).toFixed(1)}k` : cat.postCount}
              </Badge>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/[0.04]">
        <p className="text-[9px] text-slate-600/60 text-center tracking-[0.35em] uppercase font-display">
          NEXUS // v1.0
        </p>
      </div>
    </aside>
  )
}
