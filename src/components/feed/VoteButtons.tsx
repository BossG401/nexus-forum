"use client"

import { useOptimistic, useTransition } from "react"
import { useSession } from "next-auth/react"
import { ArrowBigUp, ArrowBigDown } from "lucide-react"
import { votePost, type VoteResult } from "@/actions/vote"
import { cn } from "@/lib/utils"

interface VoteButtonsProps {
  postId: string
  upvotes: number
  downvotes: number
  userVote?: "upvote" | "downvote" | null
  size?: "sm" | "lg"
}

export function VoteButtons({ postId, upvotes, downvotes, userVote, size = "sm" }: VoteButtonsProps) {
  const { status } = useSession()
  const [isPending, startTransition] = useTransition()

  const [optimistic, addOptimistic] = useOptimistic<
    { upvotes: number; downvotes: number; userVote: "upvote" | "downvote" | null },
    { type: "upvote" | "downvote" }
  >(
    { upvotes, downvotes, userVote: userVote ?? null },
    (state, action) => {
      const prevVote = state.userVote
      const newType = action.type

      if (prevVote === newType) {
        return {
          upvotes: newType === "upvote" ? state.upvotes - 1 : state.upvotes,
          downvotes: newType === "downvote" ? state.downvotes - 1 : state.downvotes,
          userVote: null,
        }
      }

      if (prevVote === null) {
        return {
          upvotes: newType === "upvote" ? state.upvotes + 1 : state.upvotes,
          downvotes: newType === "downvote" ? state.downvotes + 1 : state.downvotes,
          userVote: newType,
        }
      }

      return {
        upvotes: newType === "upvote" ? state.upvotes + 1 : state.upvotes - 1,
        downvotes: newType === "downvote" ? state.downvotes + 1 : state.downvotes - 1,
        userVote: newType,
      }
    },
  )

  const score = optimistic.upvotes - optimistic.downvotes
  const iconClass = size === "lg" ? "size-[24px]" : "size-[20px]"
  const scoreClass = size === "lg" ? "text-sm" : "text-xs"
  const gapClass = size === "lg" ? "gap-1 px-4 py-5" : "gap-0.5 px-3 py-4"
  const btnPadding = size === "lg" ? "p-1.5" : "p-1"

  const handleVote = (type: "upvote" | "downvote") => {
    if (status !== "authenticated" || isPending) return
    startTransition(() => {
      addOptimistic({ type })
      votePost(postId, type).catch(() => {})
    })
  }

  return (
    <div className={cn(
      "flex flex-col items-center bg-cyber-dark/50 border-r border-white/[0.03]",
      gapClass
    )}>
      <button
        onClick={() => handleVote("upvote")}
        disabled={isPending}
        className={cn(
          "rounded-md transition-all duration-200 active:scale-90",
          btnPadding,
          optimistic.userVote === "upvote"
            ? "text-green-400 bg-green-400/[0.08] shadow-[0_0_8px_rgba(74,222,128,0.15)]"
            : "text-slate-500 hover:text-neon-gold hover:bg-neon-gold/[0.06]",
          status !== "authenticated" && "cursor-not-allowed opacity-40",
        )}
        title={status !== "authenticated" ? "Sign in to vote" : "Upvote"}
      >
        <ArrowBigUp className={cn(iconClass, "transition-transform duration-200")} strokeWidth={1.5} />
      </button>

      <span
        className={cn(
          "font-bold font-display tabular-nums select-none transition-all duration-300",
          scoreClass,
          score > 0 ? "text-neon-gold" : score < 0 ? "text-red-400" : "text-slate-500/60",
        )}
      >
        {score > 0 ? `+${score}` : score}
      </span>

      <button
        onClick={() => handleVote("downvote")}
        disabled={isPending}
        className={cn(
          "rounded-md transition-all duration-200 active:scale-90",
          btnPadding,
          optimistic.userVote === "downvote"
            ? "text-red-400 bg-red-400/[0.08] shadow-[0_0_8px_rgba(239,68,68,0.15)]"
            : "text-slate-500 hover:text-red-400 hover:bg-red-400/[0.06]",
          status !== "authenticated" && "cursor-not-allowed opacity-40",
        )}
        title={status !== "authenticated" ? "Sign in to vote" : "Downvote"}
      >
        <ArrowBigDown className={cn(iconClass, "transition-transform duration-200")} strokeWidth={1.5} />
      </button>
    </div>
  )
}
