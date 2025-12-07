/**
 * 推荐系统测试运行器
 * 用于在开发环境中测试推荐系统功能
 */

import { runRecommendationTests } from "./recommendationTestUtils";
import {
  generateRecommendations,
  generateColdStartRecommendations,
} from "./recommendationEngine";
import {
  createTestPeriodData,
  createTestWorkImpactData,
  createTestNutritionData,
} from "./recommendationTestUtils";
import { RecommendationFeedbackHistory } from "../types";
import { logError, logInfo } from "@/lib/debug-logger";

const formatErrorMessage = (error: unknown) =>
  typeof error === "string"
    ? error
    : error instanceof Error
      ? error.message
      : JSON.stringify(error);

/**
 * 运行完整的推荐系统测试套件
 */
export function runFullTestSuite() {
  logInfo("=".repeat(80));
  logInfo("🧪 推荐系统测试套件");
  logInfo("=".repeat(80));

  // 基础功能测试
  const basicTests = runRecommendationTests();

  logInfo("\n【基础功能测试】");
  logInfo("-".repeat(80));
  basicTests.results.forEach((result, index) => {
    const status = result.passed ? "✅" : "❌";
    logInfo(`${status} 测试 ${index + 1}: ${result.test}`);
    if (!result.passed && result.error) {
      logInfo(`   错误: ${result.error}`);
    }
  });
  logInfo(`\n通过: ${basicTests.passed} | 失败: ${basicTests.failed}`);

  // 推荐质量验证
  logInfo("\n【推荐质量验证】");
  logInfo("-".repeat(80));
  validateRecommendationQuality();

  // 性能测试
  logInfo("\n【性能测试】");
  logInfo("-".repeat(80));
  performanceTest();

  // 边界条件测试
  logInfo("\n【边界条件测试】");
  logInfo("-".repeat(80));
  edgeCaseTests();

  logInfo("\n" + "=".repeat(80));
  logInfo("✅ 测试完成");
  logInfo("=".repeat(80));
}

/**
 * 验证推荐质量
 */
function validateRecommendationQuality() {
  const periodData = createTestPeriodData(10);
  const workImpact = createTestWorkImpactData();
  const nutrition = createTestNutritionData();
  const feedbackHistory: RecommendationFeedbackHistory = {
    feedbacks: [],
    ignoredItems: [],
    savedItems: [],
    itemRatings: {},
  };

  // 测试1: 高疼痛等级应该推荐疼痛缓解内容
  workImpact.painLevel = 8;
  const highPainResult = generateRecommendations(
    periodData,
    workImpact,
    nutrition,
    feedbackHistory,
  );

  const painReliefCount = highPainResult.recommendations.filter(
    (r) => r.category === "pain-relief" || r.category === "medical",
  ).length;

  logInfo(`✅ 高疼痛等级推荐: ${painReliefCount} 个疼痛缓解/医疗相关推荐`);
  if (painReliefCount > 0) {
    logInfo("   ✓ 推荐质量: 良好");
  } else {
    logInfo("   ⚠️  推荐质量: 需要改进（应该推荐疼痛缓解内容）");
  }

  // 测试2: 低效率应该推荐工作调整内容
  workImpact.painLevel = 5;
  workImpact.efficiency = 50;
  const lowEfficiencyResult = generateRecommendations(
    periodData,
    workImpact,
    nutrition,
    feedbackHistory,
  );

  const workAdjustmentCount = lowEfficiencyResult.recommendations.filter(
    (r) => r.category === "work-adjustment",
  ).length;

  logInfo(`✅ 低效率推荐: ${workAdjustmentCount} 个工作调整相关推荐`);
  if (workAdjustmentCount > 0) {
    logInfo("   ✓ 推荐质量: 良好");
  } else {
    logInfo("   ⚠️  推荐质量: 需要改进（应该推荐工作调整内容）");
  }

  // 测试3: 推荐多样性
  const categories = new Set(
    highPainResult.recommendations.map((r) => r.category),
  );
  logInfo(`✅ 推荐多样性: ${categories.size} 个不同分类`);
  if (categories.size >= 3) {
    logInfo("   ✓ 推荐多样性: 良好");
  } else {
    logInfo("   ⚠️  推荐多样性: 需要改进（推荐过于单一）");
  }

  // 测试4: 推荐分数合理性
  const avgScore =
    highPainResult.recommendations.reduce((sum, r) => sum + r.score, 0) /
    highPainResult.recommendations.length;
  logInfo(`✅ 平均推荐分数: ${avgScore.toFixed(1)}`);
  if (avgScore >= 50) {
    logInfo("   ✓ 推荐分数: 合理");
  } else {
    logInfo("   ⚠️  推荐分数: 偏低（可能需要调整评分算法）");
  }
}

/**
 * 性能测试
 */
function performanceTest() {
  const periodData = createTestPeriodData(20);
  const workImpact = createTestWorkImpactData();
  const nutrition = createTestNutritionData();
  const feedbackHistory: RecommendationFeedbackHistory = {
    feedbacks: [],
    ignoredItems: [],
    savedItems: [],
    itemRatings: {},
  };

  // 测试推荐生成时间
  const iterations = 10;
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    generateRecommendations(periodData, workImpact, nutrition, feedbackHistory);
    const end = performance.now();
    times.push(end - start);
  }

  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  logInfo(`✅ 推荐生成时间 (${iterations}次平均):`);
  logInfo(`   平均: ${avgTime.toFixed(2)}ms`);
  logInfo(`   最快: ${minTime.toFixed(2)}ms`);
  logInfo(`   最慢: ${maxTime.toFixed(2)}ms`);

  if (avgTime < 200) {
    logInfo("   ✓ 性能: 优秀 (<200ms)");
  } else if (avgTime < 500) {
    logInfo("   ⚠️  性能: 可接受 (200-500ms)");
  } else {
    logInfo("   ❌ 性能: 需要优化 (>500ms)");
  }

  // 测试缓存效果
  const firstTime = times[0];
  const cachedTime = times[1];
  const cacheImprovement = ((firstTime - cachedTime) / firstTime) * 100;

  logInfo(`✅ 缓存效果: ${cacheImprovement.toFixed(1)}% 提升`);
  if (cacheImprovement > 50) {
    logInfo("   ✓ 缓存: 有效");
  } else {
    logInfo("   ⚠️  缓存: 效果不明显");
  }
}

/**
 * 边界条件测试
 */
function edgeCaseTests() {
  const feedbackHistory: RecommendationFeedbackHistory = {
    feedbacks: [],
    ignoredItems: [],
    savedItems: [],
    itemRatings: {},
  };

  // 测试1: 空数据
  try {
    const emptyResult = generateRecommendations(
      [],
      createTestWorkImpactData(),
      createTestNutritionData(),
      feedbackHistory,
    );
    logInfo(`✅ 空数据测试: ${emptyResult.recommendations.length} 个推荐`);
    if (emptyResult.recommendations.length > 0) {
      logInfo("   ✓ 冷启动处理: 正常");
    } else {
      logInfo("   ⚠️  冷启动处理: 未返回推荐");
    }
  } catch (error: unknown) {
    logError(`❌ 空数据测试: 错误 - ${formatErrorMessage(error)}`);
  }

  // 测试2: 极端疼痛等级
  try {
    const extremeWorkImpact = createTestWorkImpactData();
    extremeWorkImpact.painLevel = 10;
    extremeWorkImpact.efficiency = 20;

    const extremeResult = generateRecommendations(
      createTestPeriodData(5),
      extremeWorkImpact,
      createTestNutritionData(),
      feedbackHistory,
    );

    const urgentCount = extremeResult.recommendations.filter(
      (r) => r.priority >= 90,
    ).length;

    logInfo(`✅ 极端数据测试: ${urgentCount} 个高优先级推荐`);
    if (urgentCount > 0) {
      logInfo("   ✓ 极端情况处理: 正常");
    } else {
      logInfo("   ⚠️  极端情况处理: 应该推荐高优先级内容");
    }
  } catch (error: unknown) {
    logError(`❌ 极端数据测试: 错误 - ${formatErrorMessage(error)}`);
  }

  // 测试3: 大量数据
  try {
    const largeDataResult = generateRecommendations(
      createTestPeriodData(100),
      createTestWorkImpactData(),
      createTestNutritionData(),
      feedbackHistory,
    );

    logInfo(
      `✅ 大量数据测试: ${largeDataResult.recommendations.length} 个推荐`,
    );
    if (largeDataResult.recommendations.length <= 10) {
      logInfo("   ✓ 数据量处理: 正常（限制在10个以内）");
    } else {
      logInfo("   ⚠️  数据量处理: 推荐数量超出限制");
    }
  } catch (error: unknown) {
    logError(`❌ 大量数据测试: 错误 - ${formatErrorMessage(error)}`);
  }

  // 测试4: 冷启动推荐
  try {
    const coldStartItems = generateColdStartRecommendations(feedbackHistory);
    logInfo(`✅ 冷启动测试: ${coldStartItems.length} 个通用推荐`);
    if (coldStartItems.length > 0) {
      logInfo("   ✓ 冷启动处理: 正常");
    } else {
      logInfo("   ⚠️  冷启动处理: 未返回推荐");
    }
  } catch (error: unknown) {
    logError(`❌ 冷启动测试: 错误 - ${formatErrorMessage(error)}`);
  }
}

/**
 * 分析推荐结果并提供优化建议
 */
export function analyzeAndOptimize() {
  logInfo("\n" + "=".repeat(80));
  logInfo("📊 推荐系统分析报告");
  logInfo("=".repeat(80));

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

  // 分析推荐分布
  logInfo("\n【推荐分布分析】");
  logInfo("-".repeat(80));

  const typeDistribution: Record<string, number> = {};
  const categoryDistribution: Record<string, number> = {};

  result.recommendations.forEach((item) => {
    typeDistribution[item.type] = (typeDistribution[item.type] || 0) + 1;
    categoryDistribution[item.category] =
      (categoryDistribution[item.category] || 0) + 1;
  });

  logInfo("类型分布:");
  Object.entries(typeDistribution).forEach(([type, count]) => {
    logInfo(`  ${type}: ${count} 个`);
  });

  logInfo("\n分类分布:");
  Object.entries(categoryDistribution).forEach(([category, count]) => {
    logInfo(`  ${category}: ${count} 个`);
  });

  // 分析推荐分数
  logInfo("\n【推荐分数分析】");
  logInfo("-".repeat(80));

  const scores = result.recommendations
    .map((r) => r.score)
    .sort((a, b) => b - a);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const medianScore = scores[Math.floor(scores.length / 2)];

  logInfo(`平均分数: ${avgScore.toFixed(1)}`);
  logInfo(`中位数分数: ${medianScore.toFixed(1)}`);
  logInfo(`最高分数: ${scores[0].toFixed(1)}`);
  logInfo(`最低分数: ${scores[scores.length - 1].toFixed(1)}`);

  // 优化建议
  logInfo("\n【优化建议】");
  logInfo("-".repeat(80));

  const suggestions: string[] = [];

  // 检查推荐多样性
  if (Object.keys(categoryDistribution).length < 3) {
    suggestions.push("⚠️  推荐多样性不足，建议增加多样性控制权重");
  }

  // 检查分数分布
  if (scores[0] - scores[scores.length - 1] < 20) {
    suggestions.push("⚠️  推荐分数差异较小，建议调整评分算法以增加区分度");
  }

  // 检查高优先级推荐
  const highPriorityCount = result.recommendations.filter(
    (r) => r.priority >= 80,
  ).length;
  if (highPriorityCount === 0) {
    suggestions.push("⚠️  缺少高优先级推荐，建议检查推荐内容库的优先级设置");
  }

  if (suggestions.length === 0) {
    logInfo("✅ 推荐系统运行良好，暂无优化建议");
  } else {
    suggestions.forEach((suggestion) => {
      logInfo(suggestion);
    });
  }
}

// 如果直接运行此文件，执行测试
if (typeof window === "undefined" && typeof process !== "undefined") {
  // Node.js 环境
  runFullTestSuite();
  analyzeAndOptimize();
}
