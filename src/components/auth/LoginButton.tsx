"use client"

import { signIn } from "next-auth/react"
import { Terminal, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Inline GitHub icon — lucide-react may not export one in all versions
function GithubIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      role="img"
      aria-label="GitHub"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z" />
    </svg>
  )
}

interface LoginButtonProps {
  variant?: "navbar" | "hero"
  className?: string
}

export function LoginButton({ variant = "navbar", className }: LoginButtonProps) {
  if (variant === "hero") {
    return (
      <div className={cn("space-y-3", className)}>
        <p className="text-[8px] text-slate-400/50 font-mono tracking-widest uppercase text-center">
          // IDENTITY VERIFICATION REQUIRED
        </p>
        <Button
          onClick={() => signIn("github")}
          className={cn(
            "flex items-center gap-2.5 h-12 px-8 clip-tag",
            "bg-cyber-dark border border-neon-blue/30",
            "text-neon-blue font-display font-bold uppercase tracking-[0.3em] text-xs",
            "hover:bg-neon-blue/[0.08] hover:border-neon-blue/50 hover:glow-blue",
            "active:scale-95 active:skew-x-[-2deg]",
            "transition-all duration-300",
            "shadow-[0_0_20px_rgba(0,212,255,0.08)]",
          )}
        >
          <GithubIcon size={16} className="text-neon-blue/80" />
          <span className="flex items-center gap-2">
            <Terminal size={10} className="text-neon-blue/40" />
            SIGN IN WITH GITHUB
            <Terminal size={10} className="text-neon-blue/40" />
          </span>
        </Button>
        <p className="text-[8px] text-slate-400/30 font-mono tracking-widest uppercase text-center">
          Secure NEXUS authentication via GitHub OAuth 2.0
        </p>
      </div>
    )
  }

  // Navbar variant — compact
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => signIn("github")}
      className={cn(
        "ml-1 h-8 clip-tag",
        "border-neon-blue/25 text-neon-blue",
        "bg-cyber-dark/60",
        "hover:bg-neon-blue/[0.10] hover:border-neon-blue/45 hover:glow-blue",
        "active:scale-95 transition-all duration-200",
        "font-display font-bold uppercase tracking-widest text-[10px]",
        "shadow-[0_0_12px_rgba(0,212,255,0.06)]",
        className,
      )}
    >
      <LogIn size={13} />
      <span className="ml-1.5">CONNECT</span>
    </Button>
  )
}
