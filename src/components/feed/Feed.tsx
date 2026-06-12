import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockCategories } from "@/data/mock-categories"
import { tagLabel } from "@/lib/labels"
import type { Post } from "@/lib/types"
import { PostCard } from "./PostCard"

interface FeedProps {
  posts: Post[]
  activeCategory?: string
}

export function Feed({ posts, activeCategory }: FeedProps) {
  const categoryLabel = activeCategory
    ? mockCategories.find((category) => category.id === activeCategory)?.name
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
        <div className="space-y-3 stagger-children">
          {posts.map((post, index) => (
            <div key={post.id} style={{ "--stagger": index } as React.CSSProperties}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
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
