import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function FeedPlaceholder() {
  return (
    <section className="flex-1 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold neon-text-blue font-display tracking-[0.25em] uppercase">
          /// Feed
        </h1>
        <p className="text-slate-500/50 mt-1.5 text-[13px]">
          Latest discussions from the community
        </p>
        <div className="mt-3 h-px bg-gradient-to-r from-neon-blue/15 via-neon-blue/5 to-transparent w-32" />
      </div>

      {/* Skeleton cards */}
      <div className="space-y-3 stagger-children">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{ "--stagger": i } as React.CSSProperties}
            className="glass-subtle rounded-lg p-0"
          >
            <div className="p-5 pb-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full bg-white/[0.04]" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-24 bg-white/[0.04] rounded-md" />
                  <Skeleton className="h-2.5 w-16 bg-white/[0.04] rounded-md" />
                </div>
              </div>
            </div>
            <div className="px-5 pb-5 space-y-3">
              <Skeleton className="h-4 w-3/4 bg-white/[0.04] rounded-md" />
              <Skeleton className="h-3 w-full bg-white/[0.04] rounded-md" />
              <Skeleton className="h-3 w-5/6 bg-white/[0.04] rounded-md" />
              <div className="flex items-center gap-4 mt-2">
                <Skeleton className="h-4 w-12 bg-white/[0.04] rounded-md" />
                <Skeleton className="h-4 w-12 bg-white/[0.04] rounded-md" />
                <Skeleton className="h-4 w-16 bg-white/[0.04] rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
