"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { User, Settings, LogOut, Terminal, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { UserStats } from "@/lib/types"
import { cn } from "@/lib/utils"

interface UserMenuProps {
  userStats: UserStats
}

const rankBadgeStyles: Record<string, string> = {
  Challenger: "text-neon-gold-hot neon-text-gold font-black",
  Grandmaster: "text-neon-crimson neon-text-crimson font-bold",
  Master: "text-neon-purple-hot neon-text-purple font-bold",
  Diamond: "text-neon-blue-hot neon-text-blue font-bold",
  Platinum: "text-teal-300",
  Gold: "text-yellow-400",
}

export function UserMenu({ userStats }: UserMenuProps) {
  const initials = userStats.summonerName
    ? userStats.summonerName.slice(0, 2).toUpperCase()
    : "AG"

  const rankStyle = rankBadgeStyles[userStats.rank] ?? "text-yellow-400"

  return (
    <DropdownMenu>
      {/* ── Trigger: Avatar with cyberpunk ring ── */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="ml-1 h-8 w-8 rounded-none hover:bg-transparent active:scale-90 transition-all duration-200"
        >
          <Avatar className="h-7 w-7 ring-1 ring-neon-gold/40 transition-all duration-300 hover:ring-neon-gold/70 hover:shadow-[0_0_12px_rgba(200,169,81,0.3)] clip-diamond">
            <AvatarImage src={userStats.avatarUrl} alt={userStats.summonerName} />
            <AvatarFallback className="bg-neon-gold/10 text-neon-gold text-[10px] font-display font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      {/* ── Dropdown Content ── */}
      <DropdownMenuContent
        align="end"
        className="w-56 mt-1 glass clip-chamfer animate-scale-in-brutal"
      >
        {/* Header — terminal-style label */}
        <DropdownMenuLabel className="flex items-center gap-2 px-3 py-2.5 text-[8px] text-slate-400/60 font-mono tracking-widest uppercase">
          <Terminal size={9} className="text-neon-blue/50" />
          NEXUS SESSION ACTIVE
          <Shield size={9} className="text-neon-green/60 ml-auto" />
        </DropdownMenuLabel>

        {/* User identity row */}
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <Avatar className="h-9 w-9 ring-1 ring-neon-gold/30 clip-diamond shrink-0">
            <AvatarImage src={userStats.avatarUrl} alt={userStats.summonerName} />
            <AvatarFallback className="bg-neon-gold/10 text-neon-gold text-[11px] font-display font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-xs font-display font-bold text-slate-200 uppercase tracking-wider truncate">
              {userStats.summonerName}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Zap size={8} className="text-neon-gold/60 shrink-0" />
              <span className={cn("text-[9px] font-display font-semibold tracking-widest", rankStyle)}>
                {userStats.rank}
              </span>
              {userStats.lp && (
                <span className="text-[9px] text-neon-gold/60 font-mono tracking-wider">
                  {userStats.lp} LP
                </span>
              )}
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-neon-blue/[0.08]" />

        {/* Profile link */}
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link
            href="/profile"
            className="flex items-center px-3 py-2 text-slate-300 hover:text-neon-blue focus:text-neon-blue transition-colors duration-150"
          >
            <User size={13} className="mr-2.5 opacity-60" />
            <span className="text-xs font-display uppercase tracking-widest">Profile</span>
          </Link>
        </DropdownMenuItem>

        {/* Settings link */}
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link
            href="/settings"
            className="flex items-center px-3 py-2 text-slate-300 hover:text-neon-blue focus:text-neon-blue transition-colors duration-150"
          >
            <Settings size={13} className="mr-2.5 opacity-60" />
            <span className="text-xs font-display uppercase tracking-widest">Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-neon-blue/[0.08]" />

        {/* Sign Out */}
        <DropdownMenuItem
          className="cursor-pointer group"
          onClick={() => signOut()}
        >
          <div className="flex items-center px-3 py-2 text-slate-400 group-hover:text-neon-crimson focus:text-neon-crimson transition-colors duration-150 w-full">
            <LogOut size={13} className="mr-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="text-xs font-display uppercase tracking-widest">SYSTEM LOGOUT</span>
          </div>
        </DropdownMenuItem>

        {/* Footer terminal decoration */}
        <div className="px-3 py-2 border-t border-white/[0.03]">
          <p className="text-[7px] text-slate-400/30 font-mono tracking-widest uppercase text-center">
            // DISCONNECT FROM NEXUS
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
