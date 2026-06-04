import { Newspaper, ScrollText } from "lucide-react"
import { Feed } from "@/components/feed/Feed"
import { mockPosts } from "@/data/mock-posts"

const patchesPosts = mockPosts.filter((p) =>
  p.tag.toLowerCase().includes("patchnotes"),
)

export default function PatchesPage() {
  return (
    <div className="max-w-3xl animate-fade-in-up">
      <Feed posts={patchesPosts.length > 0 ? patchesPosts : mockPosts.slice(0, 2)} />
      {patchesPosts.length === 0 && (
        <div className="glass-subtle rounded-lg p-10 text-center mt-5 animate-fade-in">
          <ScrollText size={28} className="text-neon-blue/60 mx-auto mb-4" />
          <p className="text-slate-400/70 font-display tracking-[0.25em] uppercase text-sm">
            Patch notes archive
          </p>
          <p className="text-slate-600/40 text-xs mt-2">
            Detailed patch breakdowns and meta analysis coming soon.
          </p>
        </div>
      )}
    </div>
  )
}
