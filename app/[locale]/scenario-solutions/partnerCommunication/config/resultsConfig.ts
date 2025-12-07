// 结果等级类型
export type ResultLevel = "beginner" | "intermediate" | "advanced" | "expert";

// 结果配置接口
export interface ResultConfig {
  title: string;
  description: string;
  recommendations: string[];
  color: string;
  icon: string;
  nextSteps: string[];
}

// 注意：结果配置已移动到翻译文件中
// 这里保留接口定义和工具函数

// 注意：stage2结果配置已移动到翻译文件中

// 注意：综合结果配置已移动到翻译文件中

// 获取结果配置的工具函数
// 支持国际化的结果配置获取函数
export const getResultConfig = (): ResultConfig => {
  // 这里需要从翻译文件中获取数据，而不是使用硬编码的配置
  // 由于我们需要在组件中调用翻译函数，这里返回一个占位符配置
  // 实际的配置将在组件中通过翻译函数获取

  const defaultConfig: ResultConfig = {
    title: "",
    description: "",
    recommendations: [],
    color: "text-gray-600 bg-gray-100",
    icon: "💙",
    nextSteps: [],
  };

  return defaultConfig;
};

// 注意：getCombinedResultConfig 函数已不再需要，因为配置已移动到翻译文件中

// 根据分数计算等级的工具函数 - 采用三级划分系统
export const calculateLevel = (percentage: number): ResultLevel => {
  // 参考代码的三级划分：0-3分、4-7分、8-10分
  if (percentage <= 30) return "beginner"; // 0-3分 (0-30%)
  if (percentage <= 70) return "intermediate"; // 4-7分 (40-70%)
  return "advanced"; // 8-10分 (80-100%)
};

// 注意：generatePersonalizedRecommendations 函数已不再需要
// 因为建议配置已移动到翻译文件中，组件可以直接通过翻译函数获取
