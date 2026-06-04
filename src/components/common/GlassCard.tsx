import * as React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.ComponentProps<typeof Card> { hoverGlow?: boolean }

export function GlassCard({ className, hoverGlow = true, ...props }: GlassCardProps) {
  return (
    <Card
      className={cn("glass border-0 ring-0 transition-all duration-300", hoverGlow && "hover:glow-blue", className)}
      {...props}
    />
  )
}
