"use client"

import * as React from "react"
import { Activity, CheckCircle, Loader2, ShieldAlert, TrendingUp } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { UserStats } from "@/lib/types"

interface RightPanelProps {
  userStats: UserStats
  className?: string
}

export function RightPanel({ userStats, className }: RightPanelProps) {
  const { data: session, status } = useSession()
  const [syncedStats, setSyncedStats] = React.useState<Partial<UserStats>>({})
  const [syncPhase, setSyncPhase] = React.useState<"idle" | "syncing" | "success">("idle")
  const liveStats = { ...userStats, ...syncedStats }

  const totalGames = liveStats.wins + liveStats.losses
  const winPct = totalGames > 0 ? Math.round((liveStats.wins / totalGames) * 100) : 0

  const handleSync = () => {
    if (syncPhase !== "idle") return
    setSyncPhase("syncing")

    setTimeout(() => {
      const winRate = Math.floor(Math.random() * 21) + 45
      const wins = Math.round((Math.max(totalGames, 1) * winRate) / 100)

      setSyncedStats({
        lp: Math.floor(Math.random() * 1401) + 100,
        wins,
        losses: Math.max(totalGames, 1) - wins,
        winRate,
        kda: Number.parseFloat((Math.random() * 6 + 2).toFixed(1)),
      })
      setSyncPhase("success")
      setTimeout(() => setSyncPhase("idle"), 2500)
    }, 1200)
  }

  if (status === "loading") {
    return (
      <aside className={className}>
        <div className="space-y-3 p-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-border bg-card p-4">
              <div className="space-y-3 animate-pulse">
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-8 w-1/2 rounded bg-muted" />
                <div className="h-2 w-full rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </aside>
    )
  }

  if (!session?.user) {
    return (
      <aside className={className}>
        <div className="p-4">
          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <ShieldAlert size={24} className="mx-auto text-primary" />
            <h3 className="mt-3 text-lg font-semibold text-foreground">Sign in for stats</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Connect your account to see rank, performance, and champion history.
            </p>
            <button
              onClick={() => signIn()}
              className="mt-5 h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Sign in
            </button>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className={className}>
      <div className="space-y-4 p-4">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-border">
              <AvatarImage src={liveStats.avatarUrl} alt={liveStats.summonerName} />
              <AvatarFallback className="bg-secondary text-base font-semibold text-secondary-foreground">
                {liveStats.summonerName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-foreground">{liveStats.summonerName}</h3>
              <p className="mt-0.5 text-sm text-primary">
                {liveStats.rank}
                {liveStats.rankTier ? ` ${liveStats.rankTier}` : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                {liveStats.server} / {liveStats.region}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: "LP", value: liveStats.lp.toLocaleString() },
              { label: "Win", value: `${liveStats.winRate}%` },
              { label: "KDA", value: liveStats.kda.toFixed(1) },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-muted px-3 py-3 text-center">
                <p className="text-lg font-semibold tabular-nums text-foreground">{stat.value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={17} className="text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Performance</h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-muted px-3 py-3">
              <p className="text-xl font-semibold text-foreground">{totalGames}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Games</p>
            </div>
            <div className="rounded-xl bg-muted px-3 py-3">
              <p className="text-xl font-semibold text-foreground">{liveStats.playtimeHours}h</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Playtime</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>{liveStats.wins}W</span>
              <span>{winPct}%</span>
              <span>{liveStats.losses}L</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${winPct}%` }} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Activity size={17} className="text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Top Champions</h4>
          </div>
          <div className="space-y-3">
            {liveStats.mainChampions.map((champion) => (
              <div key={champion.name} className="flex items-center gap-3">
                <Avatar className="h-9 w-9 ring-1 ring-border">
                  <AvatarImage src={champion.imageUrl} alt={champion.name} className="object-cover" />
                  <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
                    {champion.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{champion.name}</p>
                    <span className="text-xs text-muted-foreground">{champion.kda.toFixed(1)} KDA</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary/85"
                        style={{ width: `${champion.winRate}%` }}
                      />
                    </div>
                    <span className="w-9 text-right text-xs text-muted-foreground">
                      {champion.winRate}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={handleSync}
          disabled={syncPhase !== "idle"}
          className={cn(
            "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors",
            syncPhase === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : syncPhase === "syncing"
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:bg-accent",
          )}
        >
          <span>
            <span className="block text-sm font-semibold">
              {syncPhase === "syncing" ? "Syncing..." : syncPhase === "success" ? "Synced" : "Sync stats"}
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">Connect Riot / QQ account</span>
          </span>
          {syncPhase === "syncing" ? (
            <Loader2 size={17} className="animate-spin" />
          ) : syncPhase === "success" ? (
            <CheckCircle size={17} />
          ) : (
            <Activity size={17} />
          )}
        </button>
      </div>
    </aside>
  )
}
