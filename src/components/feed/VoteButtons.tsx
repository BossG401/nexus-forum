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
        // Toggle off
        return {
          upvotes: newType === "upvote" ? state.upvotes - 1 : state.upvotes,
          downvotes: newType === "downvote" ? state.downvotes - 1 : state.downvotes,
          userVote: null,
        }
      }

      if (prevVote === null) {
        // New vote
        return {
          upvotes: newType === "upvote" ? state.upvotes + 1 : state.upvotes,
          downvotes: newType === "downvote" ? state.downvotes + 1 : state.downvotes,
          userVote: newType,
        }
      }

      // Switch vote
      return {
        upvotes: newType === "upvote" ? state.upvotes + 1 : state.upvotes - 1,
        downvotes: newType === "downvote" ? state.downvotes + 1 : state.downvotes - 1,
        userVote: newType,
      }
    },
  )

  const score = optimistic.upvotes - optimistic.downvotes
  const iconClass = size === "lg" ? "size-[26px]" : "size-[22px]"
  const scoreClass = size === "lg" ? "text-sm" : "text-xs"
  const gapClass = size === "lg" ? "gap-0.5 px-4 py-4" : "gap-0.5 px-3 py-3"
  const btnPadding = size === "lg" ? "p-1" : "p-0.5"

  const handleVote = (type: "upvote" | "downvote") => {
    if (status !== "authenticated" || isPending) return
    startTransition(() => {
      addOptimistic({ type })
      votePost(postId, type).catch(() => {
        // Optimistic update will revert on re-render from router.refresh()
      })
    })
  }

  return (
    <div className={cn("flex flex-col items-center bg-cyber-dark/60 border-r border-white/[0.04]", gapClass)}>
      <button
        onClick={() => handleVote("upvote")}
        disabled={isPending}
        className={cn(
          "transition-colors rounded-sm hover:bg-neon-gold/10",
          btnPadding,
          optimistic.userVote === "upvote"
            ? "text-green-400"
            : "text-slate-600 hover:text-neon-gold",
          status !== "authenticated" && "cursor-not-allowed opacity-50",
        )}
        title={status !== "authenticated" ? "Sign in to vote" : "Upvote"}
      >
        <ArrowBigUp className={iconClass} strokeWidth={1.5} />
      </button>

      <span
        className={cn(
          "font-bold font-display tabular-nums select-none",
          scoreClass,
          score > 0 ? "text-neon-gold" : score < 0 ? "text-red-400" : "text-slate-500",
        )}
      >
        {score > 0 ? `+${score}` : score}
      </span>

      <button
        onClick={() => handleVote("downvote")}
        disabled={isPending}
        className={cn(
          "transition-colors rounded-sm hover:bg-red-400/10",
          btnPadding,
          optimistic.userVote === "downvote"
            ? "text-red-400"
            : "text-slate-600 hover:text-red-400",
          status !== "authenticated" && "cursor-not-allowed opacity-50",
        )}
        title={status !== "authenticated" ? "Sign in to vote" : "Downvote"}
      >
        <ArrowBigDown className={iconClass} strokeWidth={1.5} />
      </button>
    </div>
  )
}
