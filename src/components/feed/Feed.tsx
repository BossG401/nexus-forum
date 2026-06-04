import type { Post } from "@/lib/types"
import { PostCard } from "./PostCard"
import { mockCategories } from "@/data/mock-categories"

interface FeedProps {
  posts: Post[]
  activeCategory?: string
}

export function Feed({ posts, activeCategory }: FeedProps) {
  const categoryLabel = activeCategory
    ? mockCategories.find((c) => c.id === activeCategory)?.name
    : null

  return (
    <section className="flex-1">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-bold font-display neon-text-blue tracking-[0.25em] uppercase">
          {categoryLabel ? `/// #${categoryLabel.toUpperCase()}` : "/// FEED"}
        </h1>
        <p className="text-slate-500/60 mt-1.5 text-[13px] tracking-wide">
          {categoryLabel
            ? `Filtered dispatches — ${posts.length} post${posts.length !== 1 ? "s" : ""}`
            : "Latest dispatches from the Rift"}
        </p>
        {/* Subtle accent line */}
        <div className="mt-3 h-px bg-gradient-to-r from-neon-blue/20 via-neon-blue/5 to-transparent w-32" />
      </div>

      {/* Post list with stagger */}
      {posts.length > 0 ? (
        <div className="space-y-3 stagger-children">
          {posts.map((post, index) => (
            <div key={post.id} style={{ "--stagger": index } as React.CSSProperties}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-subtle rounded-lg p-14 text-center animate-fade-in">
          <p className="text-slate-500/70 font-display tracking-[0.25em] uppercase text-sm">
            /// No Posts Found
          </p>
          <p className="text-slate-600/50 text-xs mt-2">
            No dispatches match this category yet.
          </p>
        </div>
      )}
    </section>
  )
}
