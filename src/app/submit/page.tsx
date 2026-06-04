"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Send, Terminal, Hash, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createPost } from "@/actions/post"
import { cn } from "@/lib/utils"

const TAG_OPTIONS = [
  { name: "#PatchNotes", accent: "neon-blue" },
  { name: "#Esports", accent: "neon-gold" },
  { name: "#LookingForGroup", accent: "neon-purple" },
  { name: "#Gameplay", accent: "neon-blue" },
  { name: "#Memes", accent: "neon-purple" },
  { name: "#Champions", accent: "neon-gold" },
  { name: "#Strategy", accent: "neon-blue" },
] as const

const accentBorder: Record<string, string> = {
  "neon-blue": "border-neon-blue/35 bg-neon-blue/[0.08] text-neon-blue shadow-[0_0_10px_rgba(0,212,255,0.08)]",
  "neon-gold": "border-neon-gold/35 bg-neon-gold/[0.08] text-neon-gold shadow-[0_0_10px_rgba(200,169,81,0.08)]",
  "neon-purple": "border-neon-purple/35 bg-neon-purple/[0.08] text-neon-purple shadow-[0_0_10px_rgba(168,85,247,0.08)]",
}

export default function SubmitPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [fullContent, setFullContent] = useState("")
  const [tag, setTag] = useState("#Gameplay")
  const [tagAccent, setTagAccent] = useState("neon-blue")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTagSelect = (name: string, accent: string) => {
    setTag(name)
    setTagAccent(accent)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      formData.append("fullContent", fullContent)
      formData.append("tag", tag)
      formData.append("tagAccent", tagAccent)

      await createPost(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post")
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl animate-fade-in-up">
      {/* Header */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500/70 hover:text-neon-blue transition-all duration-200 mb-8 font-display tracking-wider uppercase group"
      >
        <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
        Back to Feed
      </Link>

      <div className="flex items-center gap-3 mb-10">
        <Terminal size={20} className="text-neon-blue/80" />
        <h1 className="text-xl font-bold font-display neon-text-blue tracking-[0.25em] uppercase">
          /// Draft Dispatch
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Title */}
        <div>
          <label className="flex items-center gap-1.5 text-[11px] text-slate-400/70 font-display tracking-wider uppercase mb-2.5">
            <Hash size={11} className="opacity-60" />
            Title
          </label>
          <Input
            type="text"
            placeholder="Enter a tactical title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            required
            className="input-tech focus:input-tech-focus text-slate-200 placeholder:text-slate-600/50 h-10 rounded-lg text-sm"
          />
        </div>

        {/* Tag selector */}
        <div>
          <label className="flex items-center gap-1.5 text-[11px] text-slate-400/70 font-display tracking-wider uppercase mb-2.5">
            <Palette size={11} className="opacity-60" />
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => handleTagSelect(t.name, t.accent)}
                className={cn(
                  "px-3.5 py-1.5 rounded-md text-xs font-display font-semibold uppercase tracking-wider border transition-all duration-200",
                  "active:scale-95",
                  tag === t.name
                    ? accentBorder[t.accent]
                    : "border-white/[0.06] text-slate-500/70 hover:border-white/[0.12] hover:text-slate-400 hover:bg-white/[0.02]",
                )}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content preview (short) */}
        <div>
          <label className="flex items-center gap-1.5 text-[11px] text-slate-400/70 font-display tracking-wider uppercase mb-2.5">
            <Terminal size={11} className="opacity-60" />
            Summary Blurb
            <span className="text-slate-600/40 normal-case tracking-normal font-sans">(shown in feed)</span>
          </label>
          <textarea
            placeholder=">_ Write a short preview for the feed..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            maxLength={500}
            required
            className="w-full input-tech focus:input-tech-focus text-slate-200 placeholder:text-slate-600/50 resize-none font-mono text-[13px] rounded-lg px-4 py-3 leading-relaxed"
          />
          <p className="text-[10px] text-slate-600/40 text-right mt-1.5 font-display tracking-wider">
            {content.length}/500
          </p>
        </div>

        {/* Full markdown content */}
        <div>
          <label className="flex items-center gap-1.5 text-[11px] text-slate-400/70 font-display tracking-wider uppercase mb-2.5">
            <Terminal size={11} className="opacity-60" />
            Full Analysis
            <span className="text-slate-600/40 normal-case tracking-normal font-sans">(Markdown, optional)</span>
          </label>
          <textarea
            placeholder={`# Header\n\n## Sub-header\n\n- Bullet point\n\n**Bold** text\n\n| Col 1 | Col 2 |\n|-------|-------|\n| A     | B     |`}
            value={fullContent}
            onChange={(e) => setFullContent(e.target.value)}
            rows={12}
            className="w-full input-tech focus:input-tech-focus text-slate-200 placeholder:text-slate-600/50 resize-y font-mono text-[13px] rounded-lg px-4 py-3 leading-relaxed"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-400/[0.06] border border-red-400/25 rounded-lg px-4 py-3 text-sm text-red-400/90 font-display tracking-wider animate-fade-in">
            /// {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-between pt-3">
          <span className="text-[10px] text-slate-600/40 font-display tracking-wider">
            Draft will be published immediately
          </span>
          <Button
            type="submit"
            disabled={submitting || !title.trim() || !content.trim()}
            className={cn(
              "flex items-center gap-2 h-10 px-5 rounded-lg",
              "bg-neon-blue text-cyber-dark",
              "hover:bg-neon-blue/90 hover:shadow-[0_0_24px_rgba(0,212,255,0.25)]",
              "active:scale-[0.97]",
              "transition-all duration-200",
              "font-semibold font-display uppercase tracking-wider text-xs",
              "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
            )}
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyber-dark/70 border-t-transparent" />
                Deploying...
              </>
            ) : (
              <>
                <Send size={14} strokeWidth={2.5} />
                Deploy Dispatch
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
