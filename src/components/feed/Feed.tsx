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
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display neon-text-blue tracking-wider uppercase">
          {categoryLabel ? `/// #${categoryLabel.toUpperCase()}` : "/// FEED"}
        </h1>
        <p className="text-slate-500 mt-1 text-sm tracking-wide">
          {categoryLabel
            ? `Filtered dispatches — ${posts.length} post${posts.length !== 1 ? "s" : ""}`
            : "Latest dispatches from the Rift"}
        </p>
      </div>

      {/* Post list */}
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="glass-subtle rounded-lg p-12 text-center">
          <p className="text-slate-500 font-display tracking-wider uppercase text-sm">
            /// No Posts Found
          </p>
          <p className="text-slate-600 text-xs mt-1">
            No dispatches match this category yet.
          </p>
        </div>
      )}
    </section>
  )
}
