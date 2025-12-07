/**
 * 食物性质兼容性检查工具
 * 根据整体健康理论，检查食物搭配的兼容性
 */

import { NutritionRecommendation, HolisticNature } from "../types";

// 注意：此文件中的函数需要接收 locale 参数，但翻译键需要通过调用方传入
// 因为工具函数不应该直接依赖 i18n hook

export interface CompatibilityResult {
  compatible: boolean;
  warnings: string[];
  suggestions: string[];
  conflicts: Array<{
    food1: string;
    food2: string;
    nature1: HolisticNature;
    nature2: HolisticNature;
  }>;
}

/**
 * 检查食物列表的兼容性
 */
export function checkFoodCompatibility(
  foods: NutritionRecommendation[],
  locale: string = "zh",
): CompatibilityResult {
  void locale;
  const warnings: string[] = [];
  const suggestions: string[] = [];
  const conflicts: CompatibilityResult["conflicts"] = [];

  if (foods.length === 0) {
    return {
      compatible: true,
      warnings: [],
      suggestions: [],
      conflicts: [],
    };
  }

  // 统计各性质的食物数量
  const natureCount: Record<HolisticNature, number> = {
    warm: 0,
    cool: 0,
    neutral: 0,
  };

  foods.forEach((food) => {
    natureCount[food.holisticNature] =
      (natureCount[food.holisticNature] || 0) + 1;
  });

  // 检查寒热冲突
  if (natureCount.warm > 0 && natureCount.cool > 0) {
    const warmFoods = foods.filter((f) => f.holisticNature === "warm");
    const coolFoods = foods.filter((f) => f.holisticNature === "cool");

    // 记录所有冲突对
    warmFoods.forEach((warmFood) => {
      coolFoods.forEach((coolFood) => {
        conflicts.push({
          food1: warmFood.name,
          food2: coolFood.name,
          nature1: "warm",
          nature2: "cool",
        });
      });
    });

    // 注意：这里返回模板字符串，由调用方使用翻译键替换
    // 格式：{key}，调用方需要传入翻译函数
    warnings.push(
      `nutrition.compatibility.conflictDetected|warmCount:${natureCount.warm}|coolCount:${natureCount.cool}`,
    );

    suggestions.push("nutrition.compatibility.suggestion");
  }

  // 如果中性食物较多，说明搭配较平衡
  if (natureCount.neutral >= foods.length / 2) {
    suggestions.push("nutrition.compatibility.balanced");
  }

  return {
    compatible: conflicts.length === 0,
    warnings,
    suggestions,
    conflicts,
  };
}

/**
 * 优化食物分配，避免寒热冲突
 */
export function optimizeFoodDistribution(
  foods: NutritionRecommendation[],
  meals: readonly string[] | string[] = [
    "breakfast",
    "lunch",
    "dinner",
    "snack",
  ],
): Record<string, NutritionRecommendation[]> {
  if (foods.length === 0) {
    return {};
  }

  // 按性质分组
  const warmFoods = foods.filter((f) => f.holisticNature === "warm");
  const coolFoods = foods.filter((f) => f.holisticNature === "cool");
  const neutralFoods = foods.filter((f) => f.holisticNature === "neutral");

  const result: Record<string, NutritionRecommendation[]> = {};

  // 优先将相同性质的食物分配到同一餐次
  meals.forEach((meal) => {
    result[meal] = [];
  });

  // 分配策略：
  // 1. 优先将中性食物均匀分配
  // 2. 将温性和凉性食物分开分配到不同餐次
  // 3. 如果可能，每餐次保持性质一致

  let warmIndex = 0;
  let coolIndex = 0;
  let neutralIndex = 0;

  meals.forEach((meal, index) => {
    // 每餐次优先添加1-2个中性食物作为基础
    if (neutralIndex < neutralFoods.length) {
      const neutralCount = Math.min(2, neutralFoods.length - neutralIndex);
      result[meal].push(
        ...neutralFoods.slice(neutralIndex, neutralIndex + neutralCount),
      );
      neutralIndex += neutralCount;
    }

    // 交替分配温性和凉性食物，避免同一餐次混合
    if (index % 2 === 0 && warmIndex < warmFoods.length) {
      result[meal].push(warmFoods[warmIndex]);
      warmIndex++;
    } else if (index % 2 === 1 && coolIndex < coolFoods.length) {
      result[meal].push(coolFoods[coolIndex]);
      coolIndex++;
    }
  });

  // 如果还有剩余食物，继续分配
  while (
    warmIndex < warmFoods.length ||
    coolIndex < coolFoods.length ||
    neutralIndex < neutralFoods.length
  ) {
    meals.forEach((meal) => {
      if (neutralIndex < neutralFoods.length) {
        result[meal].push(neutralFoods[neutralIndex]);
        neutralIndex++;
      } else if (
        warmIndex < warmFoods.length &&
        result[meal].every((f) => f.holisticNature !== "cool")
      ) {
        result[meal].push(warmFoods[warmIndex]);
        warmIndex++;
      } else if (
        coolIndex < coolFoods.length &&
        result[meal].every((f) => f.holisticNature !== "warm")
      ) {
        result[meal].push(coolFoods[coolIndex]);
        coolIndex++;
      }
    });
  }

  // 清理空餐次
  Object.keys(result).forEach((meal) => {
    if (result[meal].length === 0) {
      delete result[meal];
    }
  });

  return result;
}
