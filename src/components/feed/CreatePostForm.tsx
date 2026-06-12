"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { X, Upload, AlertCircle, ChevronDown, Send, Loader2 } from "lucide-react"
import { UploadDropzone } from "@/lib/uploadthing"
import { createPost } from "@/actions/post"
import { tagLabel } from "@/lib/labels"
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

const fieldCls =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/45 focus:ring-3 focus:ring-primary/15"

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
      setError(e instanceof Error ? e.message : "发帖失败")
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
      className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm animate-fade-in-up"
    >
      {/* ── Header ── */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">发布帖子</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          和社区分享点什么吧。
        </p>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 animate-fade-in">
          <AlertCircle size={15} className="shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* ── Tag selector ── */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted-foreground">分类</label>
        <div className="relative">
          <select
            value={tag}
            onChange={(e) => {
              const chosen = TAGS.find((t) => t.name === e.target.value)
              setTag(chosen!.name)
              setTagAccent(chosen!.accent)
            }}
            className={cn(fieldCls, "cursor-pointer appearance-none")}
          >
            {TAGS.map((t) => (
              <option key={t.name} value={t.name} className="bg-card text-foreground">
                {tagLabel(t.name)}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
        </div>
      </div>

      {/* ── Title ── */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted-foreground">标题</label>
        <input
          name="title"
          type="text"
          required
          placeholder="例如：T1 刚刚完成了 LCK 历史上最精彩的偷男爵"
          maxLength={200}
          className={fieldCls}
        />
      </div>

      {/* ── Content ── */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted-foreground">摘要</label>
        <textarea
          name="content"
          required
          rows={6}
          placeholder="写一段简短摘要。纯文本，不支持 Markdown。"
          maxLength={5000}
          className={cn(fieldCls, "resize-none")}
        />
        <p className="text-right text-xs text-muted-foreground">
          仅限纯文本 — 最多 5,000 字
        </p>
      </div>

      {/* ── Full content (optional, for detail page) ── */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted-foreground">
          正文 <span className="text-muted-foreground/70">（可选）</span>
        </label>
        <textarea
          name="fullContent"
          rows={4}
          placeholder="用于帖子详情页的完整正文…"
          maxLength={20000}
          className={cn(fieldCls, "resize-none")}
        />
      </div>

      {/* ════════════════════════════════════════════
          IMAGE UPLOAD — UploadThing Dropzone
          ════════════════════════════════════════════ */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted-foreground">
          配图 <span className="text-muted-foreground/70">（可选）</span>
        </label>

        {imageUrl ? (
          /* ── Preview mode — image uploaded ── */
          <div className="group relative overflow-hidden rounded-xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="帖子配图预览"
              className="max-h-64 w-full object-cover"
            />
            {/* Overlay with remove button */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <button
                type="button"
                onClick={removeImage}
                className="flex items-center gap-1.5 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90"
              >
                <X size={14} />
                移除
              </button>
            </div>
          </div>
        ) : (
          /* ── Upload dropzone ── */
          <div className="relative">
            <UploadDropzone
              key={dzKey}
              endpoint="postImage"
              appearance={{
                container: cn(
                  "flex flex-col items-center justify-center gap-3 rounded-xl p-8",
                  "border-2 border-dashed border-border bg-background",
                  "hover:border-primary/40 hover:bg-accent",
                  "transition-colors cursor-pointer",
                ),
                uploadIcon: "text-muted-foreground",
                label: "text-sm font-medium text-foreground",
                allowedContent: "text-xs text-muted-foreground",
                button: cn(
                  "rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground",
                  "hover:bg-primary/90 transition-colors",
                ),
              }}
              content={{
                label: ({ ready, isUploading }) => {
                  if (isUploading) return "上传中…"
                  if (!ready) return "加载中…"
                  return "拖拽图片到此处"
                },
                allowedContent: "PNG、JPG、WEBP — 最大 4 MB",
                button: "选择文件",
                uploadIcon: ({ ready, isUploading }) => {
                  if (isUploading) return <Loader2 size={40} className="animate-spin text-primary" />
                  if (!ready) return <Loader2 size={40} className="animate-spin text-muted-foreground" />
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
                  setError("上传成功但未返回 URL，请检查控制台。")
                }
              }}
              onUploadError={(err) => {
                setUploading(false)
                console.error("[UploadThing] Upload error:", err)
                setError(err.message || "上传失败 — 请检查文件类型和大小")
              }}
            />
            {/* Uploading overlay spinner */}
            {uploading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/70">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 size={28} className="animate-spin text-primary" />
                  <span className="text-xs text-primary">上传中…</span>
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
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              发布中…
            </>
          ) : (
            <>
              <Send size={15} />
              发布
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          取消
        </button>
      </div>
    </form>
  )
}
