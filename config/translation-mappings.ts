/**
 * 翻译键映射配置
 * 建立代码中使用的键与翻译文件的映射关系
 *
 * 用途：
 * 1. 确保代码与翻译文件同步
 * 2. 提供类型安全的翻译键管理
 * 3. 自动化验证翻译键完整性
 */

// 文章类型映射
export const ANCHOR_TEXT_MAPPINGS = {
  articles: {
    ginger: {
      zh: "生姜疗法指南",
      en: "Ginger Therapy Guide",
      description: "生姜缓解痛经的完整指南",
      category: "自然疗法",
    },
    heat: {
      zh: "热敷疗法指南",
      en: "Heat Therapy Guide",
      description: "热敷缓解痛经的科学方法",
      category: "自然疗法",
    },
    medical: {
      zh: "医学指南",
      en: "Medical Guide",
      description: "专业医学指导",
      category: "医疗指导",
    },
    related: {
      zh: "了解更多",
      en: "Learn More",
      description: "默认链接文本",
      category: "通用",
    },
    workplace_health: {
      zh: "职场健康管理",
      en: "Workplace Health Management",
      description: "职场环境下的健康管理指南",
      category: "职场健康",
    },
    pain_management: {
      zh: "疼痛管理指南",
      en: "Pain Management Guide",
      description: "综合疼痛管理策略",
      category: "疼痛管理",
    },
    quick_relief: {
      zh: "快速缓解技巧",
      en: "Quick Relief Techniques",
      description: "快速缓解痛经的方法",
      category: "即时缓解",
    },
    nutrition_guide: {
      zh: "营养调理指南",
      en: "Nutrition Therapy Guide",
      description: "营养调理缓解痛经",
      category: "营养调理",
    },
  },

  // 工具类型映射
  tools: {
    nutrition_generator: {
      zh: "营养生成器",
      en: "Nutrition Generator",
      description: "个性化营养推荐工具",
    },
    pain_tracker: {
      zh: "疼痛追踪器",
      en: "Pain Tracker",
      description: "疼痛记录和分析工具",
    },
    symptom_assessment: {
      zh: "症状评估",
      en: "Symptom Assessment",
      description: "症状评估和诊断工具",
    },
    tracker: {
      zh: "追踪器",
      en: "Tracker",
      description: "通用追踪工具",
    },
    nutrition: {
      zh: "营养工具",
      en: "Nutrition Tool",
      description: "营养相关工具",
    },
    assessment: {
      zh: "评估工具",
      en: "Assessment Tool",
      description: "评估和测试工具",
    },
  },

  // 解决方案类型映射
  solutions: {
    sleep: {
      zh: "睡眠管理",
      en: "Sleep Management",
      description: "睡眠质量改善方案",
    },
    exercise: {
      zh: "运动调理",
      en: "Exercise Therapy",
      description: "运动缓解痛经方案",
    },
    workplace_wellness: {
      zh: "职场健康",
      en: "Workplace Wellness",
      description: "职场健康管理方案",
    },
    relief: {
      zh: "缓解方案",
      en: "Relief Solutions",
      description: "疼痛缓解解决方案",
    },
  },
};

// 面包屑导航映射
export const BREADCRUMB_MAPPINGS = {
  painTracker: {
    zh: "疼痛追踪器",
    en: "Pain Tracker",
    description: "疼痛追踪器页面面包屑",
  },
  interactiveTools: {
    zh: "互动工具",
    en: "Interactive Tools",
    description: "互动工具页面面包屑",
  },
  home: {
    zh: "首页",
    en: "Home",
    description: "首页面包屑",
  },
};

// 验证映射完整性的工具函数
export function validateTranslationMappings() {
  const missing = [];

  // 验证文章映射
  Object.entries(ANCHOR_TEXT_MAPPINGS.articles).forEach(([key, mapping]) => {
    if (!mapping.zh || !mapping.en) {
      missing.push(`articles.${key}`);
    }
  });

  // 验证工具映射
  Object.entries(ANCHOR_TEXT_MAPPINGS.tools).forEach(([key, mapping]) => {
    if (!mapping.zh || !mapping.en) {
      missing.push(`tools.${key}`);
    }
  });

  // 验证解决方案映射
  Object.entries(ANCHOR_TEXT_MAPPINGS.solutions).forEach(([key, mapping]) => {
    if (!mapping.zh || !mapping.en) {
      missing.push(`solutions.${key}`);
    }
  });

  // 验证面包屑映射
  Object.entries(BREADCRUMB_MAPPINGS).forEach(([key, mapping]) => {
    if (!mapping.zh || !mapping.en) {
      missing.push(`breadcrumb.${key}`);
    }
  });

  return missing;
}

// 获取翻译键的类型定义
export type AnchorTextType = keyof typeof ANCHOR_TEXT_MAPPINGS.articles;
export type ToolType = keyof typeof ANCHOR_TEXT_MAPPINGS.tools;
export type SolutionType = keyof typeof ANCHOR_TEXT_MAPPINGS.solutions;
export type BreadcrumbType = keyof typeof BREADCRUMB_MAPPINGS;

// 获取所有可能的 anchorTextType 值
export function getAllAnchorTextTypes(): AnchorTextType[] {
  return Object.keys(ANCHOR_TEXT_MAPPINGS.articles) as AnchorTextType[];
}

// 获取所有可能的工具类型
export function getAllToolTypes(): ToolType[] {
  return Object.keys(ANCHOR_TEXT_MAPPINGS.tools) as ToolType[];
}

// 获取所有可能的解决方案类型
export function getAllSolutionTypes(): SolutionType[] {
  return Object.keys(ANCHOR_TEXT_MAPPINGS.solutions) as SolutionType[];
}

// 检查 anchorTextType 是否有效
export function isValidAnchorTextType(type: string): type is AnchorTextType {
  return type in ANCHOR_TEXT_MAPPINGS.articles;
}

// 检查工具类型是否有效
export function isValidToolType(type: string): type is ToolType {
  return type in ANCHOR_TEXT_MAPPINGS.tools;
}

// 检查解决方案类型是否有效
export function isValidSolutionType(type: string): type is SolutionType {
  return type in ANCHOR_TEXT_MAPPINGS.solutions;
}

// 获取翻译键的完整路径
export function getTranslationKey(
  type: AnchorTextType,
  category: "articles" | "tools" | "solutions" = "articles",
): string {
  return `anchorTexts.${category}.${type}`;
}

// 获取面包屑翻译键的完整路径
export function getBreadcrumbKey(type: BreadcrumbType): string {
  return `interactiveTools.breadcrumb.${type}`;
}

// 生成翻译键使用报告
export function generateTranslationReport() {
  const report = {
    articles: {
      total: Object.keys(ANCHOR_TEXT_MAPPINGS.articles).length,
      keys: Object.keys(ANCHOR_TEXT_MAPPINGS.articles),
    },
    tools: {
      total: Object.keys(ANCHOR_TEXT_MAPPINGS.tools).length,
      keys: Object.keys(ANCHOR_TEXT_MAPPINGS.tools),
    },
    solutions: {
      total: Object.keys(ANCHOR_TEXT_MAPPINGS.solutions).length,
      keys: Object.keys(ANCHOR_TEXT_MAPPINGS.solutions),
    },
    breadcrumbs: {
      total: Object.keys(BREADCRUMB_MAPPINGS).length,
      keys: Object.keys(BREADCRUMB_MAPPINGS),
    },
  };

  return report;
}

// 导出所有映射用于验证脚本
const translationMappings = {
  ANCHOR_TEXT_MAPPINGS,
  BREADCRUMB_MAPPINGS,
  validateTranslationMappings,
  getAllAnchorTextTypes,
  getAllToolTypes,
  getAllSolutionTypes,
  isValidAnchorTextType,
  isValidToolType,
  isValidSolutionType,
  getTranslationKey,
  getBreadcrumbKey,
  generateTranslationReport,
};

export default translationMappings;
