"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ImagePlus, X, Upload, Terminal, ChevronDown, Send, Loader2 } from "lucide-react"
import { UploadDropzone } from "@/lib/uploadthing"
import { createPost } from "@/actions/post"
import { cn } from "@/lib/utils"

// ── Tag options (match mockCategories) ──
const TAGS = [
  { name: "#PatchNotes", accent: "neon-blue" },
  { name: "#Esports",    accent: "neon-gold" },
  { name: "#LookingForGroup", accent: "neon-purple" },
  { name: "#Gameplay",   accent: "neon-blue" },
  { name: "#Memes",      accent: "neon-purple" },
  { name: "#Champions",  accent: "neon-gold" },
  { name: "#Strategy",   accent: "neon-blue" },
] as const

const tagAccentBorder: Record<string, string> = {
  "neon-blue":   "border-neon-blue/40 focus:border-neon-blue shadow-[0_0_16px_rgba(0,212,255,0.06)]",
  "neon-purple": "border-neon-purple/40 focus:border-neon-purple shadow-[0_0_16px_rgba(168,85,247,0.06)]",
  "neon-gold":   "border-neon-gold/40 focus:border-neon-gold shadow-[0_0_16px_rgba(212,168,67,0.06)]",
}

export function CreatePostForm() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  // ── Form state ──
  const [tag, setTag] = useState<string>(TAGS[0].name)
  const [tagAccent, setTagAccent] = useState<string>(TAGS[0].accent)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Dropzone reset key — increment to force re-mount
  const [dzKey, setDzKey] = useState(0)

  // ── Submit handler ──
  async function handleSubmit(formData: FormData) {
    setSubmitting(true)
    setError(null)

    try {
      formData.set("tag", tag)
      formData.set("tagAccent", tagAccent)
      if (imageUrl) {
        formData.set("imageUrl", imageUrl)
      }
      await createPost(formData)
      // createPost redirects to / on success — no further action needed
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create post")
      setSubmitting(false)
    }
  }

  // ── Dropzone removed — restore on demand ──
  function removeImage() {
    setImageUrl(null)
    setDzKey((k) => k + 1)
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="glass-subtle clip-chamfer corner-marks p-6 space-y-6 animate-scale-in-brutal"
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-7 bg-neon-blue shadow-[0_0_12px_rgba(0,212,255,0.4)]" />
        <div>
          <h2 className="text-lg font-display font-black neon-text-blue tracking-[0.3em] uppercase">
            TRANSMIT INTEL
          </h2>
          <p className="text-[10px] text-slate-400/60 font-mono tracking-widest mt-0.5">
            // dispatch tactical data to the nexus network
          </p>
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="flex items-center gap-2 bg-neon-crimson/10 border border-neon-crimson/30 px-4 py-2 clip-chamfer animate-fade-in">
          <Terminal size={11} className="text-neon-crimson shrink-0" />
          <p className="text-neon-crimson text-xs font-mono">{error}</p>
        </div>
      )}

      {/* ── Tag selector ── */}
      <div className="space-y-1.5">
        <label className="text-[9px] font-display font-black text-slate-400/60 tracking-[0.3em] uppercase">
          CATEGORY
        </label>
        <div className="relative">
          <select
            value={tag}
            onChange={(e) => {
              const chosen = TAGS.find((t) => t.name === e.target.value)
              setTag(chosen!.name)
              setTagAccent(chosen!.accent)
            }}
            className={cn(
              "w-full appearance-none input-tech px-4 py-2.5 text-sm font-mono text-slate-200",
              "focus:input-tech-focus transition-all duration-200 rounded-none",
              "cursor-pointer",
              tagAccentBorder[tagAccent],
            )}
          >
            {TAGS.map((t) => (
              <option key={t.name} value={t.name} className="bg-cyber-dark text-slate-200">
                {t.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400/60"
          />
        </div>
      </div>

      {/* ── Title ── */}
      <div className="space-y-1.5">
        <label className="text-[9px] font-display font-black text-slate-400/60 tracking-[0.3em] uppercase">
          SUBJECT LINE
        </label>
        <input
          name="title"
          type="text"
          required
          placeholder="e.g. T1 just pulled off the greatest baron steal in LCK history"
          maxLength={200}
          className="w-full input-tech px-4 py-2.5 text-sm font-mono text-slate-200 placeholder:text-slate-500/50 focus:input-tech-focus transition-all duration-200"
        />
      </div>

      {/* ── Content ── */}
      <div className="space-y-1.5">
        <label className="text-[9px] font-display font-black text-slate-400/60 tracking-[0.3em] uppercase">
          INTEL BRIEF
        </label>
        <textarea
          name="content"
          required
          rows={6}
          placeholder="Drop your tactical analysis here. No markdown — just raw intel."
          maxLength={5000}
          className="w-full input-tech px-4 py-3 text-sm font-mono text-slate-200 placeholder:text-slate-500/50 focus:input-tech-focus transition-all duration-200 resize-none"
        />
        <p className="text-[9px] text-slate-400/40 font-mono text-right">
          plain text only — 5,000 characters max
        </p>
      </div>

      {/* ── Full content (optional, for detail page) ── */}
      <div className="space-y-1.5">
        <label className="text-[9px] font-display font-black text-slate-400/60 tracking-[0.3em] uppercase">
          EXTENDED BRIEF <span className="text-slate-500/50">(optional)</span>
        </label>
        <textarea
          name="fullContent"
          rows={4}
          placeholder="Longer analysis for the detail page..."
          maxLength={20000}
          className="w-full input-tech px-4 py-3 text-sm font-mono text-slate-200 placeholder:text-slate-500/50 focus:input-tech-focus transition-all duration-200 resize-none"
        />
      </div>

      {/* ════════════════════════════════════════════
          IMAGE UPLOAD — UploadThing Dropzone
          ════════════════════════════════════════════ */}
      <div className="space-y-1.5">
        <label className="text-[9px] font-display font-black text-slate-400/60 tracking-[0.3em] uppercase">
          COMBAT SCREENSHOT <span className="text-slate-500/50">(optional)</span>
        </label>

        {imageUrl ? (
          /* ── Preview mode — image uploaded ── */
          <div className="relative group clip-chamfer overflow-hidden border border-neon-blue/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Post screenshot preview"
              className="w-full max-h-64 object-cover"
            />
            {/* Overlay with remove button */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={removeImage}
                className="flex items-center gap-1.5 bg-neon-crimson/20 border border-neon-crimson/40 px-4 py-2 text-neon-crimson text-xs font-display font-bold tracking-widest uppercase hover:bg-neon-crimson/30 transition-colors"
              >
                <X size={13} />
                REMOVE
              </button>
            </div>
            {/* Corner marks */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-blue/40 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neon-blue/40 pointer-events-none" />
          </div>
        ) : (
          /* ── Upload dropzone — NEXUS themed ── */
          <div className="relative">
            <UploadDropzone
              key={dzKey}
              endpoint="postImage"
              className="
                ut-allowed-content:hidden
                [&_.ut-upload-icon]:text-neon-blue/60
                [&_.ut-uploading-icon]:text-neon-blue
                [&_.ut-label]:text-neon-blue [&_.ut-label]:font-display [&_.ut-label]:tracking-widest [&_.ut-label]:uppercase
                [&_.ut-upload-icon]:h-10 [&_.ut-upload-icon]:w-10
              "
              appearance={{
                container: cn(
                  "flex flex-col items-center justify-center gap-3 p-8",
                  "border-2 border-dashed border-cyber-border",
                  "bg-cyber-dark/60 backdrop-blur-sm",
                  "hover:border-neon-blue/50 hover:bg-cyber-surface/80",
                  "transition-all duration-300 cursor-crosshair",
                  "clip-chamfer",
                  // glow on hover
                  "hover:shadow-[0_0_30px_rgba(0,212,255,0.06),inset_0_0_30px_rgba(0,212,255,0.02)]",
                ),
                uploadIcon: "text-neon-blue/60 group-hover:text-neon-blue transition-colors",
                label: cn(
                  "text-sm font-display font-black text-neon-blue tracking-[0.2em] uppercase",
                  "group-hover:text-neon-blue-hot transition-colors",
                ),
                allowedContent: "text-[10px] text-slate-500/50 font-mono tracking-wider",
                button: cn(
                  "bg-neon-blue/10 border border-neon-blue/30",
                  "text-neon-blue font-display font-bold text-xs tracking-widest uppercase",
                  "px-6 py-2 hover:bg-neon-blue/20 hover:border-neon-blue/50",
                  "transition-all duration-200",
                  "shadow-[0_0_12px_rgba(0,212,255,0.1)]",
                ),
              }}
              content={{
                label: ({ ready, isUploading }) => {
                  if (isUploading) return "UPLOADING INTEL..."
                  if (!ready) return "INITIALIZING UPLINK..."
                  return "DROP SCREENSHOT HERE"
                },
                allowedContent: "PNG, JPG, WEBP — max 4 MB",
                button: "SELECT FILE",
                uploadIcon: ({ ready, isUploading }) => {
                  if (isUploading) return <Loader2 size={40} className="animate-spin text-neon-blue" />
                  if (!ready) return <Loader2 size={40} className="animate-spin text-slate-500/30" />
                  return <Upload size={40} />
                },
              }}
              onBeforeUploadBegin={(files) => {
                setUploading(true)
                setError(null)
                return files // pass files through unchanged
              }}
              onClientUploadComplete={(res) => {
                setUploading(false)
                console.log("[UploadThing] Upload complete:", res)
                const url = res?.[0]?.ufsUrl
                if (url) {
                  console.log("[UploadThing] Setting imageUrl:", url)
                  setImageUrl(url)
                } else {
                  console.warn("[UploadThing] No ufsUrl in response:", JSON.stringify(res))
                  setError("Upload succeeded but no URL returned. Check console.")
                }
              }}
              onUploadError={(err) => {
                setUploading(false)
                console.error("[UploadThing] Upload error:", err)
                setError(err.message || "Upload failed — check file type and size")
              }}
            />
            {/* Uploading overlay spinner */}
            {uploading && (
              <div className="absolute inset-0 bg-cyber-dark/70 flex items-center justify-center clip-chamfer z-10">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 size={28} className="animate-spin text-neon-blue" />
                  <span className="text-[10px] font-mono text-neon-blue tracking-widest animate-pulse">
                    TRANSMITTING...
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Submit ── */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 font-display font-black text-xs tracking-[0.3em] uppercase",
            "bg-neon-blue/10 border border-neon-blue/30 text-neon-blue",
            "hover:bg-neon-blue/20 hover:border-neon-blue/50 hover:glow-blue",
            "transition-all duration-200 clip-chamfer",
            "disabled:opacity-40 disabled:cursor-not-allowed",
          )}
        >
          {submitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              TRANSMITTING...
            </>
          ) : (
            <>
              <Send size={13} />
              DISPATCH
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-[10px] text-slate-400/50 hover:text-slate-300 font-mono tracking-widest uppercase transition-colors duration-200"
        >
          ABORT
        </button>
      </div>

      {/* Subtle footer hint */}
      <p className="text-[9px] text-slate-400/30 font-mono text-right tracking-widest">
        NEXUS PROTOCOL v2.0 // ENCRYPTED UPLINK
      </p>
    </form>
  )
}
