import { Suspense } from "react"
import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/components/auth/AuthProvider"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { Navbar } from "@/components/layout/Navbar"
import { SidebarClient } from "@/components/layout/SidebarClient"
import { RightPanel } from "@/components/layout/RightPanel"
import { mockUserStats } from "@/data/mock-user-stats"
import { mockCategories } from "@/data/mock-categories"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { Category, UserStats } from "@/lib/types"
import "./globals.css"

export const metadata: Metadata = {
  title: "NEXUS 论坛",
  description: "面向英雄联盟玩家的现代社区论坛——讨论赛事、版本公告与玩家故事。",
}

function deriveUserStats(
  dbUser: {
    name: string | null
    image: string | null
    lolRank: string | null
    lp: number | null
    server: string | null
  } | null,
): UserStats {
  if (!dbUser) return mockUserStats
  return {
    ...mockUserStats,
    summonerName: dbUser.name ?? mockUserStats.summonerName,
    rank: dbUser.lolRank ?? mockUserStats.rank,
    lp: dbUser.lp ?? mockUserStats.lp,
    server: dbUser.server ?? mockUserStats.server,
    region: dbUser.server ?? mockUserStats.region,
    avatarUrl: dbUser.image ?? mockUserStats.avatarUrl,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const counts = await prisma.post.groupBy({
    by: ["tag"],
    _count: { id: true },
  })
  const countMap = new Map(counts.map((c) => [c.tag, c._count.id]))

  const categories: Category[] = mockCategories.map((cat) => ({
    ...cat,
    postCount: countMap.get(cat.name) ?? 0,
  }))

  const session = await getServerSession(authOptions)
  let dbUser = null
  if (session?.user?.id) {
    dbUser = await prisma.user.findUnique({ where: { id: session.user.id } })
  }
  const userStats = deriveUserStats(dbUser)

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* Blocking theme script: must run BEFORE first paint to prevent flash.
            Uses raw <script> (not next/script) because this is a Server Component —
            the browser executes server-rendered <script> tags during HTML parsing,
            before React hydration. React 19's "scripts are never executed" warning
            only applies to client-rendered components, not SSR output.
            suppressHydrationWarning on <html> covers the hydration mismatch. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme")||"dark";var d=document.documentElement;d.classList.add(t);d.style.colorScheme=t==="dark"?"dark":"light"}catch(e){}})()`,
          }}
        />
      </head>
      <body className="bg-background text-foreground antialiased min-h-screen font-sans">
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <Navbar categories={categories} userStats={userStats} />

              <div className="relative z-10 pt-14 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_320px] min-h-screen">
                <div className="hidden lg:block sticky top-14 h-[calc(100vh-56px)] overflow-hidden">
                  <Suspense fallback={<div className="w-[280px] bg-card" />}>
                    <SidebarClient categories={categories} />
                  </Suspense>
                </div>

                <main className="min-h-[calc(100vh-56px)] py-8 px-4 lg:px-8 max-w-[1120px] w-full mx-auto">
                  {children}
                </main>

                <div className="hidden xl:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto border-l border-border">
                  <RightPanel userStats={userStats} className="h-full" />
                </div>
              </div>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
