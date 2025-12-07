/**
 * 推荐引擎 - 基于ziV1d3d的handleGenerate方法
 * 完全复用ziV1d3d的推荐生成逻辑
 */

import { nutritionData } from "../data/nutritionRecommendations";
import {
  aggregateRecommendations,
  formatResultsForDisplay,
  hasValidSelections,
  getNoSelectionMessage,
} from "./dataAggregator";

// 基于ziV1d3d的推荐结果结构
export interface ZIV1D3DRecommendationResult {
  category: string;
  items: Array<{
    title: string;
    items: Array<{ en: string; zh: string }>;
    icon: string;
    color: string;
    delay: string;
  }>;
}

// 基于ziV1d3d的generateRecommendations函数
export function generateRecommendations(
  selections: {
    menstrualPhase: string | null;
    healthGoals: Set<string>;
    holisticHealthConstitution: Set<string>;
  },
  language: "en" | "zh",
): ZIV1D3DRecommendationResult | null {
  // 检查是否有有效选择 - 基于ziV1d3d的验证
  if (!hasValidSelections(selections)) {
    return null;
  }

  // 聚合推荐数据 - 基于ziV1d3d的handleGenerate方法
  const aggregated = aggregateRecommendations(selections, nutritionData);

  // 格式化结果用于显示 - 基于ziV1d3d的displayResults方法
  const formattedResults = formatResultsForDisplay(aggregated, language);

  return {
    category:
      language === "zh"
        ? "您的个性化营养建议"
        : "Your Personalized Nutrition Recommendations",
    items: formattedResults,
  };
}

// 基于ziV1d3d的验证函数
export function validateSelections(selections: {
  menstrualPhase: string | null;
  healthGoals: Set<string>;
  holisticHealthConstitution: Set<string>;
}): { isValid: boolean; message: string } {
  if (!hasValidSelections(selections)) {
    return {
      isValid: false,
      message: getNoSelectionMessage("zh"), // 默认中文，实际使用时根据当前语言设置
    };
  }
  return { isValid: true, message: "" };
}

// 获取推荐统计信息 - 基于ziV1d3d的数据结构
export function getRecommendationStats(selections: {
  menstrualPhase: string | null;
  healthGoals: Set<string>;
  holisticHealthConstitution: Set<string>;
}) {
  const aggregated = aggregateRecommendations(selections, nutritionData);

  return {
    totalRecommendedFoods: aggregated.recommendedFoods.size,
    totalFoodsToAvoid: aggregated.foodsToAvoid.size,
    totalLifestyleTips: aggregated.lifestyleTips.size,
    hasRecommendations:
      aggregated.recommendedFoods.size > 0 ||
      aggregated.foodsToAvoid.size > 0 ||
      aggregated.lifestyleTips.size > 0,
  };
}
