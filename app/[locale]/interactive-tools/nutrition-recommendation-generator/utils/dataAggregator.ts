/**
 * 数据聚合器 - 基于ziV1d3d的handleGenerate方法
 * 完全复用ziV1d3d的推荐聚合逻辑
 */

import type {
  ZIV1D3DData,
  ZIV1D3DRecommendation,
} from "../data/nutritionRecommendations";

// 基于ziV1d3d的聚合数据结构
export interface AggregatedRecommendations {
  recommendedFoods: Map<string, ZIV1D3DRecommendation>;
  foodsToAvoid: Map<string, ZIV1D3DRecommendation>;
  lifestyleTips: Map<string, ZIV1D3DRecommendation>;
}

// 基于ziV1d3d的handleGenerate方法逻辑
export function aggregateRecommendations(
  selections: {
    menstrualPhase: string | null;
    healthGoals: Set<string>;
    holisticHealthConstitution: Set<string>;
  },
  data: ZIV1D3DData,
): AggregatedRecommendations {
  // 构建所有选择项数组 - 完全基于ziV1d3d的逻辑
  const allSelections: Array<{ category: string; key: string }> = [];

  if (selections.menstrualPhase) {
    allSelections.push({
      category: "menstrualPhase",
      key: selections.menstrualPhase,
    });
  }

  selections.healthGoals.forEach((key) => {
    allSelections.push({ category: "healthGoals", key });
  });

  selections.holisticHealthConstitution.forEach((key) => {
    allSelections.push({ category: "holisticHealthConstitution", key });
  });

  // 初始化聚合器 - 基于ziV1d3d的aggregated结构
  const aggregated: AggregatedRecommendations = {
    recommendedFoods: new Map(),
    foodsToAvoid: new Map(),
    lifestyleTips: new Map(),
  };

  // 聚合所有选择的推荐 - 完全基于ziV1d3d的逻辑
  allSelections.forEach((sel) => {
    const item = data[sel.category as keyof ZIV1D3DData][sel.key];
    if (item && item.recommendations) {
      const recs = item.recommendations;

      // 使用ziV1d3d的键值策略：`${food.en}-${food.zh}`
      recs.recommendedFoods.forEach((food) => {
        aggregated.recommendedFoods.set(`${food.en}-${food.zh}`, food);
      });

      recs.foodsToAvoid.forEach((food) => {
        aggregated.foodsToAvoid.set(`${food.en}-${food.zh}`, food);
      });

      recs.lifestyleTips.forEach((tip) => {
        aggregated.lifestyleTips.set(`${tip.en}-${tip.zh}`, tip);
      });
    }
  });

  return aggregated;
}

// 基于ziV1d3d的displayResults方法的数据格式化
export function formatResultsForDisplay(
  aggregated: AggregatedRecommendations,
  language: "en" | "zh",
) {
  // 基于ziV1d3d的resultsData结构
  const resultsData = [
    {
      title: language === "zh" ? "推荐食物" : "Recommended Foods",
      items: Array.from(aggregated.recommendedFoods.values()),
      icon: "check-circle-2",
      color: "text-green-600",
      delay: "0s",
    },
    {
      title: language === "zh" ? "慎食/忌食" : "Foods to Avoid",
      items: Array.from(aggregated.foodsToAvoid.values()),
      icon: "x-circle",
      color: "text-red-600",
      delay: "0.1s",
    },
    {
      title: language === "zh" ? "生活与饮食贴士" : "Lifestyle & Dietary Tips",
      items: Array.from(aggregated.lifestyleTips.values()),
      icon: "sparkles",
      color: "text-blue-600",
      delay: "0.2s",
    },
  ];

  return resultsData.filter((data) => data.items.length > 0);
}

// 检查是否有选择 - 基于ziV1d3d的验证逻辑
export function hasValidSelections(selections: {
  menstrualPhase: string | null;
  healthGoals: Set<string>;
  holisticHealthConstitution: Set<string>;
}): boolean {
  return (
    selections.menstrualPhase !== null ||
    selections.healthGoals.size > 0 ||
    selections.holisticHealthConstitution.size > 0
  );
}

// 获取无选择时的消息 - 基于ziV1d3d的displayNoSelectionMessage
export function getNoSelectionMessage(language: "en" | "zh"): string {
  return language === "zh"
    ? "请至少选择一个选项以生成建议"
    : "Please make at least one selection to generate recommendations";
}
