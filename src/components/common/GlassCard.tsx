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
        "glass border-0 ring-0 transition-all duration-300",
        hoverGlow && "hover:shadow-[0_0_16px_rgba(0,212,255,0.08),0_4px_24px_rgba(0,0,0,0.2)]",
        className
      )}
      {...props}
    />
  )
}
