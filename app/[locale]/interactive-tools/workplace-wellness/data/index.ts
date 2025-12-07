/**
 * HVsLYEp职场健康助手 - 数据文件
 * 基于HVsLYEp的data.js结构迁移
 */

import {
  PeriodRecord,
  NutritionRecommendation,
  LeaveTemplate,
  MenstrualPhase,
  SeverityLevel,
  HolisticNature,
} from "../types";

// 模拟经期数据 - 基于HVsLYEp的mockPeriodData，包含更多近期数据
export const mockPeriodData: PeriodRecord[] = [
  // 最近的经期记录
  { date: "2025-11-18", type: "predicted", painLevel: null, flow: null },
  { date: "2025-11-08", type: "period", painLevel: 3, flow: "light" },
  { date: "2025-11-07", type: "period", painLevel: 6, flow: "heavy" },
  { date: "2025-11-06", type: "period", painLevel: 5, flow: "medium" },
  { date: "2025-11-05", type: "period", painLevel: 4, flow: "medium" },

  // 上一个月周期
  { date: "2025-10-16", type: "period", painLevel: 2, flow: "light" },
  { date: "2025-10-15", type: "period", painLevel: 3, flow: "light" },
  { date: "2025-10-14", type: "period", painLevel: 6, flow: "medium" },
  { date: "2025-10-13", type: "period", painLevel: 5, flow: "medium" },
  { date: "2025-10-12", type: "predicted", painLevel: null, flow: null },

  // 两个月前的周期
  { date: "2025-09-17", type: "period", painLevel: 4, flow: "medium" },
  { date: "2025-09-16", type: "period", painLevel: 6, flow: "heavy" },
  { date: "2025-09-15", type: "period", painLevel: 7, flow: "heavy" },
];

// 营养数据 - 基于HVsLYEp的mockNutritionData结构，支持多语言
export const mockNutritionData = {
  zh: [
    {
      name: "黑巧克力",
      benefits: ["提升铁水平", "缓解疼痛", "改善贫血"],
      phase: "menstrual" as MenstrualPhase,
      holisticNature: "warm" as HolisticNature,
      nutrients: ["镁", "铁", "抗氧化剂"],
    },
    {
      name: "姜茶",
      benefits: ["减少炎症", "缓解疲劳", "镇静神经"],
      phase: "menstrual" as MenstrualPhase,
      holisticNature: "warm" as HolisticNature,
      nutrients: ["姜辣素", "抗炎成分", "抗氧化剂"],
    },
    {
      name: "黑豆",
      benefits: ["补肾益精", "调节激素", "抗氧化"],
      phase: "follicular" as MenstrualPhase,
      holisticNature: "neutral" as HolisticNature,
      nutrients: ["蛋白质", "异黄酮", "维生素E"],
    },
    {
      name: "菠菜",
      benefits: ["提升铁水平", "改善循环", "增强免疫力"],
      phase: "luteal" as MenstrualPhase,
      holisticNature: "warm" as HolisticNature,
      nutrients: ["铁", "维生素C", "叶酸"],
    },
    {
      name: "枸杞",
      benefits: ["滋补肝肾", "明目护眼", "抗衰老"],
      phase: "ovulation" as MenstrualPhase,
      holisticNature: "neutral" as HolisticNature,
      nutrients: ["β-胡萝卜素", "玉米黄质", "多糖"],
    },
  ],
  en: [
    {
      name: "Dark Chocolate",
      benefits: ["Boost Iron Levels", "Relieve Pain", "Improve Anemia"],
      phase: "menstrual" as MenstrualPhase,
      holisticNature: "warm" as HolisticNature,
      nutrients: ["Magnesium", "Iron", "Antioxidants"],
    },
    {
      name: "Ginger Tea",
      benefits: ["Reduce Inflammation", "Calm Nerves", "Relieve Fatigue"],
      phase: "menstrual" as MenstrualPhase,
      holisticNature: "warm" as HolisticNature,
      nutrients: ["Gingerol", "Anti-inflammatory compounds", "Antioxidants"],
    },
    {
      name: "Black Beans",
      benefits: ["Tonify Kidneys", "Regulate Hormones", "Antioxidant"],
      phase: "follicular" as MenstrualPhase,
      holisticNature: "neutral" as HolisticNature,
      nutrients: ["Protein", "Isoflavones", "Vitamin E"],
    },
    {
      name: "Spinach",
      benefits: [
        "Boost Iron Levels",
        "Improve Circulation",
        "Support Immunity",
      ],
      phase: "luteal" as MenstrualPhase,
      holisticNature: "warm" as HolisticNature,
      nutrients: ["Iron", "Vitamin C", "Folic Acid"],
    },
    {
      name: "Goji Berries",
      benefits: ["Nourish Liver", "Improve Vision", "Anti-aging"],
      phase: "ovulation" as MenstrualPhase,
      holisticNature: "neutral" as HolisticNature,
      nutrients: ["Beta-carotene", "Zeaxanthin", "Polysaccharides"],
    },
  ],
};

// 请假模板 - 基于HVsLYEp的leaveTemplates结构，支持多语言
export const leaveTemplates = {
  zh: [
    {
      id: 1,
      title: "轻度不适请假模板",
      severity: "mild" as SeverityLevel,
      subject: "因身体不适申请请假",
      content:
        "您好，由于身体不适，我需要请半天假。我会确保工作得到妥善处理。如有紧急事务请与我联系。谢谢您的理解。",
    },
    {
      id: 2,
      title: "中度疼痛请假模板",
      severity: "moderate" as SeverityLevel,
      subject: "因健康原因申请请假",
      content:
        "您好，由于健康原因，我需要请1天假休息恢复。我已经安排了工作交接。紧急事务可以通过邮件处理。谢谢您的理解和支持。",
    },
    {
      id: 3,
      title: "居家办公申请模板",
      severity: "moderate" as SeverityLevel,
      subject: "申请居家办公",
      content:
        "您好，由于健康原因，我希望今天能够居家办公。我会保持正常的工作时间和沟通，确保工作不受影响。谢谢您的考虑。",
    },
    {
      id: 4,
      title: "严重疼痛紧急请假",
      severity: "severe" as SeverityLevel,
      subject: "紧急请假申请",
      content:
        "您好，由于严重的健康问题，我需要紧急请假。我会立即安排工作交接，重要事务可以通过电话联系我。感谢您在这个困难时期的理解。",
    },
  ],
  en: [
    {
      id: 1,
      title: "Template for Mild Discomfort",
      severity: "mild" as SeverityLevel,
      subject: "Leave Request for Physical Discomfort",
      content:
        "Hello, I need to take a half-day leave due to physical discomfort. I will ensure my work is handled properly. Please contact me for urgent matters. Thank you for your understanding.",
    },
    {
      id: 2,
      title: "Template for Moderate Pain",
      severity: "moderate" as SeverityLevel,
      subject: "Leave Request for Health Reasons",
      content:
        "Hello, I need to take a 1-day leave for rest and recovery due to health reasons. I have arranged for the handover of my work. Urgent matters can be addressed via email. Thank you for your understanding and support.",
    },
    {
      id: 3,
      title: "Work From Home Request Template",
      severity: "moderate" as SeverityLevel,
      subject: "Request to Work From Home",
      content:
        "Hello, due to health reasons, I would like to request to work from home today. I will maintain my normal working hours and communication to ensure my work is not affected. Thank you for your consideration.",
    },
    {
      id: 4,
      title: "Severe Pain Emergency Leave",
      severity: "severe" as SeverityLevel,
      subject: "Emergency Leave Request",
      content:
        "Hello, I need to take an emergency leave due to severe health issues. I will arrange for immediate work handover and will be available for critical matters via phone. Thank you for your understanding during this difficult time.",
    },
  ],
};

// 数据获取函数
export function getPeriodData(): PeriodRecord[] {
  return mockPeriodData;
}

export function getNutritionData(
  locale: string = "en",
): NutritionRecommendation[] {
  return (
    mockNutritionData[locale as keyof typeof mockNutritionData] ||
    mockNutritionData.en
  );
}

export function getLeaveTemplates(locale: string = "en"): LeaveTemplate[] {
  return (
    leaveTemplates[locale as keyof typeof leaveTemplates] || leaveTemplates.en
  );
}

// 数据验证函数 - 基于HVsLYEp的数据结构
import {
  validatePeriodData,
  validateNutritionData,
  validateLeaveTemplates,
} from "../utils/validation";

export function validateAllData() {
  // 获取当前语言的数据（默认使用中文）
  const nutritionDataArray = getNutritionData("zh");
  const leaveTemplatesArray = getLeaveTemplates("zh");

  const results = {
    periodData: validatePeriodData(mockPeriodData),
    nutritionData: validateNutritionData(nutritionDataArray),
    leaveTemplates: validateLeaveTemplates(leaveTemplatesArray),
  };

  return results;
}

// 数据完整性检查
export function checkDataIntegrity() {
  const issues: string[] = [];

  // 检查经期数据
  if (mockPeriodData.length === 0) {
    issues.push("No period data available");
  }

  // 检查营养数据
  if (
    !mockNutritionData ||
    !mockNutritionData.zh ||
    mockNutritionData.zh.length === 0
  ) {
    issues.push("No nutrition data available");
  }

  // 检查请假模板
  if (!leaveTemplates || !leaveTemplates.zh || leaveTemplates.zh.length === 0) {
    issues.push("No leave templates available");
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
