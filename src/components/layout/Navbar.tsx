"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Search, Bell, Plus, Menu, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { LoginButton } from "@/components/auth/LoginButton"
import { UserMenu } from "@/components/auth/UserMenu"
import { mockNavLinks } from "@/data/mock-nav"
import { Sidebar } from "./Sidebar"
import type { Category, UserStats } from "@/lib/types"
import { cn } from "@/lib/utils"

interface NavbarProps { categories: Category[]; userStats: UserStats }

export function Navbar({ categories, userStats }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchFocused, setSearchFocused] = React.useState(false)
  const activeCategory = searchParams.get("category")

  return (
    <header className="fixed top-0 z-50 w-full h-12 glass-strong border-b border-neon-blue/[0.08]">
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent" />
      <div className="absolute bottom-0 left-0 h-[1px] w-1/3 bg-gradient-to-r from-neon-blue/50 to-transparent animate-[shimmer-sweep_4s_infinite_linear]" />
        <div className="relative flex items-center justify-between h-full px-3.5 lg:px-4 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-slate-400 hover:text-neon-blue hover:bg-neon-blue/[0.06] active:scale-90 h-9 w-9 transition-all duration-200"><Menu size={18} /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[260px] p-0 bg-cyber-dark/95 border-r border-neon-blue/[0.06]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <Sidebar categories={categories} activeCategory={activeCategory} onCategoryChange={(id) => { if (activeCategory === id) router.push("/"); else router.push(`/?category=${id}`) }} className="h-full" />
            </SheetContent>
          </Sheet>
          <Link href="/" className="group flex items-center gap-2 shrink-0 ml-1">
            <Zap size={20} className="text-neon-blue transition-all duration-300 group-hover:text-neon-blue-hot group-hover:drop-shadow-[0_0_10px_rgba(0,212,255,0.6)]" />
            <span className="text-base font-display font-black tracking-[0.4em] neon-text-blue hidden sm:block uppercase glitch-text">NEXUS</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-0.5 ml-6">
            {mockNavLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
              return (
                <Button key={link.href} variant="ghost" size="sm" asChild
                  className={cn("relative h-8 px-3 text-slate-400 hover:text-neon-blue transition-all duration-200 hover:bg-neon-blue/[0.04] hover:skew-x-[-2deg] active:scale-95 active:skew-x-0", isActive && "text-neon-blue bg-neon-blue/[0.06] skew-x-[-2deg]")}>
                  <Link href={link.href} className="flex items-center">
                    <link.icon size={14} />
                    <span className="ml-1.5 text-xs font-display font-semibold uppercase tracking-widest">{link.label}</span>
                    {isActive && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-blue shadow-[0_0_10px_rgba(0,212,255,0.5)]" />}
                  </Link>
                </Button>
              )
            })}
          </nav>
        </div>
        <div className="flex-1 max-w-sm mx-3 relative">
          <Search size={14} className={cn("absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200", searchFocused ? "text-neon-blue" : "text-slate-400/60")} />
          <Input type="search" placeholder="SCAN INTEL..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
            className={cn("w-full pl-9 pr-4 h-8 text-xs font-display uppercase tracking-widest clip-chamfer input-tech focus:input-tech-focus text-slate-200 placeholder:text-slate-400/50 transition-all duration-300", searchFocused && "glow-blue")} />
        </div>
        <div className="flex items-center gap-1.5">
          <Button size="sm" asChild className="hidden sm:inline-flex h-8 px-4 clip-tag bg-neon-blue text-cyber-dark font-display font-bold uppercase tracking-widest text-[10px] hover:bg-neon-blue-hot hover:glow-blue-intense active:scale-95 active:skew-x-[-2deg] transition-all duration-200">
            <Link href="/submit"><Plus size={14} strokeWidth={3} /><span className="ml-1">DEPLOY</span></Link>
          </Button>
          <Button size="icon" asChild className="sm:hidden h-8 w-8 clip-tag bg-neon-blue text-cyber-dark hover:glow-blue active:scale-90 transition-all duration-200">
            <Link href="/submit"><Plus size={16} strokeWidth={3} /></Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative h-8 w-8 text-slate-400 hover:text-neon-crimson hover:bg-neon-crimson/[0.06] active:scale-90 transition-all duration-200">
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-neon-crimson shadow-[0_0_6px_rgba(255,45,85,0.6)] animate-neon-pulse" />
          </Button>
          {status === "loading" ? (
            <div className="h-7 w-7 bg-cyber-surface animate-pulse ml-1 clip-diamond" />
          ) : session?.user ? (
            <UserMenu userStats={userStats} />
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  )
}
