"use client"

import { useState, useRef } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { SendHorizontal, Terminal, LogIn } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createComment } from "@/actions/comment"
import { mockUserStats } from "@/data/mock-user-stats"
import { cn } from "@/lib/utils"

interface CommentInputProps {
  postId: string
}

export function CommentInput({ postId }: CommentInputProps) {
  const { data: session, status } = useSession()
  const [value, setValue] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [focused, setFocused] = useState(false)
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

  //─── Loading state ───
  if (status === "loading") {
    return (
      <div className="flex gap-3">
        <div className="h-9 w-9 rounded-full bg-white/[0.03] animate-pulse shrink-0 mt-1" />
        <div className="flex-1 space-y-2.5 animate-pulse">
          <div className="h-3 bg-white/[0.03] rounded-md w-20" />
          <div className="h-20 bg-white/[0.03] rounded-md w-full" />
          <div className="flex justify-between">
            <div className="h-3 bg-white/[0.03] rounded-md w-28" />
            <div className="h-7 bg-white/[0.03] rounded-md w-16" />
          </div>
        </div>
      </div>
    )
  }

  //─── Unauthenticated: auth gate ───
  if (!session?.user) {
    return (
      <div className="flex gap-3">
        <Avatar className="h-9 w-9 ring-1 ring-white/[0.04] shrink-0 mt-1 opacity-40">
          <AvatarFallback className="bg-cyber-surface text-slate-600 text-xs font-display font-bold">
            ?
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 relative">
          <div className="flex items-center gap-2 mb-2">
            <Terminal size={11} className="text-slate-600/60" />
            <span className="text-[10px] text-slate-600/50 font-display tracking-wider uppercase">
              Tactical Input
            </span>
          </div>

          <div className="w-full bg-cyber-darker/30 border border-white/[0.04] rounded-lg px-3.5 py-5 text-sm text-slate-600/50 font-mono text-center select-none">
            <LogIn size={15} className="inline-block mr-1.5 text-slate-600/50" />
            Authenticate to engage in tactical comms
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="text-[10px] text-slate-700/50 font-display tracking-wider">
              Authentication required
            </span>
            <button
              onClick={() => signIn()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neon-blue/[0.06] border border-neon-blue/20 text-neon-blue text-xs font-display font-semibold uppercase tracking-wider hover:bg-neon-blue/[0.12] hover:border-neon-blue/40 hover:shadow-[0_0_12px_rgba(0,212,255,0.06)] active:scale-[0.97] transition-all duration-200"
            >
              <LogIn size={12} />
              Connect
            </button>
          </div>
        </div>
      </div>
    )
  }

  //─── Authenticated: terminal input ───
  return (
    <div className="flex gap-3">
      <Avatar className="h-9 w-9 ring-1 ring-neon-gold/20 shrink-0 mt-1">
        <AvatarImage
          src={session.user.image ?? mockUserStats.avatarUrl}
          alt={session.user.name ?? mockUserStats.summonerName}
        />
        <AvatarFallback className="bg-neon-gold/15 text-neon-gold text-xs font-display font-bold">
          {(session.user.name ?? "S").charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 relative">
        <div className="flex items-center gap-2 mb-2">
          <Terminal size={11} className={cn(
            "transition-colors duration-200",
            focused ? "text-neon-blue/60" : "text-slate-600/50"
          )} />
          <span className={cn(
            "text-[10px] font-display tracking-wider uppercase transition-colors duration-200",
            focused ? "text-slate-400/60" : "text-slate-600/40"
          )}>
            Tactical Input
          </span>
        </div>

        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder=">_ Draft your tactical analysis..."
          rows={3}
          disabled={submitting}
          className={cn(
            "w-full bg-cyber-darker/70 border rounded-lg px-3.5 py-3 text-[13px] text-slate-200 placeholder:text-slate-600/40 resize-none font-mono",
            "transition-all duration-200",
            "focus:outline-none",
            focused
              ? "border-neon-blue/35 shadow-[0_0_16px_rgba(0,212,255,0.06)] bg-cyber-darker/90"
              : "border-white/[0.04]",
            "disabled:opacity-40"
          )}
        />

        <div className="flex items-center justify-between mt-2.5">
          <span className="text-[10px] text-slate-600/30 font-display tracking-wider">
            Ctrl + Enter to deploy
          </span>
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || submitting}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-display font-semibold uppercase tracking-wider",
              "bg-neon-blue/[0.06] border border-neon-blue/20 text-neon-blue",
              "hover:bg-neon-blue/[0.12] hover:border-neon-blue/40 hover:shadow-[0_0_12px_rgba(0,212,255,0.06)]",
              "active:scale-[0.97]",
              "transition-all duration-200",
              "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
            )}
          >
            {submitting ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-neon-blue/70 border-t-transparent" />
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
