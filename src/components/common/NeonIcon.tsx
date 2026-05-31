import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NeonIconProps {
  icon: LucideIcon
  color?: "blue" | "purple" | "gold"
  size?: number
  className?: string
}

const textColorClasses = {
  blue: "neon-text-blue",
  purple: "neon-text-purple",
  gold: "neon-text-gold",
}

export function NeonIcon({ icon: Icon, color = "blue", size = 18, className }: NeonIconProps) {
  return (
    <Icon
      size={size}
      className={cn("transition-all", textColorClasses[color], className)}
    />
  )
}
