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
  "neon-blue": "border-neon-blue/40 bg-neon-blue/10 text-neon-blue",
  "neon-gold": "border-neon-gold/40 bg-neon-gold/10 text-neon-gold",
  "neon-purple": "border-neon-purple/40 bg-neon-purple/10 text-neon-purple",
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
      // createPost redirects on success, so we only get here on error
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post")
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-neon-blue transition-colors mb-6 font-display tracking-wider uppercase group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Feed
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <Terminal size={22} className="text-neon-blue" />
        <h1 className="text-2xl font-bold font-display neon-text-blue tracking-[0.2em] uppercase">
          /// Draft Dispatch
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="flex items-center gap-1.5 text-xs text-slate-400 font-display tracking-wider uppercase mb-2">
            <Hash size={12} />
            Title
          </label>
          <Input
            type="text"
            placeholder="Enter a tactical title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            required
            className="input-tech focus:input-tech-focus text-slate-200 placeholder:text-slate-600"
          />
        </div>

        {/* Tag selector */}
        <div>
          <label className="flex items-center gap-1.5 text-xs text-slate-400 font-display tracking-wider uppercase mb-2">
            <Palette size={12} />
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => handleTagSelect(t.name, t.accent)}
                className={cn(
                  "px-3 py-1.5 rounded-sm text-xs font-display font-semibold uppercase tracking-wider border transition-all",
                  tag === t.name
                    ? accentBorder[t.accent]
                    : "border-cyber-border/40 text-slate-500 hover:border-slate-500 hover:text-slate-400",
                )}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content preview (short) */}
        <div>
          <label className="flex items-center gap-1.5 text-xs text-slate-400 font-display tracking-wider uppercase mb-2">
            <Terminal size={12} />
            Summary Blurb (shown in feed)
          </label>
          <textarea
            placeholder=">_ Write a short preview for the feed..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            maxLength={500}
            required
            className="w-full input-tech focus:input-tech-focus text-slate-200 placeholder:text-slate-600 resize-none font-mono text-sm rounded-sm px-3 py-2"
          />
          <p className="text-[10px] text-slate-600 text-right mt-1">{content.length}/500</p>
        </div>

        {/* Full markdown content */}
        <div>
          <label className="flex items-center gap-1.5 text-xs text-slate-400 font-display tracking-wider uppercase mb-2">
            <Terminal size={12} />
            Full Analysis (Markdown, optional)
          </label>
          <textarea
            placeholder={`# Header\n\n## Sub-header\n\n- Bullet point\n\n**Bold** text\n\n| Col 1 | Col 2 |\n|-------|-------|\n| A     | B     |`}
            value={fullContent}
            onChange={(e) => setFullContent(e.target.value)}
            rows={12}
            className="w-full input-tech focus:input-tech-focus text-slate-200 placeholder:text-slate-600 resize-y font-mono text-sm rounded-sm px-3 py-2"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-400/10 border border-red-400/30 rounded-sm px-4 py-3 text-sm text-red-400 font-display tracking-wider">
            /// {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] text-slate-600 font-display tracking-wider">
            Draft will be published immediately
          </span>
          <Button
            type="submit"
            disabled={submitting || !title.trim() || !content.trim()}
            className="flex items-center gap-2 bg-neon-blue text-cyber-dark hover:bg-neon-blue/90 hover:glow-blue transition-all font-semibold font-display uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyber-dark border-t-transparent" />
                Deploying...
              </>
            ) : (
              <>
                <Send size={16} />
                Deploy Dispatch
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
