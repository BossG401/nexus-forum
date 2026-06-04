"use client"

import { useOptimistic, useTransition } from "react"
import { useSession } from "next-auth/react"
import { ArrowBigUp, ArrowBigDown } from "lucide-react"
import { votePost } from "@/actions/vote"
import { cn } from "@/lib/utils"

interface VoteButtonsProps { postId: string; upvotes: number; downvotes: number; userVote?: "upvote" | "downvote" | null; size?: "sm" | "lg" }

export function VoteButtons({ postId, upvotes, downvotes, userVote, size = "sm" }: VoteButtonsProps) {
  const { status } = useSession()
  const [isPending, startTransition] = useTransition()
  const [optimistic, addOptimistic] = useOptimistic<{ upvotes: number; downvotes: number; userVote: "upvote" | "downvote" | null }, { type: "upvote" | "downvote" }>(
    { upvotes, downvotes, userVote: userVote ?? null },
    (state, action) => {
      const prev = state.userVote, next = action.type
      if (prev === next) return { upvotes: next === "upvote" ? state.upvotes - 1 : state.upvotes, downvotes: next === "downvote" ? state.downvotes - 1 : state.downvotes, userVote: null }
      if (prev === null) return { upvotes: next === "upvote" ? state.upvotes + 1 : state.upvotes, downvotes: next === "downvote" ? state.downvotes + 1 : state.downvotes, userVote: next }
      return { upvotes: next === "upvote" ? state.upvotes + 1 : state.upvotes - 1, downvotes: next === "downvote" ? state.downvotes + 1 : state.downvotes - 1, userVote: next }
    },
  )
  const score = optimistic.upvotes - optimistic.downvotes
  const iconSize = size === "lg" ? 22 : 18
  const scoreSize = size === "lg" ? "text-sm" : "text-[11px]"
  const gap = size === "lg" ? "gap-1 px-4 py-5" : "gap-0.5 px-2 py-2"
  const handleVote = (type: "upvote" | "downvote") => { if (status !== "authenticated" || isPending) return; startTransition(() => { addOptimistic({ type }); votePost(postId, type).catch(() => {}) }) }

  return (
    <div className={cn("flex flex-col items-center border-r border-white/[0.04] bg-gradient-to-b from-cyber-dark/40 to-cyber-darker/60", gap)}>
      <button onClick={() => handleVote("upvote")} disabled={isPending}
        className={cn("p-1 transition-all duration-200 active:scale-75 active:skew-y-[-6deg]",
          optimistic.userVote === "upvote" ? "text-neon-green drop-shadow-[0_0_6px_rgba(0,255,136,0.4)]" : "text-slate-400/60 hover:text-neon-gold hover:skew-y-[-3deg]",
          status !== "authenticated" && "cursor-not-allowed opacity-40")}
        title={status !== "authenticated" ? "Authenticate to vote" : "Upvote"}>
        <ArrowBigUp size={iconSize} strokeWidth={1.5} />
      </button>
      <span className={cn("font-display font-black tabular-nums select-none transition-all duration-300", scoreSize, score > 0 ? "text-neon-gold-hot" : score < 0 ? "text-neon-crimson" : "text-slate-400/50")}>
        {score > 0 ? `+${score}` : score}
      </span>
      <button onClick={() => handleVote("downvote")} disabled={isPending}
        className={cn("p-1 transition-all duration-200 active:scale-75 active:skew-y-[6deg]",
          optimistic.userVote === "downvote" ? "text-neon-crimson drop-shadow-[0_0_6px_rgba(255,45,85,0.4)]" : "text-slate-400/60 hover:text-neon-crimson hover:skew-y-[3deg]",
          status !== "authenticated" && "cursor-not-allowed opacity-40")}
        title={status !== "authenticated" ? "Authenticate to vote" : "Downvote"}>
        <ArrowBigDown size={iconSize} strokeWidth={1.5} />
      </button>
    </div>
  )
}
