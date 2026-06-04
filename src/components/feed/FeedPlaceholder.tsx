import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function FeedPlaceholder() {
  return (
    <section className="flex-1 animate-fade-in">
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-8 bg-neon-blue shadow-[0_0_12px_rgba(0,212,255,0.4)]" />
          <h1 className="text-2xl font-display font-black neon-text-blue tracking-[0.4em] uppercase">DISPATCH</h1>
        </div>
        <p className="text-[10px] text-slate-400/55 font-mono uppercase tracking-widest ml-4 mt-1">// loading tactical intel...</p>
      </div>
      <div className="space-y-1 stagger-children">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ "--stagger": i } as React.CSSProperties} className="glass-subtle clip-chamfer p-3">
            <div className="flex gap-3 animate-pulse">
              <div className="w-10 h-full flex flex-col items-center gap-1 py-2"><div className="w-4 h-4 bg-white/[0.05]" /><div className="w-3 h-2 bg-white/[0.05]" /><div className="w-4 h-4 bg-white/[0.05]" /></div>
              <div className="flex-1 space-y-2.5 py-1">
                <div className="flex gap-2"><div className="h-3 w-16 bg-white/[0.05] clip-tag" /><div className="h-2 w-12 bg-white/[0.05]" /></div>
                <div className="h-3.5 w-3/4 bg-white/[0.05]" />
                <div className="h-2.5 w-full bg-white/[0.05]" />
                <div className="flex items-center gap-2 mt-1"><div className="h-5 w-5 bg-white/[0.05] clip-diamond" /><div className="h-2 w-16 bg-white/[0.05]" /></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
