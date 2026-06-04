import { Suspense } from "react"
import type { Metadata } from "next"
import { Inter, Rajdhani } from "next/font/google"
import { getServerSession } from "next-auth"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/components/auth/AuthProvider"
import { Navbar } from "@/components/layout/Navbar"
import { SidebarClient } from "@/components/layout/SidebarClient"
import { RightPanel } from "@/components/layout/RightPanel"
import { mockUserStats } from "@/data/mock-user-stats"
import { mockCategories } from "@/data/mock-categories"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { Category, UserStats } from "@/lib/types"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const rajdhani = Rajdhani({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "NEXUS — LoL Esports Forum",
  description: "Hardcore League of Legends esports forum with real gaming stats, ranks, and discussions.",
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
    dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    })
  }
  const userStats = deriveUserStats(dbUser)

  return (
    <html lang="en" className={`dark ${inter.variable} ${rajdhani.variable}`}>
      <body className="bg-cyber-darker text-slate-200 antialiased min-h-screen font-sans">
        <AuthProvider>
          <TooltipProvider>
            <Navbar categories={categories} userStats={userStats} />

            {/* Desktop 3-panel grid */}
            <div className="relative z-10 pt-16 grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_320px] min-h-screen">
              {/* Left Sidebar — visible lg+ */}
              <div className="hidden lg:block sticky top-16 h-[calc(100vh-64px)] overflow-hidden border-r border-white/[0.03]">
                <Suspense fallback={<div className="w-[260px] bg-cyber-dark" />}>
                  <SidebarClient categories={categories} />
                </Suspense>
              </div>

              {/* Main content */}
              <main className="min-h-[calc(100vh-64px)] py-8 px-6 lg:px-8 max-w-4xl w-full mx-auto">
                {children}
              </main>

              {/* Right Panel — visible xl+ */}
              <div className="hidden xl:block sticky top-16 h-[calc(100vh-64px)] overflow-y-auto border-l border-white/[0.03]">
                <RightPanel
                  userStats={userStats}
                  className="h-full"
                />
              </div>
            </div>
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
