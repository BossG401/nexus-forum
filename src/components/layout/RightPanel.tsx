"use client"

import * as React from "react"
import { useSession, signIn } from "next-auth/react"
import { Crosshair, Activity, ChevronRight, ShieldAlert, LogIn, Loader2, CheckCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { GlassCard } from "@/components/common/GlassCard"
import { cn } from "@/lib/utils"
import type { UserStats } from "@/lib/types"

//─── Rank → Color mapping (refined softer glows) ───
const rankGradient: Record<string, { text: string; glow: string; bar: string; ring: string }> = {
  Challenger: {
    text: "text-neon-gold neon-text-gold",
    glow: "shadow-[0_0_12px_rgba(200,169,81,0.2),0_0_28px_rgba(200,169,81,0.06)]",
    bar: "bg-neon-gold",
    ring: "ring-neon-gold/35 shadow-[0_0_12px_rgba(200,169,81,0.2)]",
  },
  Grandmaster: {
    text: "text-red-400 [text-shadow:0_0_8px_rgba(239,68,68,0.4),0_0_16px_rgba(239,68,68,0.15)]",
    glow: "shadow-[0_0_12px_rgba(239,68,68,0.2),0_0_28px_rgba(239,68,68,0.06)]",
    bar: "bg-red-400",
    ring: "ring-red-400/35 shadow-[0_0_12px_rgba(239,68,68,0.2)]",
  },
  Master: {
    text: "text-neon-purple neon-text-purple",
    glow: "glow-purple",
    bar: "bg-neon-purple",
    ring: "ring-neon-purple/35 shadow-[0_0_12px_rgba(168,85,247,0.2)]",
  },
  Diamond: {
    text: "text-neon-blue neon-text-blue",
    glow: "glow-blue",
    bar: "bg-neon-blue",
    ring: "ring-neon-blue/35 shadow-[0_0_12px_rgba(0,212,255,0.2)]",
  },
  Platinum: {
    text: "text-teal-400 [text-shadow:0_0_6px_rgba(45,212,191,0.3)]",
    glow: "",
    bar: "bg-teal-400",
    ring: "ring-teal-400/30",
  },
  Gold: {
    text: "text-amber-400 [text-shadow:0_0_6px_rgba(251,191,36,0.25)]",
    glow: "",
    bar: "bg-amber-400",
    ring: "ring-amber-400/25",
  },
}

interface RightPanelProps {
  userStats: UserStats
  className?: string
}

export function RightPanel({ userStats, className }: RightPanelProps) {
  const { data: session, status } = useSession()

  const [liveStats, setLiveStats] = React.useState(userStats)
  const [syncPhase, setSyncPhase] = React.useState<"idle" | "syncing" | "success">("idle")

  const rank = rankGradient[liveStats.rank] ?? rankGradient.Gold
  const winPct = Math.round((liveStats.wins / (liveStats.wins + liveStats.losses)) * 100)
  const totalGames = liveStats.wins + liveStats.losses

  const handleSync = () => {
    if (syncPhase !== "idle") return
    setSyncPhase("syncing")

    const baseTotal = liveStats.wins + liveStats.losses

    setTimeout(() => {
      const newLP = Math.floor(Math.random() * 1401) + 100
      const newWR = Math.floor(Math.random() * 21) + 45
      const newKDA = parseFloat((Math.random() * 6 + 2).toFixed(1))
      const newWins = Math.round((baseTotal * newWR) / 100)
      const newLosses = baseTotal - newWins

      setLiveStats((prev) => ({
        ...prev,
        lp: newLP,
        wins: newWins,
        losses: newLosses,
        winRate: newWR,
        kda: newKDA,
      }))

      setSyncPhase("success")
      setTimeout(() => setSyncPhase("idle"), 2500)
    }, 2000)
  }

  React.useEffect(() => {
    setLiveStats((prev) => ({
      ...prev,
      summonerName: userStats.summonerName,
      rank: userStats.rank,
      rankTier: userStats.rankTier,
      server: userStats.server,
      region: userStats.region,
      avatarUrl: userStats.avatarUrl,
      status: userStats.status,
    }))
  }, [
    userStats.summonerName,
    userStats.rank,
    userStats.rankTier,
    userStats.server,
    userStats.region,
    userStats.avatarUrl,
    userStats.status,
  ])

  //─── Loading skeleton ───
  if (status === "loading") {
    return (
      <aside className={className}>
        <div className="p-4 space-y-4 stagger-children">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{ "--stagger": i } as React.CSSProperties}
              className="glass-subtle rounded-lg p-5"
            >
              <div className="space-y-3 animate-pulse">
                <div className="h-3 bg-white/[0.04] rounded-md w-2/3" />
                <div className="h-7 bg-white/[0.04] rounded-md w-1/2" />
                <div className="h-1.5 bg-white/[0.04] rounded-full w-full" />
              </div>
            </div>
          ))}
        </div>
      </aside>
    )
  }

  //─── Unauthenticated: CLASSIFIED overlay ───
  if (!session?.user) {
    return (
      <aside className={className}>
        <div className="p-4 space-y-4 animate-fade-in">
          <div className="relative overflow-hidden rounded-lg">
            {/* Blurred mock content behind */}
            <div className="blur-md opacity-40 pointer-events-none select-none p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-neon-gold/20" />
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-white/10 rounded-sm" />
                  <div className="h-3 w-20 bg-neon-blue/10 rounded-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-14 bg-white/[0.03] rounded-md" />
                ))}
              </div>
              <div className="h-20 bg-white/[0.03] rounded-md" />
            </div>

            {/* CLASSIFIED overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-cyber-darker/80 backdrop-blur-sm rounded-lg border border-white/[0.06]">
              <ShieldAlert size={28} className="text-neon-purple/60 mb-3" />
              <p className="text-sm font-display font-bold uppercase tracking-[0.25em] text-slate-300 mb-1">
                CLASSIFIED
              </p>
              <p className="text-[11px] text-slate-500/70 mb-5 text-center px-6">
                Sign in to view summoner stats and tactical intel.
              </p>
              <button type="button" onClick={() => signIn()} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neon-blue/[0.08] border border-neon-blue/25 text-neon-blue text-xs font-display font-semibold uppercase tracking-wider hover:bg-neon-blue/[0.15] hover:border-neon-blue/40 hover:shadow-[0_0_16px_rgba(0,212,255,0.08)] active:scale-[0.97] transition-all duration-200">
                Connect
              </button>
            </div>
          </div>
        </div>
      </aside>
    )
  }

  //─── Authenticated: Full panel ───
  return (
    <aside className={className}>
      <div className="p-4 space-y-4 animate-fade-in">

        {/*─── Section 1: Identity Card ───*/}
        <GlassCard className="p-5 rounded-lg">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <Avatar className={cn("h-14 w-14 ring-2 transition-all duration-300", rank.ring)}>
                <AvatarImage src={liveStats.avatarUrl} alt={liveStats.summonerName} />
                <AvatarFallback className="bg-neon-blue/15 text-neon-blue text-lg font-bold font-display">
                  {liveStats.summonerName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* Status dot */}
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-400 border-2 border-cyber-dark shadow-[0_0_6px_rgba(74,222,128,0.4)]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-slate-100 truncate leading-tight">
                {liveStats.summonerName}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={cn("text-xs font-display font-bold uppercase tracking-wider", rank.text)}>
                  {liveStats.rank}
                </span>
                {liveStats.rankTier && (
                  <span className="text-[10px] text-slate-500 font-display tracking-wider">
                    {liveStats.rankTier}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500/60 font-display tracking-wider mt-1">
                {liveStats.server} · {liveStats.region}
              </p>
            </div>
          </div>

          <Separator className="my-4 bg-white/[0.04]" />

          {/* LP / Win Rate / KDA */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "LP", value: liveStats.lp.toLocaleString(), accent: rank.text },
              { label: "WIN RATE", value: `${liveStats.winRate}%`, accent: liveStats.winRate >= 52 ? "text-green-400" : "text-slate-300" },
              { label: "KDA", value: liveStats.kda.toFixed(1), accent: liveStats.kda >= 4 ? "text-neon-blue" : "text-slate-300" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center py-2.5 rounded-md bg-white/[0.02] border border-white/[0.04]"
              >
                <p className={cn("text-base font-display font-bold tabular-nums", stat.accent)}>
                  {stat.value}
                </p>
                <p className="text-[8px] text-slate-500/60 font-display tracking-[0.2em] uppercase mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/*─── Section 2: Performance ───*/}
        <GlassCard className="p-5 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Crosshair size={13} className="text-neon-blue/70" />
            <h4 className="text-[10px] font-display font-semibold uppercase tracking-[0.25em] text-slate-400/80">
              Performance
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="py-3 px-3 rounded-md bg-white/[0.02] border border-white/[0.04]">
              <p className="text-lg font-display font-bold text-slate-100 tabular-nums">
                {totalGames}
              </p>
              <p className="text-[9px] text-slate-500/60 font-display tracking-wider uppercase mt-0.5">
                Total Games
              </p>
            </div>
            <div className="py-3 px-3 rounded-md bg-white/[0.02] border border-white/[0.04]">
              <p className="text-lg font-display font-bold text-slate-100 tabular-nums">
                {liveStats.playtimeHours}h
              </p>
              <p className="text-[9px] text-slate-500/60 font-display tracking-wider uppercase mt-0.5">
                Playtime
              </p>
            </div>
          </div>

          {/* Win/Loss bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-[10px] text-slate-500/60 font-display tracking-wider mb-1.5">
              <span>{liveStats.wins}W</span>
              <span>{winPct}%</span>
              <span>{liveStats.losses}L</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]", rank.bar)}
                style={{ width: `${winPct}%` }}
              />
            </div>
          </div>
        </GlassCard>

        {/*─── Section 3: Main Champions ───*/}
        <GlassCard className="p-5 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={13} className="text-neon-gold/70" />
            <h4 className="text-[10px] font-display font-semibold uppercase tracking-[0.25em] text-slate-400/80">
              Main Champions
            </h4>
          </div>

          <div className="space-y-3">
            {liveStats.mainChampions.map((champ) => {
              const isHighWR = champ.winRate >= 52
              return (
                <div
                  key={champ.name}
                  className="flex items-center gap-3 py-2 px-2.5 rounded-md hover:bg-white/[0.02] transition-all duration-200"
                >
                  <Avatar className="h-10 w-10 rounded-md ring-1 ring-white/[0.06]">
                    <AvatarImage src={champ.imageUrl} alt={champ.name} className="object-cover" />
                    <AvatarFallback className="bg-cyber-surface text-slate-500 text-[10px] rounded-md">
                      {champ.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] text-slate-200 font-medium truncate">
                        {champ.name}
                      </p>
                      <span className="text-[11px] text-slate-400 tabular-nums ml-2">
                        {champ.kda.toFixed(1)} KDA
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                            isHighWR ? rank.bar : "bg-slate-600/70",
                          )}
                          style={{ width: `${champ.winRate}%` }}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-display font-bold w-8 text-right tabular-nums",
                          isHighWR
                            ? "text-neon-blue [text-shadow:0_0_4px_rgba(0,212,255,0.25)]"
                            : "text-slate-500/60",
                        )}
                      >
                        {champ.winRate}%
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-500/50 mt-1 font-display tracking-wider">
                      {champ.games} GAMES
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>

        {/*─── Section 4: Sync / Connect ───*/}
        <button
          type="button"
          onClick={handleSync}
          disabled={syncPhase !== "idle"}
          className={cn(
            "w-full group relative overflow-hidden rounded-lg border px-4 py-3.5 text-left transition-all duration-300 cursor-pointer",
            syncPhase === "success"
              ? "border-green-400/30 bg-green-400/[0.04]"
              : syncPhase === "syncing"
                ? "border-neon-blue/25 bg-neon-blue/[0.04] cursor-wait"
                : "border-white/[0.06] bg-white/[0.02] hover:border-neon-blue/30 hover:bg-white/[0.04]",
          )}
        >
          {syncPhase === "idle" && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg shadow-[inset_0_0_40px_rgba(0,212,255,0.03)]" />
          )}

          {syncPhase === "syncing" && (
            <div className="absolute inset-0 bg-neon-blue/[0.03] animate-pulse pointer-events-none rounded-lg" />
          )}

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {syncPhase === "syncing" ? (
                <Loader2 size={14} className="text-neon-blue animate-spin" />
              ) : syncPhase === "success" ? (
                <CheckCircle size={14} className="text-green-400" />
              ) : (
                <Activity size={13} className="text-slate-500/70 group-hover:text-neon-blue transition-colors duration-200" />
              )}
              <span
                className={cn(
                  "text-[11px] font-display font-semibold uppercase tracking-[0.18em] transition-colors duration-200",
                  syncPhase === "syncing" && "text-neon-blue",
                  syncPhase === "success" && "text-green-400",
                  syncPhase === "idle" && "text-slate-400/70 group-hover:text-neon-blue",
                )}
              >
                {syncPhase === "syncing"
                  ? "Syncing with Riot Server..."
                  : syncPhase === "success"
                    ? "Riot account synced!"
                    : "Force Sync Data"}
              </span>
            </div>
            {syncPhase === "idle" && (
              <ChevronRight
                size={14}
                className="text-slate-600/50 group-hover:text-neon-blue group-hover:translate-x-0.5 transition-all duration-200"
              />
            )}
          </div>
          <p
            className={cn(
              "relative text-[9px] mt-1.5 transition-colors duration-200 font-display tracking-wider",
              syncPhase === "syncing" && "text-neon-blue/50",
              syncPhase === "success" && "text-green-400/50",
              syncPhase === "idle" && "text-slate-600/50 group-hover:text-slate-500/70",
            )}
          >
            {syncPhase === "syncing"
              ? "FETCHING MATCH HISTORY..."
              : syncPhase === "success"
                ? "STATS UPDATED FROM RIOT API"
                : "CONNECT RIOT / QQ ACCOUNT"}
          </p>
        </button>

      </div>
    </aside>
  )
}


