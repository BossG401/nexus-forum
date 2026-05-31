import { Radio, Trophy, Swords } from "lucide-react"
import { Feed } from "@/components/feed/Feed"
import { mockPosts } from "@/data/mock-posts"

// Filter esports content
const esportsPosts = mockPosts.filter((p) =>
  p.tag.toLowerCase().includes("esports"),
)

export default function EsportsPage() {
  return (
    <div className="max-w-3xl">
      <Feed posts={esportsPosts.length > 0 ? esportsPosts : mockPosts.slice(0, 3)} />
      {esportsPosts.length === 0 && (
        <div className="glass-subtle rounded-lg p-8 text-center mt-4">
          <Trophy size={32} className="text-neon-gold mx-auto mb-3" />
          <p className="text-slate-400 font-display tracking-wider uppercase text-sm">
            Esports coverage incoming
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Live tournament threads and match analysis coming soon.
          </p>
        </div>
      )}
    </div>
  )
}
