import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface GlowBadgeProps extends React.ComponentProps<typeof Badge> {
  color?: "blue" | "purple" | "gold"
  glow?: boolean
}

const colorClasses = {
  blue: "bg-neon-blue/10 text-neon-blue border-neon-blue/30",
  purple: "bg-neon-purple/10 text-neon-purple border-neon-purple/30",
  gold: "bg-neon-gold/10 text-neon-gold border-neon-gold/30",
}

const glowClasses = {
  blue: "glow-blue",
  purple: "glow-purple",
  gold: "glow-gold",
}

export function GlowBadge({ color = "blue", glow = true, className, ...props }: GlowBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold transition-all",
        colorClasses[color],
        glow && glowClasses[color],
        className
      )}
      {...props}
    />
  )
}
