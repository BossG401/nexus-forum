import { Newspaper, ScrollText } from "lucide-react"
import { Feed } from "@/components/feed/Feed"
import { mockPosts } from "@/data/mock-posts"

const patchesPosts = mockPosts.filter((p) =>
  p.tag.toLowerCase().includes("patchnotes"),
)

export default function PatchesPage() {
  return (
    <div className="max-w-3xl">
      <Feed posts={patchesPosts.length > 0 ? patchesPosts : mockPosts.slice(0, 2)} />
      {patchesPosts.length === 0 && (
        <div className="glass-subtle rounded-lg p-8 text-center mt-4">
          <ScrollText size={32} className="text-neon-blue mx-auto mb-3" />
          <p className="text-slate-400 font-display tracking-wider uppercase text-sm">
            Patch notes archive
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Detailed patch breakdowns and meta analysis coming soon.
          </p>
        </div>
      )}
    </div>
  )
}
