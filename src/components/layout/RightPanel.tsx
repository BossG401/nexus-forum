"use client"

import * as React from "react"
import { useSession, signIn } from "next-auth/react"
import { Crosshair, Activity, ChevronRight, ShieldAlert, Loader2, CheckCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { UserStats } from "@/lib/types"

const rankTheme: Record<string, { text: string; bar: string; ring: string; glow: string }> = {
  Challenger: { text: "text-neon-gold-hot neon-text-gold", bar: "bg-neon-gold", ring: "ring-neon-gold/40", glow: "shadow-[0_0_20px_rgba(212,168,67,0.3),0_0_60px_rgba(212,168,67,0.08)]" },
  Grandmaster: { text: "text-neon-crimson neon-text-crimson", bar: "bg-neon-crimson", ring: "ring-neon-crimson/40", glow: "shadow-[0_0_20px_rgba(255,45,85,0.3),0_0_60px_rgba(255,45,85,0.08)]" },
  Master: { text: "text-neon-purple-hot neon-text-purple", bar: "bg-neon-purple", ring: "ring-neon-purple/40", glow: "shadow-[0_0_20px_rgba(168,85,247,0.3),0_0_60px_rgba(168,85,247,0.08)]" },
  Diamond: { text: "text-neon-blue-hot neon-text-blue", bar: "bg-neon-blue", ring: "ring-neon-blue/40", glow: "shadow-[0_0_20px_rgba(0,212,255,0.3),0_0_60px_rgba(0,212,255,0.08)]" },
  Platinum: { text: "text-teal-300 [text-shadow:0_0_8px_rgba(45,212,191,0.4)]", bar: "bg-teal-400", ring: "ring-teal-400/35", glow: "" },
  Gold: { text: "text-yellow-400 [text-shadow:0_0_8px_rgba(250,204,21,0.3)]", bar: "bg-yellow-400", ring: "ring-yellow-400/30", glow: "" },
}

interface RightPanelProps { userStats: UserStats; className?: string }

export function RightPanel({ userStats, className }: RightPanelProps) {
  const { data: session, status } = useSession()
  const [liveStats, setLiveStats] = React.useState(userStats)
  const [syncPhase, setSyncPhase] = React.useState<"idle" | "syncing" | "success">("idle")
  const rank = rankTheme[liveStats.rank] ?? rankTheme.Gold
  const winPct = Math.round((liveStats.wins / (liveStats.wins + liveStats.losses)) * 100)
  const totalGames = liveStats.wins + liveStats.losses

  const handleSync = () => {
    if (syncPhase !== "idle") return; setSyncPhase("syncing")
    const base = liveStats.wins + liveStats.losses
    setTimeout(() => {
      const wr = Math.floor(Math.random() * 21) + 45; const w = Math.round((base * wr) / 100)
      setLiveStats((p) => ({ ...p, lp: Math.floor(Math.random() * 1401) + 100, wins: w, losses: base - w, winRate: wr, kda: parseFloat((Math.random() * 6 + 2).toFixed(1)) }))
      setSyncPhase("success"); setTimeout(() => setSyncPhase("idle"), 2500)
    }, 2000)
  }

  React.useEffect(() => {
    setLiveStats((p) => ({ ...p, summonerName: userStats.summonerName, rank: userStats.rank, rankTier: userStats.rankTier, server: userStats.server, region: userStats.region, avatarUrl: userStats.avatarUrl, status: userStats.status }))
  }, [userStats.summonerName, userStats.rank, userStats.rankTier, userStats.server, userStats.region, userStats.avatarUrl, userStats.status])

  if (status === "loading") {
    return (
      <aside className={className}><div className="p-3 space-y-3 stagger-children">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ "--stagger": i } as React.CSSProperties} className="glass-subtle clip-chamfer p-2.5">
            <div className="space-y-3 animate-pulse"><div className="h-3 bg-white/[0.05] w-2/3" /><div className="h-6 bg-white/[0.05] w-1/2" /><div className="h-1 bg-white/[0.05] w-full" /></div>
          </div>
        ))}
      </div></aside>
    )
  }

  if (!session?.user) {
    return (
      <aside className={className}><div className="p-3 space-y-3 animate-fade-in">
        <div className="relative overflow-hidden clip-chamfer">
          <div className="blur-lg opacity-40 pointer-events-none select-none p-5 space-y-4">
            <div className="flex items-center gap-3"><div className="h-12 w-12 bg-neon-gold/25 clip-diamond" /><div className="space-y-2"><div className="h-3 w-24 bg-white/[0.08]" /><div className="h-2 w-16 bg-neon-blue/[0.08]" /></div></div>
            <div className="grid grid-cols-2 gap-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-white/[0.05] clip-chamfer" />)}</div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-cyber-darker/85 backdrop-blur-sm clip-chamfer border border-neon-blue/[0.08]">
            <ShieldAlert size={24} className="text-neon-crimson/60 mb-3 animate-neon-pulse" />
            <p className="text-[10px] font-display font-black uppercase tracking-[0.4em] text-slate-300 mb-1">CLASSIFIED</p>
            <p className="text-[9px] text-slate-400/60 mb-5 text-center px-6 font-mono">Authenticate to access tactical intel</p>
            <button onClick={() => signIn()} className="flex items-center gap-2 px-5 py-2 clip-tag bg-neon-blue/[0.08] border border-neon-blue/25 text-neon-blue text-[10px] font-display font-black uppercase tracking-widest hover:bg-neon-blue/[0.15] hover:border-neon-blue/40 hover:glow-blue active:scale-95 transition-all duration-200">CONNECT</button>
          </div>
        </div>
      </div></aside>
    )
  }

  return (
    <aside className={className}><div className="p-2.5 space-y-2.5 animate-fade-in">
      {/* IDENTITY */}
      <div className="glass clip-chamfer p-2.5 corner-marks">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className={cn("h-12 w-12 ring-2 clip-diamond transition-all duration-300", rank.ring, rank.glow)}>
              <AvatarImage src={liveStats.avatarUrl} alt={liveStats.summonerName} />
              <AvatarFallback className="bg-neon-blue/10 text-neon-blue text-base font-display font-black">{liveStats.summonerName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-neon-green clip-tag shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-display font-black text-slate-100 truncate uppercase tracking-wider">{liveStats.summonerName}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={cn("text-[10px] font-display font-black uppercase tracking-widest", rank.text)}>{liveStats.rank}</span>
              {liveStats.rankTier && <span className="text-[9px] text-slate-400/60 font-display tracking-wider">{liveStats.rankTier}</span>}
            </div>
            <p className="text-[8px] text-slate-400/55 font-mono tracking-wider mt-0.5">{liveStats.server} / {liveStats.region}</p>
          </div>
        </div>
        <Separator className="my-3 bg-neon-blue/[0.06]" />
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: "LP", value: liveStats.lp.toLocaleString(), accent: rank.text },
            { label: "WIN%", value: `${liveStats.winRate}%`, accent: liveStats.winRate >= 52 ? "text-neon-green" : "text-slate-200" },
            { label: "KDA", value: liveStats.kda.toFixed(1), accent: liveStats.kda >= 4 ? "text-neon-blue-hot" : "text-slate-200" },
          ].map((s) => (
            <div key={s.label} className="text-center py-2 clip-chamfer bg-white/[0.025] border border-white/[0.04]">
              <p className={cn("text-sm font-display font-black tabular-nums", s.accent)}>{s.value}</p>
              <p className="text-[7px] text-slate-400/55 font-display font-bold tracking-[0.25em] uppercase mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PERFORMANCE */}
      <div className="glass-subtle clip-chamfer p-2.5">
        <div className="flex items-center gap-2 mb-3">
          <Crosshair size={11} className="text-neon-blue/60" />
          <h4 className="text-[8px] font-display font-black uppercase tracking-[0.4em] text-neon-blue/55">PERFORMANCE</h4>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[{ v: totalGames, l: "GAMES" }, { v: `${liveStats.playtimeHours}h`, l: "PLAYTIME" }].map((s) => (
            <div key={s.l} className="py-2 px-3 clip-chamfer bg-white/[0.02] border border-white/[0.04]">
              <p className="text-base font-display font-black text-slate-100 tabular-nums">{s.v}</p>
              <p className="text-[7px] text-slate-400/55 font-display font-bold tracking-widest uppercase mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
        <div>
          <div className="flex items-center justify-between text-[8px] text-slate-400/60 font-mono tracking-wider mb-1.5">
            <span>{liveStats.wins}W</span>
            <span className={cn("font-display font-bold", winPct >= 52 ? "text-neon-green" : "text-slate-300")}>{winPct}%</span>
            <span>{liveStats.losses}L</span>
          </div>
          <div className="h-1 bg-white/[0.05] overflow-hidden clip-tag">
            <div className={cn("h-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]", rank.bar)} style={{ width: `${winPct}%` }} />
          </div>
        </div>
      </div>

      {/* TOP AGENTS */}
      <div className="glass-subtle clip-chamfer p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={11} className="text-neon-gold/60" />
          <h4 className="text-[8px] font-display font-black uppercase tracking-[0.4em] text-neon-gold/55">TOP AGENTS</h4>
        </div>
        <div className="space-y-2">
          {liveStats.mainChampions.map((champ) => {
            const hi = champ.winRate >= 52
            return (
              <div key={champ.name} className="flex items-center gap-2.5 py-2 px-2 clip-chamfer hover:bg-white/[0.025] transition-all duration-200 hover:skew-x-[-1deg]">
                <Avatar className="h-8 w-8 ring-1 ring-white/[0.06] clip-chamfer">
                  <AvatarImage src={champ.imageUrl} alt={champ.name} className="object-cover" />
                  <AvatarFallback className="bg-cyber-surface text-slate-400 text-[8px] font-display font-bold">{champ.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-slate-200 font-display font-bold uppercase tracking-wider truncate">{champ.name}</p>
                    <span className="text-[9px] text-slate-300/70 font-mono tabular-nums ml-2">{champ.kda.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex-1 h-0.5 bg-white/[0.05] overflow-hidden clip-tag">
                      <div className={cn("h-full transition-all duration-1000", hi ? rank.bar : "bg-slate-500/60")} style={{ width: `${champ.winRate}%` }} />
                    </div>
                    <span className={cn("text-[8px] font-display font-black w-7 text-right tabular-nums", hi ? "text-neon-blue-hot [text-shadow:0_0_4px_rgba(0,212,255,0.3)]" : "text-slate-400/60")}>{champ.winRate}%</span>
                  </div>
                  <p className="text-[7px] text-slate-400/50 mt-0.5 font-mono tracking-wider">{champ.games} GAMES</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* SYNC */}
      <button type="button" onClick={handleSync} disabled={syncPhase !== "idle"}
        className={cn("w-full group relative overflow-hidden clip-chamfer border px-4 py-3 text-left transition-all duration-300 cursor-pointer",
          syncPhase === "success" ? "border-neon-green/30 bg-neon-green/[0.04]" : syncPhase === "syncing" ? "border-neon-blue/25 bg-neon-blue/[0.04] cursor-wait" : "border-white/[0.06] bg-white/[0.02] hover:border-neon-blue/30 hover:bg-neon-blue/[0.03]")}>
        {syncPhase === "syncing" && <div className="absolute inset-0 bg-neon-blue/[0.03] animate-pulse pointer-events-none" />}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            {syncPhase === "syncing" ? <Loader2 size={12} className="text-neon-blue animate-spin" /> : syncPhase === "success" ? <CheckCircle size={12} className="text-neon-green" /> : <Activity size={11} className="text-slate-400/60 group-hover:text-neon-blue transition-colors duration-200" />}
            <span className={cn("text-[9px] font-display font-black uppercase tracking-[0.25em] transition-colors duration-200", syncPhase === "syncing" ? "text-neon-blue" : syncPhase === "success" ? "text-neon-green" : "text-slate-300/60 group-hover:text-neon-blue")}>
              {syncPhase === "syncing" ? "SYNCING..." : syncPhase === "success" ? "SYNCED" : "FORCE SYNC"}
            </span>
          </div>
          {syncPhase === "idle" && <ChevronRight size={12} className="text-slate-400/40 group-hover:text-neon-blue group-hover:translate-x-0.5 transition-all duration-200" />}
        </div>
        <p className={cn("relative text-[7px] mt-1 font-mono tracking-wider", syncPhase === "syncing" ? "text-neon-blue/50" : syncPhase === "success" ? "text-neon-green/50" : "text-slate-400/45")}>
          {syncPhase === "syncing" ? "FETCHING MATCH HISTORY..." : syncPhase === "success" ? "RIOT API DATA UPDATED" : "CONNECT RIOT / QQ ACCOUNT"}
        </p>
      </button>
    </div></aside>
  )
}
