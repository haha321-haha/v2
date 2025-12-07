/**
 * 推荐内容库配置
 *
 * 这个文件包含所有推荐内容的配置
 * 每个推荐项都包含:
 * - id: 唯一标识符
 * - type: 推荐类型 (article/tool/scenario/tip/action)
 * - category: 推荐类别
 * - title: 标题 (使用 i18n 键)
 * - description: 描述 (使用 i18n 键)
 * - priority: 优先级 (0-100)
 * - href: 链接地址
 * - icon: 图标名称 (lucide-react)
 * - conditions: 触发条件
 * - metadata: 元数据 (可选)
 */

import { RecommendationItem } from "../types/recommendation";

export const RECOMMENDATION_CONTENT: RecommendationItem[] = [
  // ========================================
  // 文章推荐 (Articles)
  // ========================================

  // 高疼痛相关文章
  {
    id: "article-dysmenorrhea-guide",
    type: "article",
    category: "pain-relief",
    title: "content.articles.dysmenorrheaGuide.title",
    description: "content.articles.dysmenorrheaGuide.description",
    priority: 85,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/articles/comprehensive-medical-guide-to-dysmenorrhea",
    icon: "BookOpen",
    metadata: {
      readTime: 15,
      difficulty: "medium",
      tags: ["medical", "comprehensive", "guide"],
    },
    conditions: {
      minPainLevel: 6,
      maxPainLevel: 10,
    },
  },

  {
    id: "article-immediate-relief",
    type: "article",
    category: "pain-relief",
    title: "content.articles.immediateRelief.title",
    description: "content.articles.immediateRelief.description",
    priority: 90,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/immediate-relief",
    icon: "Zap",
    metadata: {
      readTime: 8,
      difficulty: "easy",
      tags: ["immediate", "relief", "practical"],
    },
    conditions: {
      minPainLevel: 7,
      maxPainLevel: 10,
    },
  },

  {
    id: "article-medical-care-guide",
    type: "article",
    category: "medical",
    title: "content.articles.medicalCareGuide.title",
    description: "content.articles.medicalCareGuide.description",
    priority: 95,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/articles/when-to-seek-medical-care-comprehensive-guide",
    icon: "Stethoscope",
    metadata: {
      readTime: 12,
      difficulty: "medium",
      tags: ["medical", "consultation", "serious"],
    },
    conditions: {
      minPainLevel: 8,
      maxPainLevel: 10,
    },
  },

  // 中低疼痛相关文章
  {
    id: "article-natural-therapies",
    type: "article",
    category: "natural-therapy",
    title: "content.articles.naturalTherapies.title",
    description: "content.articles.naturalTherapies.description",
    priority: 70,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/natural-therapies",
    icon: "Leaf",
    metadata: {
      readTime: 10,
      difficulty: "easy",
      tags: ["natural", "holistic-health", "holistic"],
    },
    conditions: {
      minPainLevel: 4,
      maxPainLevel: 8,
    },
  },

  {
    id: "article-understanding-pain",
    type: "article",
    category: "pain-relief",
    title: "content.articles.understandingPain.title",
    description: "content.articles.understandingPain.description",
    priority: 60,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/articles/understanding-period-pain",
    icon: "BookOpen",
    metadata: {
      readTime: 12,
      difficulty: "medium",
      tags: ["education", "medical", "science"],
    },
    conditions: {
      minPainLevel: 1,
      maxPainLevel: 10,
    },
  },

  {
    id: "article-medication-guide",
    type: "article",
    category: "pain-relief",
    title: "content.articles.medicationGuide.title",
    description: "content.articles.medicationGuide.description",
    priority: 75,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/downloads/medication-guide",
    icon: "Pill",
    metadata: {
      readTime: 10,
      difficulty: "medium",
      tags: ["medication", "safety", "guide"],
    },
    conditions: {
      minPainLevel: 5,
      maxPainLevel: 10,
    },
  },

  {
    id: "article-teen-health",
    type: "article",
    category: "pain-relief",
    title: "content.articles.teenHealth.title",
    description: "content.articles.teenHealth.description",
    priority: 65,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/articles/teen-health-guide",
    icon: "Heart",
    metadata: {
      readTime: 8,
      difficulty: "easy",
      tags: ["teen", "education", "beginner"],
    },
    conditions: {
      minPainLevel: 1,
      maxPainLevel: 10,
    },
  },

  // ========================================
  // 工具推荐 (Tools)
  // ========================================

  {
    id: "tool-pain-tracker",
    type: "tool",
    category: "tracking",
    title: "content.tools.painTracker.title",
    description: "content.tools.painTracker.description",
    priority: 70,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/interactive-tools/pain-tracker",
    icon: "LineChart",
    metadata: {
      difficulty: "easy",
      tags: ["tracking", "analytics", "data"],
    },
    conditions: {
      minPainLevel: 3,
    },
  },

  {
    id: "tool-symptom-assessment",
    type: "tool",
    category: "assessment",
    title: "content.tools.symptomAssessment.title",
    description: "content.tools.symptomAssessment.description",
    priority: 80,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/interactive-tools/symptom-assessment",
    icon: "ClipboardCheck",
    metadata: {
      difficulty: "medium",
      tags: ["assessment", "comprehensive", "health"],
    },
    conditions: {
      minPainLevel: 4,
    },
  },

  {
    id: "tool-cycle-tracker",
    type: "tool",
    category: "tracking",
    title: "content.tools.cycleTracker.title",
    description: "content.tools.cycleTracker.description",
    priority: 65,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/interactive-tools/cycle-tracker",
    icon: "Calendar",
    metadata: {
      difficulty: "easy",
      tags: ["cycle", "prediction", "planning"],
    },
    conditions: {
      minPainLevel: 1,
    },
  },

  {
    id: "tool-constitution-test",
    type: "tool",
    category: "assessment",
    title: "content.tools.constitutionTest.title",
    description: "content.tools.constitutionTest.description",
    priority: 60,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/interactive-tools/constitution-test",
    icon: "Sparkles",
    metadata: {
      difficulty: "medium",
      tags: ["holistic-health", "holistic", "personalized"],
    },
    conditions: {
      minPainLevel: 1,
    },
  },

  {
    id: "tool-nutrition-generator",
    type: "tool",
    category: "nutrition",
    title: "content.tools.nutritionGenerator.title",
    description: "content.tools.nutritionGenerator.description",
    priority: 55,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/interactive-tools/nutrition-recommendation-generator",
    icon: "Apple",
    metadata: {
      difficulty: "easy",
      tags: ["nutrition", "diet", "personalized"],
    },
    conditions: {
      minPainLevel: 1,
    },
  },

  {
    id: "tool-impact-calculator",
    type: "tool",
    category: "assessment",
    title: "content.tools.impactCalculator.title",
    description: "content.tools.impactCalculator.description",
    priority: 70,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/interactive-tools/period-pain-impact-calculator",
    icon: "Calculator",
    metadata: {
      difficulty: "medium",
      tags: ["impact", "work", "assessment"],
    },
    conditions: {
      minPainLevel: 4,
      maxEfficiency: 70,
    },
  },

  {
    id: "tool-stress-management",
    type: "tool",
    category: "mental-health",
    title: "content.tools.stressManagement.title",
    description: "content.tools.stressManagement.description",
    priority: 65,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/interactive-tools/stress-management",
    icon: "Brain",
    metadata: {
      difficulty: "easy",
      tags: ["stress", "mental-health", "relaxation"],
    },
    conditions: {
      minPainLevel: 5,
      requiredSymptoms: ["anxiety", "mood-swings", "stress"],
    },
  },

  {
    id: "tool-workplace-wellness",
    type: "tool",
    category: "work-adjustment",
    title: "content.tools.workplaceWellness.title",
    description: "content.tools.workplaceWellness.description",
    priority: 75,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/interactive-tools/workplace-wellness",
    icon: "Briefcase",
    metadata: {
      difficulty: "medium",
      tags: ["workplace", "professional", "management"],
    },
    conditions: {
      minPainLevel: 3,
      maxEfficiency: 80,
    },
  },

  // ========================================
  // 场景解决方案 (Scenario Solutions)
  // ========================================

  {
    id: "scenario-office",
    type: "scenario",
    category: "work-adjustment",
    title: "content.scenarios.office.title",
    description: "content.scenarios.office.description",
    priority: 70,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/scenario-solutions/office",
    icon: "Building2",
    metadata: {
      difficulty: "easy",
      tags: ["office", "workplace", "professional"],
    },
    conditions: {
      minPainLevel: 3,
      maxEfficiency: 75,
    },
  },

  {
    id: "scenario-commute",
    type: "scenario",
    category: "work-adjustment",
    title: "content.scenarios.commute.title",
    description: "content.scenarios.commute.description",
    priority: 65,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/scenario-solutions/commute",
    icon: "Bus",
    metadata: {
      difficulty: "easy",
      tags: ["commute", "travel", "transportation"],
    },
    conditions: {
      minPainLevel: 4,
    },
  },

  {
    id: "scenario-exercise",
    type: "scenario",
    category: "natural-therapy",
    title: "content.scenarios.exercise.title",
    description: "content.scenarios.exercise.description",
    priority: 60,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/scenario-solutions/exercise",
    icon: "Dumbbell",
    metadata: {
      difficulty: "medium",
      tags: ["exercise", "fitness", "active"],
    },
    conditions: {
      minPainLevel: 1,
      maxPainLevel: 6,
    },
  },

  {
    id: "scenario-social",
    type: "scenario",
    category: "work-adjustment",
    title: "content.scenarios.social.title",
    description: "content.scenarios.social.description",
    priority: 55,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/scenario-solutions/social",
    icon: "Users",
    metadata: {
      difficulty: "easy",
      tags: ["social", "events", "lifestyle"],
    },
    conditions: {
      minPainLevel: 3,
    },
  },

  {
    id: "scenario-sleep",
    type: "scenario",
    category: "natural-therapy",
    title: "content.scenarios.sleep.title",
    description: "content.scenarios.sleep.description",
    priority: 65,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/scenario-solutions/sleep",
    icon: "Moon",
    metadata: {
      difficulty: "easy",
      tags: ["sleep", "rest", "recovery"],
    },
    conditions: {
      minPainLevel: 4,
      requiredSymptoms: ["fatigue", "insomnia"],
    },
  },

  {
    id: "scenario-emergency-kit",
    type: "scenario",
    category: "emergency",
    title: "content.scenarios.emergencyKit.title",
    description: "content.scenarios.emergencyKit.description",
    priority: 75,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/scenario-solutions/emergency-kit",
    icon: "Package",
    metadata: {
      difficulty: "easy",
      tags: ["emergency", "preparation", "travel"],
    },
    conditions: {
      minPainLevel: 1,
    },
  },

  {
    id: "scenario-partner-communication",
    type: "scenario",
    category: "mental-health",
    title: "content.scenarios.partnerCommunication.title",
    description: "content.scenarios.partnerCommunication.description",
    priority: 50,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/scenario-solutions/partnerCommunication",
    icon: "MessageCircle",
    metadata: {
      difficulty: "medium",
      tags: ["communication", "relationship", "support"],
    },
    conditions: {
      minPainLevel: 1,
    },
  },

  {
    id: "scenario-life-stages",
    type: "scenario",
    category: "pain-relief",
    title: "content.scenarios.lifeStages.title",
    description: "content.scenarios.lifeStages.description",
    priority: 55,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/scenario-solutions/lifeStages",
    icon: "Flower",
    metadata: {
      difficulty: "medium",
      tags: ["life-stages", "aging", "changes"],
    },
    conditions: {
      minPainLevel: 1,
    },
  },

  // ========================================
  // 实用建议 (Tips)
  // ========================================

  {
    id: "tip-heat-therapy",
    type: "tip",
    category: "pain-relief",
    title: "content.tips.heatTherapy.title",
    description: "content.tips.heatTherapy.description",
    priority: 80,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/articles/heat-therapy-complete-guide",
    icon: "Flame",
    metadata: {
      difficulty: "easy",
      tags: ["immediate", "simple", "effective"],
    },
    conditions: {
      minPainLevel: 5,
      maxPainLevel: 10,
    },
  },

  {
    id: "tip-breathing",
    type: "tip",
    category: "mental-health",
    title: "content.tips.breathing.title",
    description: "content.tips.breathing.description",
    priority: 70,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/interactive-tools/stress-management/techniques",
    icon: "Wind",
    metadata: {
      difficulty: "easy",
      tags: ["relaxation", "breathing", "stress-relief"],
    },
    conditions: {
      minPainLevel: 4,
      requiredSymptoms: ["anxiety", "stress"],
    },
  },

  {
    id: "tip-posture",
    type: "tip",
    category: "pain-relief",
    title: "content.tips.posture.title",
    description: "content.tips.posture.description",
    priority: 65,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/immediate-relief#posture",
    icon: "Activity",
    metadata: {
      difficulty: "easy",
      tags: ["posture", "relief", "immediate"],
    },
    conditions: {
      minPainLevel: 4,
      maxPainLevel: 8,
    },
  },

  {
    id: "tip-hydration",
    type: "tip",
    category: "nutrition",
    title: "content.tips.hydration.title",
    description: "content.tips.hydration.description",
    priority: 55,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/natural-therapies#hydration",
    icon: "Droplet",
    metadata: {
      difficulty: "easy",
      tags: ["hydration", "wellness", "prevention"],
    },
    conditions: {
      minPainLevel: 1,
    },
  },

  {
    id: "tip-diet",
    type: "tip",
    category: "nutrition",
    title: "content.tips.dietTips.title",
    description: "content.tips.dietTips.description",
    priority: 60,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/interactive-tools/nutrition-recommendation-generator",
    icon: "Utensils",
    metadata: {
      difficulty: "medium",
      tags: ["diet", "nutrition", "lifestyle"],
    },
    conditions: {
      minPainLevel: 3,
    },
  },

  // ========================================
  // 行动建议 (Actions)
  // ========================================

  {
    id: "action-medical-consultation",
    type: "action",
    category: "medical",
    title: "content.actions.medicalConsultation.title",
    description: "content.actions.medicalConsultation.description",
    priority: 100,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/articles/when-to-seek-medical-care-comprehensive-guide",
    icon: "AlertCircle",
    metadata: {
      difficulty: "easy",
      tags: ["urgent", "medical", "consultation"],
    },
    conditions: {
      minPainLevel: 9,
    },
  },

  {
    id: "action-record-data",
    type: "action",
    category: "tracking",
    title: "content.actions.recordData.title",
    description: "content.actions.recordData.description",
    priority: 50,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/interactive-tools/pain-tracker",
    icon: "PenTool",
    metadata: {
      difficulty: "easy",
      tags: ["tracking", "data", "improvement"],
    },
    conditions: {
      minPainLevel: 1,
    },
  },

  {
    id: "action-update-preferences",
    type: "action",
    category: "tracking",
    title: "content.actions.updatePreferences.title",
    description: "content.actions.updatePreferences.description",
    priority: 45,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/interactive-tools/workplace-wellness",
    icon: "Settings",
    metadata: {
      difficulty: "easy",
      tags: ["preferences", "personalization", "settings"],
    },
    conditions: {
      minPainLevel: 1,
    },
  },

  {
    id: "action-export-data",
    type: "action",
    category: "tracking",
    title: "content.actions.exportData.title",
    description: "content.actions.exportData.description",
    priority: 40,
    relevance: 0,
    score: 0,
    reason: "",
    href: "/interactive-tools/pain-tracker",
    icon: "Download",
    metadata: {
      difficulty: "easy",
      tags: ["export", "backup", "data"],
    },
    conditions: {
      minPainLevel: 1,
    },
  },
];

/**
 * 按类别获取推荐内容
 */
export const getRecommendationsByCategory = (
  category: string,
): RecommendationItem[] => {
  return RECOMMENDATION_CONTENT.filter((item) => item.category === category);
};

/**
 * 按类型获取推荐内容
 */
export const getRecommendationsByType = (
  type: string,
): RecommendationItem[] => {
  return RECOMMENDATION_CONTENT.filter((item) => item.type === type);
};

/**
 * 按ID获取推荐内容
 */
export const getRecommendationById = (
  id: string,
): RecommendationItem | undefined => {
  return RECOMMENDATION_CONTENT.find((item) => item.id === id);
};

/**
 * 获取所有类别
 */
export const getAllCategories = (): string[] => {
  return Array.from(
    new Set(RECOMMENDATION_CONTENT.map((item) => item.category)),
  );
};

/**
 * 获取所有类型
 */
export const getAllTypes = (): string[] => {
  return Array.from(new Set(RECOMMENDATION_CONTENT.map((item) => item.type)));
};
