"use client"

import { useState, useRef, useCallback } from "react"
import { useInView } from "react-intersection-observer"
import { Terminal } from "lucide-react"
import { PostCard } from "./PostCard"
import { getMorePosts } from "@/actions/post"
import { mockCategories } from "@/data/mock-categories"
import type { Post } from "@/lib/types"

interface InfiniteFeedProps {
  initialPosts: Post[]
  initialHasMore: boolean
  initialCursor: string | null
  categoryId?: string
}

export function InfiniteFeed({
  initialPosts,
  initialHasMore,
  initialCursor,
  categoryId,
}: InfiniteFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [cursor, setCursor] = useState<string | null>(initialCursor)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset state when initialPosts change (category switch via key prop)
  const [lastInitialPosts, setLastInitialPosts] = useState(initialPosts)
  if (initialPosts !== lastInitialPosts) {
    setLastInitialPosts(initialPosts)
    setPosts(initialPosts)
    setCursor(initialCursor)
    setHasMore(initialHasMore)
    setError(null)
  }

  const loadingRef = useRef(false)

  const fetchMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return
    loadingRef.current = true
    setIsLoading(true)
    setError(null)

    try {
      const categoryTag = categoryId
        ? mockCategories.find((c) => c.id === categoryId)?.name ?? null
        : null
      const result = await getMorePosts(cursor ?? undefined, categoryTag)
      if (!result) return
      setPosts((prev) => [...prev, ...result.posts])
      setCursor(result.nextCursor)
      if (!result.nextCursor) setHasMore(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dispatches")
    } finally {
      setIsLoading(false)
      loadingRef.current = false
    }
  }, [cursor, hasMore, categoryId])

  const { ref } = useInView({
    threshold: 0,
    rootMargin: "200px",
    onChange: (inView) => {
      if (inView) fetchMore()
    },
  })

  const initialCount = initialPosts.length
  const categoryLabel = categoryId
    ? mockCategories.find((c) => c.id === categoryId)?.name ?? null
    : null

  return (
    <section className="flex-1">
      {/* ── Header ── */}
      <div className="mb-4 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-8 bg-neon-blue shadow-[0_0_12px_rgba(0,212,255,0.4)]" />
          <h1 className="text-2xl font-display font-black neon-text-blue tracking-[0.4em] uppercase">
            {categoryLabel ? `${categoryLabel.toUpperCase()}` : "DISPATCH"}
          </h1>
        </div>
        <p className="text-[10px] text-slate-400/60 font-mono uppercase tracking-widest ml-4 mt-1">
          {categoryLabel
            ? `// ${posts.length} intel report${posts.length !== 1 ? "s" : ""} filtered`
            : "// latest tactical intel from the rift"}
        </p>
        <div className="mt-3 h-[1px] bg-gradient-to-r from-neon-blue/30 via-neon-blue/10 to-transparent w-40 ml-4" />
      </div>

      {posts.length > 0 ? (
        <>
          <div className="space-y-2">
            {/* ── Initial posts (server-rendered) — preserve stagger animation ── */}
            <div className="stagger-children space-y-2">
              {posts.slice(0, initialCount).map((post, index) => (
                <div
                  key={post.id}
                  style={{ "--stagger": index } as React.CSSProperties}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>

            {/* ── Client-loaded posts — slide-in with micro-stagger ── */}
            {posts.slice(initialCount).map((post, index) => (
              <div
                key={post.id}
                className="animate-slide-in-brutal"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>

          {/* ── Sentinel for intersection observer ── */}
          {hasMore && (
            <div ref={ref} className="mt-2 space-y-2">
              {/* ── Loading skeleton ── */}
              {isLoading &&
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="glass-subtle clip-chamfer p-0 animate-fade-in overflow-hidden"
                  >
                    <div className="flex relative">
                      {/* Vote column skeleton */}
                      <div className="flex flex-col items-center gap-0.5 px-2 py-2 border-r border-white/[0.04] bg-gradient-to-b from-cyber-dark/40 to-cyber-darker/60">
                        <div className="w-5 h-5 bg-neon-blue/[0.08] animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.1)]" />
                        <div className="w-3 h-3 bg-white/[0.03] animate-pulse my-1" />
                        <div className="w-5 h-5 bg-neon-crimson/[0.06] animate-pulse" />
                      </div>
                      {/* Content skeleton */}
                      <div className="flex-1 p-3 space-y-2.5 relative overflow-hidden">
                        {/* Shimmer sweep */}
                        <div
                          className="absolute inset-0 opacity-10 animate-shimmer-sweep"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.15) 50%, transparent 100%)",
                            backgroundSize: "200% 100%",
                          }}
                        />
                        <div className="flex gap-2">
                          <div className="h-3.5 w-16 bg-neon-blue/[0.08] clip-tag animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.05)]" />
                          <div className="h-2.5 w-12 bg-white/[0.04] animate-pulse" />
                        </div>
                        <div className="h-4 w-3/4 bg-white/[0.05] animate-pulse" />
                        <div className="h-3 w-full bg-white/[0.03] animate-pulse" />
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-5 w-5 bg-neon-blue/[0.06] clip-diamond animate-pulse" />
                          <div className="h-2 w-16 bg-white/[0.04] animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* ── End of Transmission ── */}
          {!hasMore && (
            <div className="mt-6 glass-subtle clip-chamfer p-8 text-center animate-fade-in corner-marks">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-neon-blue/40 to-transparent" />
                <span className="text-neon-blue/60 font-display font-black tracking-[0.5em] uppercase text-xs animate-neon-pulse">
                  // END OF TRANSMISSION
                </span>
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-neon-blue/40 to-transparent" />
              </div>
              <p className="text-slate-500/50 text-[10px] font-mono">
                All tactical dispatches have been received.
              </p>
            </div>
          )}

          {/* ── Error State ── */}
          {error && (
            <div className="mt-2 glass-subtle clip-chamfer p-4 text-center animate-fade-in border border-neon-crimson/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Terminal size={11} className="text-neon-crimson/60" />
                <span className="text-neon-crimson/70 font-mono text-[10px] tracking-widest uppercase">
                  // TRANSMISSION ERROR: {error}
                </span>
              </div>
              <button
                onClick={fetchMore}
                className="text-neon-blue/70 text-[10px] font-display tracking-widest uppercase hover:text-neon-blue transition-colors"
              >
                [ RETRY UPLINK ]
              </button>
            </div>
          )}
        </>
      ) : (
        /* ── Empty state ── */
        <div className="glass-subtle clip-chamfer p-10 text-center animate-fade-in corner-marks">
          <p className="text-slate-400/60 font-display font-black tracking-[0.5em] uppercase text-xs">
            // NO INTEL FOUND
          </p>
          <p className="text-slate-500/50 text-[10px] mt-2 font-mono">
            No dispatches match this sector.
          </p>
        </div>
      )}
    </section>
  )
}
