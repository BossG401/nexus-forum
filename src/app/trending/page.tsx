import { Flame, TrendingUp } from "lucide-react"
import { Feed } from "@/components/feed/Feed"
import { mockPosts } from "@/data/mock-posts"

const trendingPosts = [...mockPosts]
  .sort((a, b) => b.upvotes - a.upvotes)
  .slice(0, 4)

export default function TrendingPage() {
  return (
    <div className="max-w-3xl animate-fade-in-up">
      <Feed posts={trendingPosts} />
      <div className="glass-subtle rounded-lg p-10 text-center mt-5 animate-fade-in">
        <Flame size={28} className="text-neon-purple/60 mx-auto mb-4" />
        <p className="text-slate-400/70 font-display tracking-[0.25em] uppercase text-sm">
          Trending algorithm calibrating
        </p>
        <p className="text-slate-600/40 text-xs mt-2">
          Real-time trend detection and hot-topic surfacing coming soon.
        </p>
      </div>
    </div>
  )
}
