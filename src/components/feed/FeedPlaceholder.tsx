import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function FeedPlaceholder() {
  return (
    <section className="flex-1">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold neon-text-blue">
          Feed
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Latest discussions from the community
        </p>
      </div>

      {/* Skeleton cards */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card
            key={i}
            className="glass border-0 ring-0 p-0"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full bg-cyber-border" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-24 bg-cyber-border" />
                  <Skeleton className="h-2.5 w-16 bg-cyber-border" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4 space-y-3">
              <Skeleton className="h-4 w-3/4 bg-cyber-border" />
              <Skeleton className="h-3 w-full bg-cyber-border" />
              <Skeleton className="h-3 w-5/6 bg-cyber-border" />
              <div className="flex items-center gap-4 mt-2">
                <Skeleton className="h-4 w-12 bg-cyber-border" />
                <Skeleton className="h-4 w-12 bg-cyber-border" />
                <Skeleton className="h-4 w-16 bg-cyber-border" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-center text-slate-600 mt-10 text-sm">
        Phase 2 will populate this feed with live mock data
      </p>
    </section>
  )
}
