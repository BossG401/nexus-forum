import * as React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.ComponentProps<typeof Card> {
  hoverGlow?: boolean
}

export function GlassCard({ className, hoverGlow = true, ...props }: GlassCardProps) {
  return (
    <Card
      className={cn(
        "glass border-0 ring-0",
        hoverGlow && "hover:glow-blue transition-shadow duration-300",
        className
      )}
      {...props}
    />
  )
}
