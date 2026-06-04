import type { Post } from "@/lib/types"
import { PostCard } from "./PostCard"
import { mockCategories } from "@/data/mock-categories"

interface FeedProps { posts: Post[]; activeCategory?: string }

export function Feed({ posts, activeCategory }: FeedProps) {
  const categoryLabel = activeCategory ? mockCategories.find((c) => c.id === activeCategory)?.name : null
  return (
    <section className="flex-1">
      <div className="mb-4 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-8 bg-neon-blue shadow-[0_0_12px_rgba(0,212,255,0.4)]" />
          <h1 className="text-2xl font-display font-black neon-text-blue tracking-[0.4em] uppercase">{categoryLabel ? `${categoryLabel.toUpperCase()}` : "DISPATCH"}</h1>
        </div>
        <p className="text-[10px] text-slate-400/60 font-mono uppercase tracking-widest ml-4 mt-1">
          {categoryLabel ? `// ${posts.length} intel report${posts.length !== 1 ? "s" : ""} filtered` : "// latest tactical intel from the rift"}
        </p>
        <div className="mt-3 h-[1px] bg-gradient-to-r from-neon-blue/30 via-neon-blue/10 to-transparent w-40 ml-4" />
      </div>
      {posts.length > 0 ? (
        <div className="space-y-2 stagger-children">
          {posts.map((post, index) => (
            <div key={post.id} style={{ "--stagger": index } as React.CSSProperties}><PostCard post={post} /></div>
          ))}
        </div>
      ) : (
        <div className="glass-subtle clip-chamfer p-10 text-center animate-fade-in corner-marks">
          <p className="text-slate-400/60 font-display font-black tracking-[0.5em] uppercase text-xs">// NO INTEL FOUND</p>
          <p className="text-slate-500/50 text-[10px] mt-2 font-mono">No dispatches match this sector.</p>
        </div>
      )}
    </section>
  )
}
