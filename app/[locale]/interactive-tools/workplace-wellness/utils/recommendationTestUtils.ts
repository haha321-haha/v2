/**
 * 推荐系统测试工具
 * 用于验证推荐系统的功能
 */

import { RecommendationResult } from "../types/recommendation";
import {
  FlowType,
  NutritionData,
  PainLevel,
  PeriodRecord,
  RecommendationFeedbackHistory,
  WorkImpactData,
} from "../types";
import { generateRecommendations } from "./recommendationEngine";
import { logError } from "@/lib/debug-logger";

/**
 * 创建测试数据
 */
const PAIN_LEVELS: PainLevel[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const FLOW_TYPES: FlowType[] = ["light", "medium", "heavy"];

export function createTestPeriodData(count: number = 10): PeriodRecord[] {
  const records: PeriodRecord[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i * 28); // 每28天一个周期

    records.push({
      date: date.toISOString().split("T")[0],
      type: "period",
      painLevel: PAIN_LEVELS[
        Math.floor(Math.random() * PAIN_LEVELS.length)
      ] as PainLevel,
      flow: FLOW_TYPES[
        Math.floor(Math.random() * FLOW_TYPES.length)
      ] as FlowType,
      notes: `Test record ${i + 1}`,
    });
  }

  return records;
}

/**
 * 创建测试工作影响数据
 */
export function createTestWorkImpactData(): WorkImpactData {
  return {
    painLevel: 5,
    efficiency: 75,
    selectedTemplateId: null,
  };
}

/**
 * 创建测试营养数据
 */
export function createTestNutritionData(): NutritionData {
  return {
    selectedPhase: "menstrual",
    constitutionType: "balanced",
    searchTerm: "",
  };
}

/**
 * 验证推荐结果
 */
export function validateRecommendationResult(result: RecommendationResult): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 验证推荐项数量
  if (result.recommendations.length === 0) {
    errors.push("推荐结果为空");
  }

  if (result.recommendations.length > 10) {
    errors.push(`推荐数量过多: ${result.recommendations.length} (最大10)`);
  }

  // 验证每个推荐项
  result.recommendations.forEach((item, index) => {
    if (!item.id) {
      errors.push(`推荐项 ${index} 缺少 ID`);
    }
    if (!item.title) {
      errors.push(`推荐项 ${index} 缺少标题`);
    }
    if (!item.description) {
      errors.push(`推荐项 ${index} 缺少描述`);
    }
    if (item.score < 0 || item.score > 100) {
      errors.push(`推荐项 ${index} 分数超出范围: ${item.score}`);
    }
    if (item.priority < 0 || item.priority > 100) {
      errors.push(`推荐项 ${index} 优先级超出范围: ${item.priority}`);
    }
  });

  // 验证洞察
  if (!result.insights) {
    errors.push("缺少数据洞察");
  } else {
    const validPainPatterns = [
      "increasing",
      "decreasing",
      "stable",
      "irregular",
    ];
    if (!validPainPatterns.includes(result.insights.painPattern)) {
      errors.push(`无效的疼痛模式: ${result.insights.painPattern}`);
    }
  }

  // 验证摘要
  if (!result.summary) {
    errors.push("缺少统计摘要");
  } else {
    if (result.summary.totalRecommendations !== result.recommendations.length) {
      errors.push("摘要中的推荐数量与实际不符");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 运行推荐系统测试
 */
function formatRecommendationTestError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function runRecommendationTests(): {
  passed: number;
  failed: number;
  results: Array<{ test: string; passed: boolean; error?: string }>;
} {
  const results: Array<{ test: string; passed: boolean; error?: string }> = [];

  // 测试1: 正常数据推荐生成
  try {
    const periodData = createTestPeriodData(10);
    const workImpact = createTestWorkImpactData();
    const nutrition = createTestNutritionData();
    const feedbackHistory: RecommendationFeedbackHistory = {
      feedbacks: [],
      ignoredItems: [],
      savedItems: [],
      itemRatings: {},
    };

    const result = generateRecommendations(
      periodData,
      workImpact,
      nutrition,
      feedbackHistory,
    );

    const validation = validateRecommendationResult(result);
    results.push({
      test: "正常数据推荐生成",
      passed: validation.valid,
      error: validation.errors.join(", "),
    });
  } catch (error: unknown) {
    results.push({
      test: "正常数据推荐生成",
      passed: false,
      error: formatRecommendationTestError(error),
    });
    logError("正常数据推荐生成失败", error, "recommendationTestUtils");
  }

  // 测试2: 冷启动（数据不足）
  try {
    const periodData = createTestPeriodData(2); // 少于3个
    const workImpact = createTestWorkImpactData();
    const nutrition = createTestNutritionData();
    const feedbackHistory: RecommendationFeedbackHistory = {
      feedbacks: [],
      ignoredItems: [],
      savedItems: [],
      itemRatings: {},
    };

    const result = generateRecommendations(
      periodData,
      workImpact,
      nutrition,
      feedbackHistory,
    );

    const validation = validateRecommendationResult(result);
    results.push({
      test: "冷启动推荐生成",
      passed: validation.valid,
      error: validation.errors.join(", "),
    });
  } catch (error: unknown) {
    results.push({
      test: "冷启动推荐生成",
      passed: false,
      error: formatRecommendationTestError(error),
    });
    logError("冷启动推荐生成失败", error, "recommendationTestUtils");
  }

  // 测试3: 空数据
  try {
    const periodData: PeriodRecord[] = [];
    const workImpact = createTestWorkImpactData();
    const nutrition = createTestNutritionData();
    const feedbackHistory: RecommendationFeedbackHistory = {
      feedbacks: [],
      ignoredItems: [],
      savedItems: [],
      itemRatings: {},
    };

    const result = generateRecommendations(
      periodData,
      workImpact,
      nutrition,
      feedbackHistory,
    );

    const validation = validateRecommendationResult(result);
    results.push({
      test: "空数据推荐生成",
      passed: validation.valid,
      error: validation.errors.join(", "),
    });
  } catch (error: unknown) {
    results.push({
      test: "空数据推荐生成",
      passed: false,
      error: formatRecommendationTestError(error),
    });
    logError("空数据推荐生成失败", error, "recommendationTestUtils");
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  return { passed, failed, results };
}
