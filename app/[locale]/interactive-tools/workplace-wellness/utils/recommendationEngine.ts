/**
 * 推荐引擎
 *
 * 核心推荐生成逻辑，整合数据分析、评分和过滤
 */

import {
  RecommendationItem,
  RecommendationResult,
  UserDataSnapshot,
} from "../types/recommendation";
import {
  RecommendationFeedbackHistory,
  WorkImpactData,
  NutritionData,
} from "../types";
import { RECOMMENDATION_CONTENT } from "./recommendationContent";
import { createUserDataSnapshot, detectAnomalies } from "./dataAnalyzer";
import type { AnomalyDetection } from "../types/recommendation";
import {
  scoreRecommendations,
  calculateDiversityScore,
} from "./recommendationScorer";
import { PeriodRecord } from "../types";
import { logWarn } from "@/lib/debug-logger";

// 推荐配置
const RECOMMENDATION_CONFIG = {
  MAX_RECOMMENDATIONS: 10, // 最多推荐数量
  MIN_SCORE: 30, // 最低分数阈值
  DIVERSITY_THRESHOLD: 0.3, // 多样性阈值
  CACHE_DURATION: 5 * 60 * 1000, // 缓存时长（5分钟）
};

// 简单缓存 - 使用 Map 支持多个用户
const recommendationCache = new Map<
  string,
  {
    result: RecommendationResult;
    timestamp: number;
  }
>();

/**
 * 生成推荐
 */
export function generateRecommendations(
  periodData: PeriodRecord[],
  workImpactData: WorkImpactData,
  nutritionData: NutritionData,
  feedbackHistory: RecommendationFeedbackHistory,
): RecommendationResult {
  const startTime = performance.now();

  // 检查缓存
  const cacheKey = generateCacheKey(periodData, workImpactData);
  const cached = recommendationCache.get(cacheKey);
  if (
    cached &&
    Date.now() - cached.timestamp < RECOMMENDATION_CONFIG.CACHE_DURATION
  ) {
    return cached.result;
  }

  // 创建用户数据快照
  const userData = createUserDataSnapshot(
    periodData,
    workImpactData,
    nutritionData,
  );

  // 检测异常
  const anomaly = detectAnomalies(
    userData.workImpact.currentPainLevel,
    periodData
      .filter((r) => r.painLevel !== null && r.painLevel !== undefined)
      .map((r) => r.painLevel as number),
  );

  // 生成数据洞察
  const insights = generateInsights(userData, anomaly);

  // 过滤推荐项（基于条件匹配）
  let candidateItems = filterRecommendationsByConditions(
    RECOMMENDATION_CONTENT,
    userData,
  );

  // 过滤掉用户忽略的推荐
  candidateItems = candidateItems.filter(
    (item) => !feedbackHistory.ignoredItems.includes(item.id),
  );

  // 为推荐项评分
  candidateItems = scoreRecommendations(
    candidateItems,
    userData,
    feedbackHistory,
  );

  // 过滤低分推荐
  candidateItems = candidateItems.filter(
    (item) => item.score >= RECOMMENDATION_CONFIG.MIN_SCORE,
  );

  // 应用多样性控制
  const selectedItems = applyDiversityControl(candidateItems);

  // 排序（按分数降序）
  selectedItems.sort((a, b) => b.score - a.score);

  // 限制数量
  const finalRecommendations = selectedItems.slice(
    0,
    RECOMMENDATION_CONFIG.MAX_RECOMMENDATIONS,
  );

  // 生成推荐理由
  finalRecommendations.forEach((item) => {
    item.reason = generateRecommendationReason(item, userData);
  });

  // 生成统计摘要
  const summary = generateSummary(finalRecommendations);

  // 构建结果
  const result: RecommendationResult = {
    recommendations: finalRecommendations,
    insights,
    summary,
  };

  // 更新缓存
  recommendationCache.set(cacheKey, {
    result,
    timestamp: Date.now(),
  });

  // 清理过期缓存（保留最近10个）
  if (recommendationCache.size > 10) {
    const now = Date.now();
    const entries = Array.from(recommendationCache.entries());
    entries.forEach(([key, value]) => {
      if (now - value.timestamp > RECOMMENDATION_CONFIG.CACHE_DURATION) {
        recommendationCache.delete(key);
      }
    });
    // 如果还是太多，删除最旧的
    if (recommendationCache.size > 10) {
      const sorted = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      sorted.slice(0, recommendationCache.size - 10).forEach(([key]) => {
        recommendationCache.delete(key);
      });
    }
  }

  // 性能监控
  const endTime = performance.now();
  const duration = endTime - startTime;
  if (duration > 200) {
    logWarn(
      "Recommendation generation slow",
      { duration },
      "recommendationEngine",
    );
  }

  return result;
}

/**
 * 生成缓存键
 */
function generateCacheKey(
  periodData: PeriodRecord[],
  workImpactData: WorkImpactData,
): string {
  const periodHash = periodData.length.toString();
  const workHash = workImpactData?.painLevel?.toString() || "0";
  return `${periodHash}-${workHash}`;
}

/**
 * 根据条件过滤推荐项
 */
function filterRecommendationsByConditions(
  items: RecommendationItem[],
  userData: UserDataSnapshot,
): RecommendationItem[] {
  return items.filter((item) => {
    const conditions = item.conditions;

    // 疼痛等级检查
    if (
      conditions.minPainLevel !== undefined ||
      conditions.maxPainLevel !== undefined
    ) {
      const currentPain = userData.workImpact.currentPainLevel;
      const minPain = conditions.minPainLevel || 0;
      const maxPain = conditions.maxPainLevel || 10;

      if (currentPain < minPain || currentPain > maxPain) {
        return false;
      }
    }

    // 工作效率检查
    if (
      conditions.minEfficiency !== undefined ||
      conditions.maxEfficiency !== undefined
    ) {
      const currentEfficiency = userData.workImpact.currentEfficiency;
      const minEff = conditions.minEfficiency || 0;
      const maxEff = conditions.maxEfficiency || 100;

      if (currentEfficiency < minEff || currentEfficiency > maxEff) {
        return false;
      }
    }

    // 周期阶段检查
    if (conditions.requiredPhases && conditions.requiredPhases.length > 0) {
      if (
        !userData.periodData.currentPhase ||
        !conditions.requiredPhases.includes(userData.periodData.currentPhase)
      ) {
        return false;
      }
    }

    // 症状检查（简化处理）
    // 实际应该从用户数据中提取症状信息

    return true;
  });
}

/**
 * 应用多样性控制
 */
function applyDiversityControl(
  items: RecommendationItem[],
): RecommendationItem[] {
  const selected: RecommendationItem[] = [];
  const typeCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};

  for (const item of items) {
    // 计算多样性分数
    const diversityScore = calculateDiversityScore(item, selected);

    // 检查类型和分类数量
    const typeCount = typeCounts[item.type] || 0;
    const categoryCount = categoryCounts[item.category] || 0;

    // 如果多样性足够，或者类型/分类数量未超限，则添加
    if (
      diversityScore >= RECOMMENDATION_CONFIG.DIVERSITY_THRESHOLD ||
      typeCount < 3 ||
      categoryCount < 2
    ) {
      selected.push(item);
      typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }
  }

  return selected;
}

/**
 * 生成数据洞察
 */
function generateInsights(
  userData: UserDataSnapshot,
  anomaly: AnomalyDetection | null,
): RecommendationResult["insights"] {
  const hasCycleAnomaly = anomaly?.type === "cycle_irregularity";
  const cycleHealth = hasCycleAnomaly
    ? "needs_attention"
    : userData.periodData.cycleRegularity === "regular"
      ? "healthy"
      : userData.metadata.dataQuality === "poor"
        ? "needs_attention"
        : "irregular";

  return {
    painPattern: userData.periodData.painTrend,
    efficiencyPattern: userData.workImpact.efficiencyTrend,
    cycleHealth,
  };
}

/**
 * 生成推荐理由
 */
function generateRecommendationReason(
  item: RecommendationItem,
  userData: UserDataSnapshot,
): string {
  const reasons: string[] = [];

  // 疼痛相关
  const currentPain = userData.workImpact.currentPainLevel;
  if (currentPain >= 7) {
    reasons.push(`您当前疼痛等级较高(${currentPain}/10)`);
  } else if (currentPain >= 4) {
    reasons.push(`您当前疼痛等级为中等(${currentPain}/10)`);
  } else if (currentPain > 0) {
    reasons.push(`您的疼痛等级较低(${currentPain}/10)`);
  }

  // 趋势相关
  if (userData.periodData.painTrend === "increasing") {
    reasons.push("检测到疼痛呈上升趋势");
  } else if (userData.periodData.painTrend === "decreasing") {
    reasons.push("疼痛正在改善");
  }

  // 周期相关
  if (userData.periodData.currentPhase) {
    const phaseNames: Record<string, string> = {
      menstrual: "月经期",
      follicular: "卵泡期",
      ovulation: "排卵期",
      luteal: "黄体期",
    };
    reasons.push(`您正处于${phaseNames[userData.periodData.currentPhase]}`);
  }

  // 效率相关
  const currentEfficiency = userData.workImpact.currentEfficiency;
  if (currentEfficiency < 60) {
    reasons.push(`您的工作效率较低(${currentEfficiency}%)`);
  } else if (currentEfficiency < 80) {
    reasons.push(`您的工作效率为中等(${currentEfficiency}%)`);
  }

  // 周期健康相关
  if (userData.periodData.cycleRegularity === "irregular") {
    reasons.push("检测到周期不规律");
  } else {
    reasons.push("您的周期规律");
  }

  // 如果没有理由，使用默认理由
  if (reasons.length === 0) {
    return "基于您的数据模式，推荐此内容。";
  }

  return reasons.join("，") + "，因此推荐此内容。";
}

/**
 * 生成统计摘要
 */
function generateSummary(
  recommendations: RecommendationItem[],
): RecommendationResult["summary"] {
  const highPriorityCount = recommendations.filter(
    (r) => r.priority >= 80,
  ).length;
  const categories = [...new Set(recommendations.map((r) => r.category))];

  return {
    totalRecommendations: recommendations.length,
    highPriorityCount,
    categories,
  };
}

/**
 * 清除缓存
 */
export function clearRecommendationCache(key?: string): void {
  if (key) {
    recommendationCache.delete(key);
  } else {
    recommendationCache.clear();
  }
}

/**
 * 处理冷启动问题（数据不足时的推荐）
 */
export function generateColdStartRecommendations(
  feedbackHistory: RecommendationFeedbackHistory,
): RecommendationItem[] {
  // 返回通用推荐（高优先级、无特定条件）
  const generalRecommendations = RECOMMENDATION_CONTENT.filter(
    (item) =>
      item.priority >= 70 &&
      !item.conditions.minPainLevel &&
      !item.conditions.maxPainLevel &&
      !item.conditions.requiredPhases &&
      !feedbackHistory.ignoredItems.includes(item.id),
  );

  // 按优先级排序
  generalRecommendations.sort((a, b) => b.priority - a.priority);

  // 返回前5个
  return generalRecommendations.slice(0, 5);
}
