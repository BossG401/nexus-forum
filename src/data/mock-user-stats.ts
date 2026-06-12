import { UserStats } from "@/lib/types"

export const mockUserStats: UserStats = {
  summonerName: "Hide on bush",
  rank: "Challenger",
  rankTier: "I",
  lp: 1234,
  winRate: 68.5,
  kda: 5.2,
  playtimeHours: 8432,
  avatarUrl: "/avatars/faker.png",
  region: "KR",
  server: "IONIA",
  status: "在线 — 匹配中",
  wins: 124,
  losses: 89,
  mainChampions: [
    { name: "乐芙兰", imageUrl: "/champions/leblanc.svg", kda: 6.8, winRate: 72, games: 47 },
    { name: "阿兹尔", imageUrl: "/champions/azir.svg", kda: 4.2, winRate: 65, games: 38 },
    { name: "瑞兹", imageUrl: "/champions/ryze.svg", kda: 3.9, winRate: 58, games: 29 },
  ],
}
