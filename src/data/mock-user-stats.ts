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
  status: "Online — In Queue",
  wins: 124,
  losses: 89,
  mainChampions: [
    { name: "LeBlanc", imageUrl: "/champions/leblanc.svg", kda: 6.8, winRate: 72, games: 47 },
    { name: "Azir", imageUrl: "/champions/azir.svg", kda: 4.2, winRate: 65, games: 38 },
    { name: "Ryze", imageUrl: "/champions/ryze.svg", kda: 3.9, winRate: 58, games: 29 },
  ],
}
