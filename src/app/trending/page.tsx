import { Flame, TrendingUp } from "lucide-react"
import { Feed } from "@/components/feed/Feed"
import { mockPosts } from "@/data/mock-posts"

// Trending: show highest-upvote posts
const trendingPosts = [...mockPosts]
  .sort((a, b) => b.upvotes - a.upvotes)
  .slice(0, 4)

export default function TrendingPage() {
  return (
    <div className="max-w-3xl">
      <Feed posts={trendingPosts} />
      <div className="glass-subtle rounded-lg p-8 text-center mt-4">
        <Flame size={32} className="text-neon-purple mx-auto mb-3" />
        <p className="text-slate-400 font-display tracking-wider uppercase text-sm">
          Trending algorithm calibrating
        </p>
        <p className="text-slate-600 text-xs mt-1">
          Real-time trend detection and hot-topic surfacing coming soon.
        </p>
      </div>
    </div>
  )
}
