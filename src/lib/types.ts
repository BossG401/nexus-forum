import type { LucideIcon } from "lucide-react"

// --- Navbar ---
export interface NavLink {
  label: string
  href: string
  icon: LucideIcon
}

// --- Sidebar Categories ---
export interface Category {
  id: string
  name: string
  iconName: string
  postCount: number
  accentColor: "neon-blue" | "neon-purple" | "neon-gold"
}

// --- User Stats ---
export interface ChampionPerformance {
  name: string
  imageUrl: string
  kda: number
  winRate: number
  games: number
}

export interface UserStats {
  summonerName: string
  rank: string
  rankTier: string
  lp: number
  winRate: number
  kda: number
  playtimeHours: number
  avatarUrl: string
  region: string
  server: string
  status: string
  wins: number
  losses: number
  mainChampions: ChampionPerformance[]
}

// --- Trending ---
export interface TrendingTopic {
  id: string
  title: string
  tag: string
  commentCount: number
  upvoteCount: number
}

// --- Friend ---
export interface OnlineFriend {
  name: string
  avatarUrl: string
  rank: string
  status: "online" | "in-game" | "away"
}

// --- Post ---
export type PostRank = "Challenger" | "Grandmaster" | "Master" | "Diamond" | "Platinum" | "Gold"

export interface Post {
  id: string
  title: string
  content: string
  fullContent?: string
  author: {
    name: string
    avatarUrl: string
    rank: PostRank
  }
  tag: string
  tagAccent: "neon-blue" | "neon-purple" | "neon-gold"
  upvotes: number
  downvotes: number
  commentCount: number
  createdAt: string
  userVote?: "upvote" | "downvote" | null
}

// --- Comment ---
export interface Comment {
  id: string
  postId: string
  author: {
    name: string
    avatarUrl: string
    rank: PostRank
  }
  content: string
  createdAt: string
  upvotes: number
}
