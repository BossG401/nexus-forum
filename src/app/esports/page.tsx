import { Radio, Trophy, Swords } from "lucide-react"
import { Feed } from "@/components/feed/Feed"
import { mockPosts } from "@/data/mock-posts"

const esportsPosts = mockPosts.filter((p) =>
  p.tag.toLowerCase().includes("esports"),
)

export default function EsportsPage() {
  return (
    <div className="max-w-3xl animate-fade-in-up">
      <Feed posts={esportsPosts.length > 0 ? esportsPosts : mockPosts.slice(0, 3)} />
      {esportsPosts.length === 0 && (
        <div className="glass-subtle rounded-lg p-10 text-center mt-5 animate-fade-in">
          <Trophy size={28} className="text-neon-gold/60 mx-auto mb-4" />
          <p className="text-slate-400/70 font-display tracking-[0.25em] uppercase text-sm">
            Esports coverage incoming
          </p>
          <p className="text-slate-600/40 text-xs mt-2">
            Live tournament threads and match analysis coming soon.
          </p>
        </div>
      )}
    </div>
  )
}
