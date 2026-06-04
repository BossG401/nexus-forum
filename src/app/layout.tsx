import { Suspense } from "react"
import type { Metadata } from "next"
import { Orbitron, JetBrains_Mono } from "next/font/google"
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

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-display",
})

const jetbrains = JetBrains_Mono({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "NEXUS // COMMAND CENTER",
  description: "Hardcore League of Legends esports command center. Tactical intel, rank analysis, and combat dispatches.",
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
    <html lang="en" className={`dark ${orbitron.variable} ${jetbrains.variable}`}>
      <body className="bg-cyber-darker text-slate-200 antialiased min-h-screen font-mono scanline-overlay">
        <AuthProvider>
          <TooltipProvider>
            <Navbar categories={categories} userStats={userStats} />

            {/* Command Center Grid — asymmetric 3-panel */}
            <div className="relative z-10 pt-12 grid grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_340px] min-h-screen">
              {/* Left Sidebar */}
              <div className="hidden lg:block sticky top-12 h-[calc(100vh-48px)] overflow-hidden">
                <Suspense fallback={<div className="w-[240px] bg-cyber-dark" />}>
                  <SidebarClient categories={categories} />
                </Suspense>
              </div>

              {/* Main Content */}
              <main className="min-h-[calc(100vh-48px)] py-3 px-3 lg:px-4 max-w-[1000px] w-full mx-auto">
                {children}
              </main>

              {/* Right Panel */}
              <div className="hidden xl:block sticky top-12 h-[calc(100vh-48px)] overflow-y-auto">
                <RightPanel userStats={userStats} className="h-full" />
              </div>
            </div>
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
