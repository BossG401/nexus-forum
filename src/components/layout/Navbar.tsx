"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react"
import {
  Search,
  Bell,
  Plus,
  Menu,
  Zap,
  LogIn,
  LogOut,
  User,
  Settings,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { mockNavLinks } from "@/data/mock-nav"
import { Sidebar } from "./Sidebar"
import type { Category, UserStats } from "@/lib/types"
import { cn } from "@/lib/utils"

interface NavbarProps {
  categories: Category[]
  userStats: UserStats
}

export function Navbar({ categories, userStats }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [searchQuery, setSearchQuery] = React.useState("")
  const activeCategory = searchParams.get("category")

  return (
    <header className="fixed top-0 z-50 w-full h-16 glass-strong border-b border-cyber-border">
      <div className="flex items-center justify-between h-full px-4 max-w-[1600px] mx-auto">
        {/* ── Left: Mobile menu + Logo + Desktop nav ── */}
        <div className="flex items-center gap-3">
          {/* Mobile sidebar trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-slate-400 hover:text-neon-blue">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 bg-cyber-dark border-r border-cyber-border">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <Sidebar
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={(id) => {
                  if (activeCategory === id) {
                    router.push("/")
                  } else {
                    router.push(`/?category=${id}`)
                  }
                }}
                className="h-full"
              />
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Zap size={24} className="text-neon-blue" />
            <span className="text-xl font-bold font-display tracking-[0.3em] neon-text-blue hidden sm:block uppercase">
              NEXUS
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {mockNavLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href)

              return (
                <Button
                  key={link.href}
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(
                    "relative text-slate-400 hover:text-neon-blue hover:bg-neon-blue/5 transition-colors",
                    isActive && "text-neon-blue bg-neon-blue/5",
                  )}
                >
                  <Link href={link.href}>
                    <link.icon size={16} />
                    <span className="ml-1.5">{link.label}</span>
                    {/* Active glow bar */}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-neon-blue rounded-full shadow-[0_0_8px_rgba(0,212,255,0.5)]" />
                    )}
                  </Link>
                </Button>
              )
            })}
          </nav>
        </div>

        {/* ── Center: Search ── */}
        <div className="flex-1 max-w-xl mx-4 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <Input
            type="search"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 input-tech focus:input-tech-focus text-slate-200 placeholder:text-slate-500 h-9"
          />
        </div>

        {/* ── Right: Create Post + Notifications + Auth ── */}
        <div className="flex items-center gap-2">
          {/* Create Post — links to /submit */}
          <Button
            size="sm"
            asChild
            className="hidden sm:inline-flex bg-neon-blue text-cyber-dark hover:bg-neon-blue/90 hover:glow-blue transition-all font-semibold font-display uppercase tracking-wider"
          >
            <Link href="/submit">
              <Plus size={16} />
              <span className="ml-1">Create Post</span>
            </Link>
          </Button>
          <Button
            size="icon"
            asChild
            className="sm:hidden bg-neon-blue text-cyber-dark hover:glow-blue transition-all"
          >
            <Link href="/submit">
              <Plus size={18} />
            </Link>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-neon-blue relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neon-purple glow-purple" />
          </Button>

          {/* ── Auth: Login button or User dropdown ── */}
          {status === "loading" ? (
            /* Skeleton while session loads */
            <div className="h-8 w-8 rounded-full bg-cyber-surface animate-pulse" />
          ) : session?.user ? (
            /* Authenticated — User dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full ml-1">
                  <Avatar className="h-8 w-8 ring-2 ring-neon-gold/50 transition-all hover:ring-neon-gold">
                    <AvatarImage
                      src={userStats.avatarUrl}
                      alt={userStats.summonerName}
                    />
                    <AvatarFallback className="bg-neon-blue/20 text-neon-blue text-xs font-bold">
                      {userStats.summonerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 glass border-cyber-border">
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <Avatar className="h-8 w-8 ring-1 ring-neon-gold/30">
                    <AvatarImage
                      src={userStats.avatarUrl}
                    />
                    <AvatarFallback className="bg-neon-blue/20 text-neon-blue text-xs">
                      {userStats.summonerName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      {userStats.summonerName}
                    </p>
                    <p className="text-xs text-neon-gold font-display tracking-wider">
                      {userStats.rank}{userStats.lp ? ` · ${userStats.lp} LP` : ""}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-cyber-border" />
                <DropdownMenuItem asChild className="text-slate-300 hover:text-neon-blue focus:text-neon-blue cursor-pointer">
                  <Link href="/profile">
                    <User size={14} className="mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-slate-300 hover:text-neon-blue focus:text-neon-blue cursor-pointer">
                  <Link href="/settings">
                    <Settings size={14} className="mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-cyber-border" />
                <DropdownMenuItem
                  className="text-slate-400 hover:text-red-400 focus:text-red-400 cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut size={14} className="mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Unauthenticated — Login / Connect button */
            <Button
              size="sm"
              variant="outline"
              onClick={() => signIn()}
              className="ml-1 border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 hover:border-neon-blue/60 hover:glow-blue transition-all font-display uppercase tracking-wider text-xs"
            >
              <LogIn size={14} />
              <span className="ml-1.5">Connect</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
