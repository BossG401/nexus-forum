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

// ── Rank → Color mapping (glow text, box glow, progress bar color) ──
const rankGradient: Record<string, { text: string; glow: string; bar: string; ring: string }> = {
  Challenger: {
    text: "text-neon-gold neon-text-gold",
    glow: "glow-gold",
    bar: "bg-neon-gold",
    ring: "ring-neon-gold/40 shadow-[0_0_15px_rgba(200,169,81,0.3)]",
  },
  Grandmaster: {
    text: "text-red-400 [text-shadow:0_0_10px_rgba(239,68,68,0.5),0_0_20px_rgba(239,68,68,0.25)]",
    glow: "shadow-[0_0_15px_rgba(239,68,68,0.3),0_0_30px_rgba(239,68,68,0.1)]",
    bar: "bg-red-400",
    ring: "ring-red-400/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
  },
  Master: {
    text: "text-neon-purple neon-text-purple",
    glow: "glow-purple",
    bar: "bg-neon-purple",
    ring: "ring-neon-purple/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
  },
  Diamond: {
    text: "text-neon-blue neon-text-blue",
    glow: "glow-blue",
    bar: "bg-neon-blue",
    ring: "ring-neon-blue/40 shadow-[0_0_15px_rgba(0,212,255,0.3)]",
  },
  Platinum: {
    text: "text-teal-400 [text-shadow:0_0_8px_rgba(45,212,191,0.4)]",
    glow: "",
    bar: "bg-teal-400",
    ring: "ring-teal-400/40",
  },
  Gold: {
    text: "text-amber-400 [text-shadow:0_0_8px_rgba(251,191,36,0.3)]",
    glow: "",
    bar: "bg-amber-400",
    ring: "ring-amber-400/30",
  },
}

interface RightPanelProps {
  userStats: UserStats
  className?: string
}

export function RightPanel({ userStats, className }: RightPanelProps) {
  const { data: session, status } = useSession()

  // ── Live stats for mock Riot sync ──
  const [liveStats, setLiveStats] = React.useState(userStats)
  const [syncPhase, setSyncPhase] = React.useState<"idle" | "syncing" | "success">("idle")

  const rank = rankGradient[liveStats.rank] ?? rankGradient.Gold
  const winPct = Math.round((liveStats.wins / (liveStats.wins + liveStats.losses)) * 100)
  const totalGames = liveStats.wins + liveStats.losses

  // ── Mock Riot API sync ──
  const handleSync = () => {
    if (syncPhase !== "idle") return
    setSyncPhase("syncing")

    const baseTotal = liveStats.wins + liveStats.losses

    setTimeout(() => {
      const newLP = Math.floor(Math.random() * 1401) + 100 // 100–1500
      const newWR = Math.floor(Math.random() * 21) + 45 // 45–65
      const newKDA = parseFloat((Math.random() * 6 + 2).toFixed(1)) // 2.0–8.0
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

  // Keep identity fields in sync when the server prop updates (e.g. after saving settings)
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

  // ── Loading skeleton ──
  if (status === "loading") {
    return (
      <aside className={className}>
        <div className="p-4 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <GlassCard key={i} className="p-4">
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-cyber-surface rounded-sm w-3/4" />
                <div className="h-8 bg-cyber-surface rounded-sm w-1/2" />
                <div className="h-2 bg-cyber-surface rounded-sm w-full" />
              </div>
            </GlassCard>
          ))}
        </div>
      </aside>
    )
  }

  // ── Unauthenticated: CLASSIFIED overlay ──
  if (!session?.user) {
    return (
      <aside className={className}>
        <div className="p-4">
          {/* Blurred CLASSIFIED card */}
          <div className="relative overflow-hidden rounded-sm">
            {/* Blurred mock content behind */}
            <div className="select-none pointer-events-none blur-[12px] opacity-20">
              <div className="space-y-3">
                <GlassCard className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-sm bg-cyber-surface" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-4 bg-slate-600 rounded-sm w-2/3" />
                      <div className="h-3 bg-slate-700 rounded-sm w-1/3" />
                    </div>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-sm w-full mt-3" />
                  <div className="flex items-center gap-2 mt-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
                    <div className="h-3 bg-slate-700 rounded-sm w-1/2" />
                  </div>
                </GlassCard>
                <GlassCard className="p-4">
                  <div className="h-3 bg-slate-700 rounded-sm w-1/3" />
                  <div className="h-10 bg-slate-600 rounded-sm w-2/3 mt-3 mx-auto" />
                  <div className="h-4 bg-slate-700 rounded-sm w-1/2 mt-2 mx-auto" />
                  <div className="h-4 bg-slate-800 rounded-sm w-full mt-3" />
                </GlassCard>
              </div>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-cyber-darker/80 backdrop-blur-sm border border-cyber-border rounded-sm p-6 text-center">
              <ShieldAlert size={36} className="text-neon-purple mb-3 glow-purple" />
              <h3 className="text-sm font-display font-bold uppercase tracking-[0.3em] text-slate-300 mb-2">
                /// CLASSIFIED
              </h3>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed max-w-[220px]">
                Tactical dossier requires authentication. Connect your Riot / QQ account to access your personal stats.
              </p>
              <button
                type="button"
                onClick={() => signIn()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-neon-blue text-cyber-dark font-display font-semibold text-xs uppercase tracking-wider hover:glow-blue transition-all"
              >
                <LogIn size={14} />
                Authenticate to view Dossier
              </button>
            </div>
          </div>
        </div>
      </aside>
    )
  }

  // ── Authenticated: Full Dossier ──
  return (
    <aside className={className}>
      <div className="p-4 space-y-4">

        {/* ════════════════════════════════════════════════
            Section 1 — Profile Header & Live Status
            ════════════════════════════════════════════════ */}
        <GlassCard className="p-4 gap-3">
          {/* Avatar + Name + Server */}
          <div className="flex items-center gap-3">
            <Avatar
              className={cn(
                "h-14 w-14 ring-2 rounded-sm",
                rank.ring,
              )}
            >
              <AvatarImage
                src={session.user.image ?? liveStats.avatarUrl}
                alt={session.user.name ?? liveStats.summonerName}
              />
              <AvatarFallback className="bg-neon-gold/20 text-neon-gold font-bold text-xl font-display rounded-sm">
                {(session.user.name ?? liveStats.summonerName).charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-100 text-base truncate leading-tight">
                {session.user.name ?? liveStats.summonerName}
              </p>
              <p className="text-xs text-slate-500 font-display tracking-[0.2em] uppercase mt-0.5">
                [{liveStats.server}]
              </p>
            </div>

            <Badge
              variant="outline"
              className="shrink-0 text-neon-blue border-neon-blue/30 text-[10px] font-display tracking-wider px-2"
            >
              {liveStats.region}
            </Badge>
          </div>

          <Separator className="bg-cyber-border" />

          {/* Live Status — pulsing green dot */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
            </span>
            <span className="text-xs text-green-400 font-display tracking-[0.15em] uppercase">
              {liveStats.status}
            </span>
          </div>
        </GlassCard>

        {/* ════════════════════════════════════════════════
            Section 2 — Rank Showcase (The Centerpiece)
            ════════════════════════════════════════════════ */}
        <GlassCard className="p-4 gap-3">
          {/* Section label */}
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-display">
            /// Current Standing
          </p>

          {/* Rank Name — glowing display text */}
          <div className="text-center py-1">
            <h2
              className={cn(
                "text-4xl font-bold font-display tracking-[0.12em] uppercase leading-none",
                rank.text,
              )}
            >
              {liveStats.rank}
            </h2>
            <p className="text-sm text-slate-400 font-display tracking-[0.15em] mt-1.5">
              TIER {liveStats.rankTier} &middot;{" "}
              <span className="text-slate-200 font-semibold">{liveStats.lp.toLocaleString()} LP</span>
            </p>
          </div>

          <Separator className="bg-cyber-border" />

          {/* Win / Loss Progress Bar */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-green-400 font-display tracking-wider font-semibold">
                {liveStats.wins}W
              </span>
              <span className="text-slate-500 font-display tracking-wider text-[10px]">
                {totalGames} GAMES
              </span>
              <span className="text-red-400 font-display tracking-wider font-semibold">
                {liveStats.losses}L
              </span>
            </div>

            {/* Segmented tech-y bar */}
            <div className="relative h-3 bg-cyber-darker rounded-sm border border-cyber-border overflow-hidden">
              {/* Vertical segment lines */}
              <div className="absolute inset-0 flex pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 border-r border-cyber-darker/60 last:border-r-0"
                  />
                ))}
              </div>
              {/* Win fill */}
              <div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-sm transition-all duration-700",
                  rank.bar,
                )}
                style={{ width: `${winPct}%` }}
              />
            </div>

            {/* Win Rate percentage */}
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] text-slate-500 font-display tracking-[0.2em] uppercase">
                Win Rate
              </span>
              <span
                className={cn(
                  "text-base font-bold font-display tabular-nums",
                  winPct >= 55 ? "text-green-400" : "text-slate-300",
                )}
              >
                {winPct}%
              </span>
            </div>
          </div>

          {/* Stat tiles — KDA & Playtime */}
          <div className="grid grid-cols-2 gap-2.5 pt-0.5">
            <div className="bg-cyber-darker/60 rounded-sm p-2.5 border border-cyber-border">
              <p className="text-lg font-bold font-display text-neon-blue tabular-nums">
                {liveStats.kda.toFixed(1)}
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-display">
                KDA Ratio
              </p>
            </div>
            <div className="bg-cyber-darker/60 rounded-sm p-2.5 border border-cyber-border">
              <p className="text-lg font-bold font-display text-neon-purple tabular-nums">
                {(liveStats.playtimeHours / 1000).toFixed(1)}K
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-display">
                Hours
              </p>
            </div>
          </div>
        </GlassCard>

        {/* ════════════════════════════════════════════════
            Section 3 — Tactical Readout (Recent Performance)
            ════════════════════════════════════════════════ */}
        <GlassCard className="p-4 gap-3">
          <div className="flex items-center gap-2">
            <Crosshair size={14} className="text-neon-blue" />
            <h3 className="text-xs font-display font-semibold uppercase tracking-[0.3em] text-slate-400">
              /// Recent Performance
            </h3>
          </div>

          <div className="space-y-3.5">
            {liveStats.mainChampions.map((champ) => {
              const isHighKDA = champ.kda >= 4.0
              const isHighWR = champ.winRate >= 60

              return (
                <div key={champ.name} className="group">
                  <div className="flex items-center gap-3">
                    {/* Champion icon */}
                    <div className="w-10 h-10 rounded-sm bg-cyber-darker border border-cyber-border flex items-center justify-center overflow-hidden shrink-0">
                      <Avatar className="h-10 w-10 rounded-sm">
                        <AvatarImage src={champ.imageUrl} alt={champ.name} />
                        <AvatarFallback className="rounded-sm bg-cyber-surface text-slate-500 text-xs font-display font-bold">
                          {champ.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name + KDA */}
                      <div className="flex justify-between items-baseline">
                        <p className="text-sm text-slate-300 truncate font-medium">
                          {champ.name}
                        </p>
                        <p
                          className={cn(
                            "text-sm font-bold font-display ml-2 tabular-nums",
                            isHighKDA
                              ? "text-neon-gold [text-shadow:0_0_6px_rgba(200,169,81,0.3)]"
                              : "text-slate-400",
                          )}
                        >
                          {champ.kda.toFixed(1)} KDA
                        </p>
                      </div>

                      {/* Win rate bar */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-cyber-darker rounded-full border border-cyber-border overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              isHighWR ? rank.bar : "bg-slate-600",
                            )}
                            style={{ width: `${champ.winRate}%` }}
                          />
                        </div>
                        <span
                          className={cn(
                            "text-[11px] font-display font-semibold w-8 text-right tabular-nums",
                            isHighWR
                              ? "text-neon-blue [text-shadow:0_0_6px_rgba(0,212,255,0.3)]"
                              : "text-slate-500",
                          )}
                        >
                          {champ.winRate}%
                        </span>
                      </div>

                      {/* Games played */}
                      <p className="text-[10px] text-slate-500 mt-0.5 font-display tracking-wider">
                        {champ.games} GAMES
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>

        {/* ════════════════════════════════════════════════
            Section 4 — Sync / Connect Account
            ════════════════════════════════════════════════ */}
        <button
          type="button"
          onClick={handleSync}
          disabled={syncPhase !== "idle"}
          className={cn(
            "w-full group relative overflow-hidden rounded-sm border px-4 py-3 text-left transition-all cursor-pointer",
            syncPhase === "success"
              ? "border-green-400/40 bg-green-400/5"
              : syncPhase === "syncing"
                ? "border-neon-blue/30 bg-neon-blue/5 cursor-wait"
                : "border-cyber-border bg-cyber-darker/80 hover:border-neon-blue/40 hover:bg-cyber-surface/80",
          )}
        >
          {/* Subtle hover glow fill — only in idle state */}
          {syncPhase === "idle" && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-sm shadow-[inset_0_0_40px_rgba(0,212,255,0.04)]" />
          )}

          {/* Syncing glow pulse */}
          {syncPhase === "syncing" && (
            <div className="absolute inset-0 bg-neon-blue/5 animate-pulse pointer-events-none rounded-sm" />
          )}

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              {syncPhase === "syncing" ? (
                <Loader2 size={14} className="text-neon-blue animate-spin" />
              ) : syncPhase === "success" ? (
                <CheckCircle size={14} className="text-green-400" />
              ) : (
                <Activity size={14} className="text-slate-500 group-hover:text-neon-blue transition-colors" />
              )}
              <span
                className={cn(
                  "text-xs font-display font-semibold uppercase tracking-[0.2em] transition-colors",
                  syncPhase === "syncing" && "text-neon-blue",
                  syncPhase === "success" && "text-green-400",
                  syncPhase === "idle" && "text-slate-500 group-hover:text-neon-blue",
                )}
              >
                {syncPhase === "syncing"
                  ? "Syncing with Riot Server..."
                  : syncPhase === "success"
                    ? "Riot account synced successfully!"
                    : "Force Sync Data"}
              </span>
            </div>
            {syncPhase === "idle" && (
              <ChevronRight
                size={14}
                className="text-slate-600 group-hover:text-neon-blue group-hover:translate-x-0.5 transition-all"
              />
            )}
          </div>
          <p
            className={cn(
              "relative text-[10px] mt-1 transition-colors font-display tracking-wider",
              syncPhase === "syncing" && "text-neon-blue/60",
              syncPhase === "success" && "text-green-400/60",
              syncPhase === "idle" && "text-slate-600 group-hover:text-slate-500",
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
