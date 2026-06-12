"use client"

import Link from "next/link"
import { useCallback, useRef, useState } from "react"
import { useInView } from "react-intersection-observer"
import { AlertCircle, Loader2, Plus } from "lucide-react"
import { getMorePosts } from "@/actions/post"
import { Button } from "@/components/ui/button"
import { mockCategories } from "@/data/mock-categories"
import { tagLabel } from "@/lib/labels"
import type { Post } from "@/lib/types"
import { PostCard } from "./PostCard"

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
        ? mockCategories.find((category) => category.id === categoryId)?.name ?? null
        : null
      const result = await getMorePosts(cursor ?? undefined, categoryTag)
      if (!result) return
      setPosts((previous) => [...previous, ...result.posts])
      setCursor(result.nextCursor)
      if (!result.nextCursor) setHasMore(false)
    } catch (event) {
      setError(event instanceof Error ? event.message : "帖子加载失败")
    } finally {
      setIsLoading(false)
      loadingRef.current = false
    }
  }, [categoryId, cursor, hasMore])

  const { ref } = useInView({
    threshold: 0,
    rootMargin: "200px",
    onChange: (inView) => {
      if (inView) fetchMore()
    },
  })

  const initialCount = initialPosts.length
  const categoryLabel = categoryId
    ? mockCategories.find((category) => category.id === categoryId)?.name ?? null
    : null

  return (
    <section className="flex-1">
      <div className="mb-6 flex flex-col gap-4 animate-fade-in-up sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {categoryLabel ? tagLabel(categoryLabel) : "全部讨论"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {categoryLabel
              ? `本分类共 ${posts.length} 篇帖子`
              : "社区最新讨论"}
          </p>
        </div>
        <Button
          asChild
          className="h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          <Link href="/submit">
            <Plus size={16} strokeWidth={2.4} />
            发帖
          </Link>
        </Button>
      </div>

      {posts.length > 0 ? (
        <>
          <div className="space-y-3">
            <div className="stagger-children space-y-3">
              {posts.slice(0, initialCount).map((post, index) => (
                <div key={post.id} style={{ "--stagger": index } as React.CSSProperties}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>

            {posts.slice(initialCount).map((post, index) => (
              <div
                key={post.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>

          {hasMore ? (
            <div ref={ref} className="mt-3 space-y-3">
              {isLoading
                ? [1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="overflow-hidden rounded-2xl border border-border bg-card"
                    >
                      <div className="flex">
                        <div className="w-16 border-r border-border bg-muted/50 py-4" />
                        <div className="flex-1 space-y-3 p-5">
                          <div className="h-5 w-32 animate-pulse rounded-full bg-muted" />
                          <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
                          <div className="h-4 w-full animate-pulse rounded bg-muted" />
                          <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                        </div>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-sm font-medium text-foreground">已经看到底啦。</p>
              <p className="mt-1 text-sm text-muted-foreground">没有更多帖子了。</p>
            </div>
          )}

          {error ? (
            <div className="mt-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-center">
              <div className="mb-3 flex items-center justify-center gap-2 text-sm text-destructive">
                <AlertCircle size={16} />
                {error}
              </div>
              <button
                onClick={fetchMore}
                className="inline-flex h-9 items-center gap-2 rounded-xl bg-muted px-4 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                <Loader2 size={15} className={isLoading ? "animate-spin" : ""} />
                重试
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-10 text-center animate-fade-in">
          <p className="text-base font-semibold text-foreground">暂无帖子</p>
          <p className="mt-2 text-sm text-muted-foreground">
            该分类下还没有讨论。
          </p>
        </div>
      )}
    </section>
  )
}
