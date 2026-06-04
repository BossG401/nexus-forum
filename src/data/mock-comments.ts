import type { Comment } from "@/lib/types"

export const mockComments: Comment[] = [
  {
    id: "c1",
    postId: "p1",
    author: {
      name: "Azir_OneTrick",
      avatarUrl: "/avatars/user6.svg",
      rank: "Grandmaster",
    },
    content:
      "Great breakdown. I tested this myself in practice tool and the CC buffer window is actually closer to 0.375s — still broken considering most CC animations are 0.25s. Riot needs to just remove the buffer entirely or give it a clear visual indicator.",
    createdAt: "1 hour ago",
    upvotes: 342,
  },
  {
    id: "c2",
    postId: "p1",
    author: {
      name: "Hide on bush",
      avatarUrl: "/avatars/faker.png",
      rank: "Challenger",
    },
    content:
      "The frame data on Yone's E recast is exactly why I ban him every game in solo queue. You can't outplay a mechanic that has no visual feedback. Good post.",
    createdAt: "45 minutes ago",
    upvotes: 891,
  },
  {
    id: "c3",
    postId: "p1",
    author: {
      name: "LCK_Enjoyer",
      avatarUrl: "/avatars/user2.svg",
      rank: "Master",
    },
    content:
      "Does anyone have the frame data for the Q3 flash buffer? I feel like that one's even worse — I've been knocked up by Yone Q3 when he's facing the wrong direction on my screen.",
    createdAt: "30 minutes ago",
    upvotes: 156,
  },
  {
    id: "c4",
    postId: "p1",
    author: {
      name: "ClashKing_EUW",
      avatarUrl: "/avatars/user3.svg",
      rank: "Diamond",
    },
    content:
      "Honestly just delete Yone. Zed has counterplay, Yasuo has counterplay. Yone has a get-out-of-jail-free card on a 20s cooldown AND a shield. The champ is fundamentally broken.",
    createdAt: "20 minutes ago",
    upvotes: 67,
  },
  {
    id: "c5",
    postId: "p1",
    author: {
      name: "PatchNotesBot",
      avatarUrl: "/avatars/user4.svg",
      rank: "Platinum",
    },
    content:
      "Heads up — the 25.12 patch notes mention a 0.25s delay added to Yone E recast. This should address the CC buffer issue OP mentioned. ETA: next Wednesday.",
    createdAt: "10 minutes ago",
    upvotes: 423,
  },
  {
    id: "c6",
    postId: "p1",
    author: {
      name: "CosplayQueen",
      avatarUrl: "/avatars/user5.svg",
      rank: "Gold",
    },
    content:
      "As a casual player this stuff is wild. I didn't even know Yone HAD a CC buffer lol. No wonder I can never land my Lux Q on him...",
    createdAt: "5 minutes ago",
    upvotes: 89,
  },
  {
    id: "c7",
    postId: "p4",
    author: {
      name: "Faker_Fan_99",
      avatarUrl: "/avatars/user1.svg",
      rank: "Challenger",
    },
    content:
      "AZIR BUFFS LET'S GOOOOO. Nashor's into Shadowflame is going to be disgusting. I've been waiting for this since 25.8.",
    createdAt: "6 hours ago",
    upvotes: 567,
  },
  {
    id: "c8",
    postId: "p4",
    author: {
      name: "LCK_Enjoyer",
      avatarUrl: "/avatars/user2.svg",
      rank: "Master",
    },
    content:
      "The Phase Rush changes are low-key the biggest part of this patch. MS boost going from 30-60% to 20-40% nerfs a ton of junglers.",
    createdAt: "5 hours ago",
    upvotes: 234,
  },
]
