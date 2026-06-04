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
  const [searchFocused, setSearchFocused] = React.useState(false)
  const activeCategory = searchParams.get("category")

  return (
    <header className="fixed top-0 z-50 w-full h-16 glass-strong border-b border-white/[0.04]">
      {/* Subtle top-edge highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent" />

      <div className="relative flex items-center justify-between h-full px-5 max-w-[1600px] mx-auto">
        {/*─── Left: Mobile menu + Logo + Desktop nav ───*/}
        <div className="flex items-center gap-3">
          {/* Mobile sidebar trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-slate-400 hover:text-neon-blue hover:bg-neon-blue/5 active:scale-95 transition-all duration-200"
              >
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 bg-cyber-dark/95 border-r border-cyber-border">
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
          <Link
            href="/"
            className="group flex items-center gap-2.5 shrink-0"
          >
            <div className="relative">
              <Zap
                size={22}
                className="text-neon-blue transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.5)] group-hover:scale-110"
              />
            </div>
            <span className="text-lg font-bold font-display tracking-[0.35em] neon-text-blue hidden sm:block uppercase transition-all duration-300 group-hover:tracking-[0.4em]">
              NEXUS
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-5">
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
                    "relative h-9 px-3 text-slate-400 hover:text-neon-blue hover:bg-neon-blue/[0.06] active:scale-[0.97] transition-all duration-200 rounded-md",
                    isActive && "text-neon-blue bg-neon-blue/[0.08]",
                  )}
                >
                  <Link href={link.href}>
                    <link.icon size={15} className="transition-transform duration-200" />
                    <span className="ml-1.5 text-[13px] font-medium">{link.label}</span>
                    {/* Active glow bar */}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-neon-blue rounded-full shadow-[0_0_8px_rgba(0,212,255,0.4)] animate-fade-in" />
                    )}
                  </Link>
                </Button>
              )
            })}
          </nav>
        </div>

        {/*─── Center: Search ───*/}
        <div className="flex-1 max-w-xl mx-5 relative">
          <Search
            size={15}
            className={cn(
              "absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200",
              searchFocused ? "text-neon-blue/70" : "text-slate-500"
            )}
          />
          <Input
            type="search"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={cn(
              "w-full pl-9 pr-4 h-9 text-[13px] rounded-lg",
              "input-tech focus:input-tech-focus",
              "text-slate-200 placeholder:text-slate-500/70",
              "transition-all duration-300",
              searchFocused && "shadow-[0_0_20px_rgba(0,212,255,0.08)]"
            )}
          />
        </div>

        {/*─── Right: Create Post + Notifications + Auth ───*/}
        <div className="flex items-center gap-2">
          {/* Create Post */}
          <Button
            size="sm"
            asChild
            className="hidden sm:inline-flex h-9 bg-neon-blue text-cyber-dark hover:bg-neon-blue/90 hover:shadow-[0_0_20px_rgba(0,212,255,0.25)] active:scale-[0.97] transition-all duration-200 font-semibold font-display uppercase tracking-wider text-xs rounded-lg"
          >
            <Link href="/submit">
              <Plus size={15} strokeWidth={2.5} />
              <span className="ml-1">Create Post</span>
            </Link>
          </Button>
          <Button
            size="icon"
            asChild
            className="sm:hidden h-9 w-9 bg-neon-blue text-cyber-dark hover:shadow-[0_0_16px_rgba(0,212,255,0.3)] active:scale-90 transition-all duration-200 rounded-lg"
          >
            <Link href="/submit">
              <Plus size={17} strokeWidth={2.5} />
            </Link>
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 text-slate-400 hover:text-neon-blue hover:bg-neon-blue/[0.06] active:scale-90 transition-all duration-200 rounded-lg"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_6px_rgba(168,85,247,0.5)] animate-pulse-glow" />
          </Button>

          {/*─── Auth: Login button or User dropdown ───*/}
          {status === "loading" ? (
            <div className="h-8 w-8 rounded-full bg-cyber-surface animate-pulse ml-1" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full ml-1 h-9 w-9 hover:bg-transparent active:scale-95 transition-all duration-200"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-neon-gold/40 transition-all duration-300 hover:ring-neon-gold/70 hover:shadow-[0_0_12px_rgba(200,169,81,0.2)]">
                    <AvatarImage
                      src={userStats.avatarUrl}
                      alt={userStats.summonerName}
                    />
                    <AvatarFallback className="bg-neon-blue/15 text-neon-blue text-xs font-bold">
                      {userStats.summonerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mt-2 glass border-cyber-border rounded-lg animate-scale-in"
              >
                <div className="flex items-center gap-2.5 px-3 py-2.5">
                  <Avatar className="h-9 w-9 ring-1 ring-neon-gold/25">
                    <AvatarImage src={userStats.avatarUrl} />
                    <AvatarFallback className="bg-neon-blue/15 text-neon-blue text-xs">
                      {userStats.summonerName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-slate-200 leading-tight">
                      {userStats.summonerName}
                    </p>
                    <p className="text-[11px] text-neon-gold font-display tracking-wider mt-0.5">
                      {userStats.rank}{userStats.lp ? ` · ${userStats.lp} LP` : ""}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-cyber-border/50" />
                <DropdownMenuItem
                  asChild
                  className="text-slate-300 hover:text-neon-blue focus:text-neon-blue cursor-pointer rounded-md mx-1 transition-colors duration-150"
                >
                  <Link href="/profile" className="flex items-center px-2 py-2">
                    <User size={14} className="mr-2.5 opacity-70" />
                    <span className="text-[13px]">Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="text-slate-300 hover:text-neon-blue focus:text-neon-blue cursor-pointer rounded-md mx-1 transition-colors duration-150"
                >
                  <Link href="/settings" className="flex items-center px-2 py-2">
                    <Settings size={14} className="mr-2.5 opacity-70" />
                    <span className="text-[13px]">Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-cyber-border/50" />
                <DropdownMenuItem
                  className="text-slate-400 hover:text-red-400 focus:text-red-400 cursor-pointer rounded-md mx-1 transition-colors duration-150"
                  onClick={() => signOut()}
                >
                  <LogOut size={14} className="mr-2.5 opacity-70" />
                  <span className="text-[13px]">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => signIn()}
              className="ml-1 h-9 border-neon-blue/25 text-neon-blue hover:bg-neon-blue/[0.08] hover:border-neon-blue/50 hover:shadow-[0_0_16px_rgba(0,212,255,0.12)] active:scale-[0.97] transition-all duration-200 font-display uppercase tracking-wider text-xs rounded-lg"
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
