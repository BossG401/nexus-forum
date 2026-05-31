"use client"

import { useState, useRef } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { SendHorizontal, Terminal, LogIn } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createComment } from "@/actions/comment"
import { mockUserStats } from "@/data/mock-user-stats"

interface CommentInputProps {
  postId: string
}

export function CommentInput({ postId }: CommentInputProps) {
  const { data: session, status } = useSession()
  const [value, setValue] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!value.trim() || submitting) return

    setSubmitting(true)
    try {
      await createComment(postId, value.trim())
      setValue("")
      router.refresh()
    } catch (err) {
      console.error("Failed to post comment:", err)
    } finally {
      setSubmitting(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // ── Loading state ──
  if (status === "loading") {
    return (
      <div className="flex gap-3">
        <div className="h-9 w-9 rounded-full bg-cyber-surface animate-pulse shrink-0 mt-1" />
        <div className="flex-1 space-y-2 animate-pulse">
          <div className="h-3 bg-cyber-surface rounded-sm w-20" />
          <div className="h-20 bg-cyber-surface rounded-sm w-full" />
          <div className="flex justify-between">
            <div className="h-3 bg-cyber-surface rounded-sm w-28" />
            <div className="h-7 bg-cyber-surface rounded-sm w-16" />
          </div>
        </div>
      </div>
    )
  }

  // ── Unauthenticated: auth gate ──
  if (!session?.user) {
    return (
      <div className="flex gap-3">
        <Avatar className="h-9 w-9 ring-1 ring-slate-700 shrink-0 mt-1 opacity-40">
          <AvatarFallback className="bg-cyber-surface text-slate-600 text-xs font-display font-bold">
            ?
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 relative">
          {/* Terminal prompt line */}
          <div className="flex items-center gap-2 mb-1.5">
            <Terminal size={12} className="text-slate-600" />
            <span className="text-[10px] text-slate-600 font-display tracking-wider uppercase">
              Tactical Input
            </span>
          </div>

          {/* Disabled textarea */}
          <div className="w-full bg-cyber-darker/40 border border-cyber-border/50 rounded-sm px-3 py-4 text-sm text-slate-600 font-mono text-center select-none">
            <LogIn size={16} className="inline-block mr-1.5 text-slate-600" />
            Authenticate to engage in tactical comms
          </div>

          {/* Action bar with login CTA */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-slate-700 font-display tracking-wider">
              Authentication required
            </span>
            <button
              onClick={() => signIn()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-xs font-display font-semibold uppercase tracking-wider hover:bg-neon-blue/20 hover:border-neon-blue/50 transition-all"
            >
              <LogIn size={12} />
              Connect
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Authenticated: terminal input ──
  return (
    <div className="flex gap-3">
      {/* Current user avatar */}
      <Avatar className="h-9 w-9 ring-1 ring-neon-gold/30 shrink-0 mt-1">
        <AvatarImage
          src={session.user.image ?? mockUserStats.avatarUrl}
          alt={session.user.name ?? mockUserStats.summonerName}
        />
        <AvatarFallback className="bg-neon-gold/20 text-neon-gold text-xs font-display font-bold">
          {(session.user.name ?? "S").charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 relative">
        {/* Terminal prompt line */}
        <div className="flex items-center gap-2 mb-1.5">
          <Terminal size={12} className="text-slate-600" />
          <span className="text-[10px] text-slate-600 font-display tracking-wider uppercase">
            Tactical Input
          </span>
        </div>

        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder=">_ Draft your tactical analysis..."
          rows={3}
          disabled={submitting}
          className="w-full bg-cyber-darker/80 border border-cyber-border rounded-sm px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 resize-none transition-all focus:outline-none focus:border-neon-blue/50 focus:shadow-[0_0_15px_rgba(0,212,255,0.1)] font-mono disabled:opacity-50"
        />

        {/* Action bar */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-slate-600 font-display tracking-wider">
            Ctrl + Enter to deploy
          </span>
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || submitting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-xs font-display font-semibold uppercase tracking-wider hover:bg-neon-blue/20 hover:border-neon-blue/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-neon-blue border-t-transparent" />
                Deploying
              </>
            ) : (
              <>
                <SendHorizontal size={12} />
                Deploy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
