// ── 数据键 → 中文显示名 映射 ──
// 标签（Post.tag）与段位（User.lolRank）在数据库中以英文存储，同时又是查询键、
// 样式映射表的 key 和类型联合的成员。汉化时这些英文键必须保持不变，只在渲染层
// 通过下面的映射函数转成中文显示，避免破坏数据库查询与已有数据。

// 标签：key 必须与数据库 Post.tag / mockCategories.name 完全一致
export const TAG_LABELS: Record<string, string> = {
  "#PatchNotes": "版本公告",
  "#Esports": "电子竞技",
  "#LookingForGroup": "组队招募",
  "#Gameplay": "玩法攻略",
  "#Memes": "娱乐玩梗",
  "#Champions": "英雄讨论",
  "#Strategy": "战术策略",
}

// 段位：英雄联盟国服官方译名。key 必须与数据库 User.lolRank 一致
export const RANK_LABELS: Record<string, string> = {
  Iron: "黑铁",
  Bronze: "青铜",
  Silver: "白银",
  Gold: "黄金",
  Platinum: "铂金",
  Emerald: "翡翠",
  Diamond: "钻石",
  Master: "大师",
  Grandmaster: "宗师",
  Challenger: "最强王者",
}

/** 标签英文键 → 中文显示名（无匹配时去掉开头的 # 作为兜底） */
export function tagLabel(tag: string): string {
  return TAG_LABELS[tag] ?? tag.replace("#", "")
}

/** 段位英文键 → 中文显示名（无匹配时原样返回） */
export function rankLabel(rank: string): string {
  return RANK_LABELS[rank] ?? rank
}
