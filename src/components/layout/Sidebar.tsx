"use client"

import * as React from "react"
import { ScrollText, Trophy, Users, Swords, Laugh, UserRound, Brain, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { Category } from "@/lib/types"

const iconMap: Record<string, LucideIcon> = { ScrollText, Trophy, Users, Swords, Laugh, UserRound, Brain }
const hudStyles: Record<string, { active: string; badge: string; icon: string }> = {
  "neon-blue": { active: "border-l-neon-blue from-neon-blue/[0.15] to-transparent text-neon-blue-hot [text-shadow:0_0_10px_rgba(0,212,255,0.5)]", badge: "border-neon-blue/25 text-neon-blue bg-neon-blue/[0.08]", icon: "text-neon-blue" },
  "neon-purple": { active: "border-l-neon-purple from-neon-purple/[0.15] to-transparent text-neon-purple-hot [text-shadow:0_0_10px_rgba(168,85,247,0.5)]", badge: "border-neon-purple/25 text-neon-purple bg-neon-purple/[0.08]", icon: "text-neon-purple" },
  "neon-gold": { active: "border-l-neon-gold from-neon-gold/[0.15] to-transparent text-neon-gold-hot [text-shadow:0_0_10px_rgba(212,168,67,0.5)]", badge: "border-neon-gold/25 text-neon-gold bg-neon-gold/[0.08]", icon: "text-neon-gold" },
}

interface SidebarProps { categories: Category[]; activeCategory: string | null; onCategoryChange: (id: string) => void; className?: string }

export function Sidebar({ categories, activeCategory, onCategoryChange, className }: SidebarProps) {
  return (
    <aside className={cn("flex flex-col w-[240px] bg-cyber-dark/90 border-r border-neon-blue/[0.04]", className)}>
      <div className="px-3.5 py-3 border-b border-neon-blue/[0.04]">
        <h2 className="text-[9px] font-display font-black uppercase tracking-[0.5em] text-neon-blue/50">// CATEGORIES</h2>
        <div className="mt-2 h-[1px] bg-gradient-to-r from-neon-blue/25 to-transparent w-16" />
      </div>
      <nav className="flex-1 p-2 space-y-px overflow-y-auto stagger-children">
        {categories.map((cat, index) => {
          const Icon = iconMap[cat.iconName]; const isActive = activeCategory === cat.id; const styles = hudStyles[cat.accentColor] ?? hudStyles["neon-blue"]
          return (
            <button key={cat.id} onClick={() => onCategoryChange(cat.id)} style={{ "--stagger": index } as React.CSSProperties}
              className={cn("w-full flex items-center gap-2.5 px-3 py-2 text-left group border-l-2 border-l-transparent active:scale-[0.97] active:skew-x-[-1deg] transition-all duration-200",
                isActive ? `bg-gradient-to-r ${styles.active} skew-x-[-2deg]` : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] hover:skew-x-[-1deg] hover:border-l-neon-blue/20")}>
              {Icon && <Icon size={14} className={cn("shrink-0 transition-all duration-200", isActive ? styles.icon : "text-slate-400/60 group-hover:text-slate-300")} />}
              <span className={cn("flex-1 truncate transition-all duration-200", isActive ? "text-[10px] font-display font-black uppercase tracking-[0.15em]" : "text-xs font-medium tracking-wide")}>{cat.name}</span>
              <Badge variant="outline" className={cn("shrink-0 text-[9px] px-1.5 py-0 h-4 min-w-[1.5rem] justify-center font-display font-bold clip-tag transition-all duration-200", isActive ? styles.badge : "bg-white/[0.02] border-white/[0.06] text-slate-400/60")}>
                {cat.postCount > 999 ? `${(cat.postCount / 1000).toFixed(1)}k` : cat.postCount}
              </Badge>
            </button>
          )
        })}
      </nav>
      <div className="px-4 py-3 border-t border-neon-blue/[0.04]">
        <p className="text-[8px] text-slate-500/50 font-display font-bold tracking-[0.5em] uppercase text-center">NEXUS // v1.0.0</p>
      </div>
    </aside>
  )
}
