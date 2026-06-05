"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Bell, LogIn, LogOut, Menu, Plus, Search, Settings, User, Zap } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { mockNavLinks } from "@/data/mock-nav"
import { cn } from "@/lib/utils"
import type { Category, UserStats } from "@/lib/types"
import { Sidebar } from "./Sidebar"

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
    <header className="fixed top-0 z-50 h-14 w-full border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-foreground hover:bg-accent">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] border-r border-border bg-card p-0">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <Sidebar
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={(id) => {
                  router.push(activeCategory === id ? "/" : `/?category=${id}`)
                }}
                className="h-full"
              />
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Zap size={19} strokeWidth={2.4} />
            </span>
            <span className="hidden text-xl font-bold tracking-tight text-foreground sm:block">NEXUS</span>
          </Link>

          <nav className="ml-2 hidden items-center gap-1 lg:flex">
            {mockNavLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
              return (
                <Button
                  key={link.href}
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(
                    "h-9 rounded-xl px-3 text-muted-foreground hover:bg-accent hover:text-foreground",
                    isActive && "bg-accent text-foreground",
                  )}
                >
                  <Link href={link.href} className="flex items-center gap-2">
                    <link.icon size={16} />
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                </Button>
              )
            })}
          </nav>
        </div>

        <div className="relative hidden flex-1 sm:block sm:max-w-md">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-10 rounded-xl border-border bg-background pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/45 focus:ring-primary/20"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            size="sm"
            asChild
            className="hidden h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:inline-flex"
          >
            <Link href="/submit">
              <Plus size={16} strokeWidth={2.4} />
              New Post
            </Link>
          </Button>
          <Button
            size="icon"
            asChild
            className="h-10 w-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 sm:hidden"
          >
            <Link href="/submit">
              <Plus size={18} strokeWidth={2.4} />
            </Link>
          </Button>

          <ThemeToggle />

          <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground">
            <Bell size={18} />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary" />
          </Button>

          {status === "loading" ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-accent">
                  <Avatar className="h-8 w-8 ring-2 ring-border">
                    <AvatarImage src={userStats.avatarUrl} alt={userStats.summonerName} />
                    <AvatarFallback className="bg-secondary text-sm font-semibold text-secondary-foreground">
                      {userStats.summonerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mt-2 w-56 rounded-2xl border-border bg-popover p-1.5 shadow-2xl">
                <div className="flex items-center gap-3 px-2.5 py-2">
                  <Avatar className="h-9 w-9 ring-1 ring-border">
                    <AvatarImage src={userStats.avatarUrl} alt={userStats.summonerName} />
                    <AvatarFallback className="bg-secondary text-sm font-semibold text-secondary-foreground">
                      {userStats.summonerName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{userStats.summonerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {userStats.rank}
                      {userStats.lp ? ` · ${userStats.lp} LP` : ""}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator className="my-1 bg-border" />
                <DropdownMenuItem asChild className="rounded-xl text-muted-foreground focus:bg-accent focus:text-foreground">
                  <Link href="/profile" className="flex items-center px-2.5 py-2 text-sm">
                    <User size={16} className="mr-2 text-muted-foreground" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl text-muted-foreground focus:bg-accent focus:text-foreground">
                  <Link href="/settings" className="flex items-center px-2.5 py-2 text-sm">
                    <Settings size={16} className="mr-2 text-muted-foreground" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-border" />
                <DropdownMenuItem
                  className="rounded-xl text-muted-foreground focus:bg-accent focus:text-foreground"
                  onClick={() => signOut()}
                >
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => signIn("github")}
              className="h-10 rounded-xl border-border bg-card px-3 text-sm font-semibold text-foreground hover:bg-accent"
            >
              <LogIn size={16} />
              <span className="hidden sm:inline">Sign in</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
