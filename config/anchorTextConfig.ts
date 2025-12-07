// config/anchorTextConfig.ts
/**
 * 锚文本优化配置 - 最终优化版
 *
 * 核心原则：
 * 1. 严格长度控制：6个字符（不含标点）
 * 2. 分类使用动作词：
 *    - 内容链接（文章、指南）→ 不用动作词
 *    - 功能链接（工具、下载）→ 使用动作词
 * 3. 关键词策略：
 *    - 核心页面必须含"痛经"或"经期"
 *    - 工具/场景页面可省略核心词
 * 4. 避免重复：同类链接使用不同表述
 */

export const ANCHOR_TEXTS = {
  // 文章页面（不用动作词，6字符）
  articles: {
    relief: "痛经缓解方法", // 6字，含核心词
    heat: "热疗止痛原理", // 6字，具体化
    physical: "物理疗法指南", // 6字，专业化
    medical: "就医诊断指南", // 6字，场景化
    knowledge: "更多健康知识", // 6字，通用化
    comprehensive: "完整医学指南", // 6字，专业化
    related: "相关健康文章", // 6字，通用化
  },

  // 交互工具（使用动作词，6字符）
  tools: {
    main: "使用健康工具", // 6字，保留动作词
    tracker: "追踪痛经症状", // 6字，含核心词
    assessment: "评估症状等级", // 6字，功能化
    nutrition: "获取营养建议", // 6字，功能化
    calculator: "计算影响程度", // 6字，功能化
    all: "浏览全部工具", // 6字，保留动作词
  },

  // 场景解决方案（场景词优先，6字符）
  scenarios: {
    exercise: "运动期间应对", // 6字，场景词
    office: "职场痛经管理", // 6字，含核心词
    social: "社交场合应对", // 6字，场景词
    sleep: "改善睡眠质量", // 6字，场景词
    diet: "饮食调理方案", // 6字，场景词
    emergency: "紧急处理方法", // 6字，场景词
    medication: "药物使用建议", // 6字，场景词
  },

  // 导航和主页（含核心词，6字符）
  navigation: {
    main: "痛经管理指南", // 6字，含核心词
    health: "经期健康中心", // 6字，含核心词
    guide: "健康管理指南", // 6字，通用化
    teen: "青少年专区", // 5字，简洁化
    therapy: "自然疗法中心", // 6字，场景词
  },

  // CTA按钮（含动作词，6字符）
  cta: {
    viewMore: "查看完整内容", // 6字，含动作词
    startNow: "立即开始使用", // 6字，含动作词
    learnMore: "了解详细信息", // 6字，含动作词
    tryNow: "立即体验工具", // 6字，含动作词
    download: "下载健康资料", // 6字，含动作词
  },

  // PDF下载（含动作词，6字符）
  pdf: {
    guide: "下载完整指南", // 6字，含动作词
    checklist: "下载应急清单", // 6字，含动作词
    resources: "下载健康资料", // 6字，含动作词
  },

  // 青少年专区（6字符）
  teen: {
    main: "青少年痛经指南", // 7字，含核心词（特殊处理）
    development: "发育期健康", // 6字，场景词
    education: "经期健康教育", // 6字，含核心词
  },

  // 自然疗法（6字符）
  therapy: {
    main: "自然缓解方法", // 6字，场景词
    herbal: "整体健康调理方案", // 6字，场景词
    yoga: "瑜伽缓解技巧", // 6字，场景词
    diet: "饮食调理建议", // 6字，场景词
  },
} as const;

// 类型定义（用于TypeScript类型检查）
export type AnchorTextSection = keyof typeof ANCHOR_TEXTS;
export type AnchorTextKey<T extends AnchorTextSection> =
  keyof (typeof ANCHOR_TEXTS)[T];

/**
 * 获取锚文本的辅助函数
 * @param section - 页面区域
 * @param key - 具体的锚文本键
 * @returns 优化后的锚文本
 */
export function getAnchorText<T extends AnchorTextSection>(
  section: T,
  key: AnchorTextKey<T>,
): string {
  return ANCHOR_TEXTS[section][key] as string;
}

/**
 * 验证锚文本长度（确保6字符）
 * @param text - 锚文本
 * @returns 是否符合长度要求
 */
export function validateAnchorTextLength(text: string): boolean {
  return text.length === 6;
}

/**
 * 检查是否包含核心关键词
 * @param text - 锚文本
 * @returns 是否包含"痛经"或"经期"
 */
export function containsCoreKeyword(text: string): boolean {
  return text.includes("痛经") || text.includes("经期");
}

/**
 * 计算关键词密度
 * @returns 核心关键词出现频率
 */
export function calculateKeywordDensity(): number {
  const allTexts = Object.values(ANCHOR_TEXTS)
    .flat()
    .map((category) => Object.values(category).flat())
    .flat();
  const coreKeywordCount = allTexts.filter(containsCoreKeyword).length;
  return coreKeywordCount / allTexts.length;
}

/**
 * A/B测试变体配置（可选）
 * 用于对比测试不同锚文本的效果
 */
export const ANCHOR_TEXT_AB_TEST = {
  enabled: false, // 设置为true启用A/B测试

  variants: {
    // 测试是否保留动作词
    withAction: {
      main: "查看痛经指南",
      tools: "使用健康工具",
    },
    withoutAction: {
      main: "痛经管理指南",
      tools: "健康工具中心",
    },

    // 测试关键词密度
    highKeyword: {
      main: "痛经缓解方法",
      health: "经期健康中心",
    },
    lowKeyword: {
      main: "缓解方法指南",
      health: "健康管理中心",
    },
  },

  /**
   * 获取A/B测试锚文本
   * @param section - 页面区域
   * @param userGroup - 用户分组（'control' 或 'variant'）
   */
  getTestAnchorText(section: string, userGroup: "control" | "variant"): string {
    if (!this.enabled) {
      return getAnchorText(
        section as AnchorTextSection,
        "main" as AnchorTextKey<AnchorTextSection>,
      );
    }

    const variant = this.variants[userGroup];
    if (!variant) {
      return getAnchorText(
        section as AnchorTextSection,
        "main" as AnchorTextKey<AnchorTextSection>,
      );
    }

    return (
      variant[section as keyof typeof variant] ||
      getAnchorText(
        section as AnchorTextSection,
        "main" as AnchorTextKey<AnchorTextSection>,
      )
    );
  },
};

/**
 * 禁止使用的通用锚文本列表
 * 用于代码审查和自动化检查
 */
export const BANNED_ANCHOR_TEXTS = [
  "了解更多",
  "查看更多",
  "阅读更多",
  "点击这里",
  "点击查看",
  "click here",
  "read more",
  "learn more",
  "查看详情",
  "立即查看",
  "开始使用",
  "立即开始",
] as const;

/**
 * 锚文本使用统计
 */
export const ANCHOR_TEXT_STATS = {
  totalCount: Object.values(ANCHOR_TEXTS)
    .flat()
    .map((category) => Object.values(category).flat())
    .flat().length,
  averageLength:
    Object.values(ANCHOR_TEXTS)
      .flat()
      .map((category) => Object.values(category).flat())
      .flat()
      .reduce((sum, text) => sum + text.length, 0) /
    Object.values(ANCHOR_TEXTS)
      .flat()
      .map((category) => Object.values(category).flat())
      .flat().length,
  keywordDensity: calculateKeywordDensity(),
  actionWordCount: Object.values(ANCHOR_TEXTS)
    .flat()
    .map((category) => Object.values(category).flat())
    .flat()
    .filter(
      (text) =>
        text.includes("查看") ||
        text.includes("下载") ||
        text.includes("立即") ||
        text.includes("使用"),
    ).length,
};

// 导出统计信息
export function getAnchorTextStats() {
  return {
    ...ANCHOR_TEXT_STATS,
    keywordDensityPercentage: Math.round(
      ANCHOR_TEXT_STATS.keywordDensity * 100,
    ),
    actionWordPercentage: Math.round(
      (ANCHOR_TEXT_STATS.actionWordCount / ANCHOR_TEXT_STATS.totalCount) * 100,
    ),
  };
}
