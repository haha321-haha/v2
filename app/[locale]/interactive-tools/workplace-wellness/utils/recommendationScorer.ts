/**
 * 推荐评分器
 *
 * 负责为推荐项计算相关性分数和综合分数
 */

import {
  RecommendationItem,
  RecommendationConditions,
  UserDataSnapshot,
} from "../types/recommendation";
import { RecommendationFeedbackHistory } from "../types";

// 评分权重配置
const SCORING_WEIGHTS = {
  conditionMatch: 0.4, // 条件匹配权重
  priority: 0.2, // 优先级权重
  userPreference: 0.2, // 用户偏好权重
  recency: 0.1, // 时效性权重
  diversity: 0.1, // 多样性权重
};

/**
 * 计算推荐项的相关性分数
 */
export function calculateRelevanceScore(
  item: RecommendationItem,
  userData: UserDataSnapshot,
): number {
  let score = 0;
  let weightSum = 0;

  // 1. 条件匹配分数 (40%)
  const conditionScore = calculateConditionMatchScore(
    item.conditions,
    userData,
  );
  score += conditionScore * SCORING_WEIGHTS.conditionMatch;
  weightSum += SCORING_WEIGHTS.conditionMatch;

  // 2. 优先级分数 (20%)
  const priorityScore = item.priority / 100;
  score += priorityScore * SCORING_WEIGHTS.priority;
  weightSum += SCORING_WEIGHTS.priority;

  // 3. 用户偏好分数 (20%) - 基于反馈历史
  const preferenceScore = 0.5; // 默认中等偏好，实际应从反馈历史计算
  score += preferenceScore * SCORING_WEIGHTS.userPreference;
  weightSum += SCORING_WEIGHTS.userPreference;

  // 4. 时效性分数 (10%) - 基于数据新鲜度
  const recencyScore = calculateRecencyScore(userData);
  score += recencyScore * SCORING_WEIGHTS.recency;
  weightSum += SCORING_WEIGHTS.recency;

  // 归一化分数
  return weightSum > 0 ? (score / weightSum) * 100 : 0;
}

/**
 * 计算条件匹配分数
 */
function calculateConditionMatchScore(
  conditions: RecommendationConditions,
  userData: UserDataSnapshot,
): number {
  let matchScore = 0;
  let conditionCount = 0;

  // 疼痛等级匹配
  if (
    conditions.minPainLevel !== undefined ||
    conditions.maxPainLevel !== undefined
  ) {
    conditionCount++;
    const currentPain = userData.workImpact.currentPainLevel;
    const minPain = conditions.minPainLevel || 0;
    const maxPain = conditions.maxPainLevel || 10;

    if (currentPain >= minPain && currentPain <= maxPain) {
      matchScore += 1.0;
    } else {
      // 部分匹配：接近范围
      const distance = Math.min(
        Math.abs(currentPain - minPain),
        Math.abs(currentPain - maxPain),
      );
      matchScore += Math.max(0, 1 - distance / 5); // 距离越近分数越高
    }
  }

  // 工作效率匹配
  if (
    conditions.minEfficiency !== undefined ||
    conditions.maxEfficiency !== undefined
  ) {
    conditionCount++;
    const currentEfficiency = userData.workImpact.currentEfficiency;
    const minEff = conditions.minEfficiency || 0;
    const maxEff = conditions.maxEfficiency || 100;

    if (currentEfficiency >= minEff && currentEfficiency <= maxEff) {
      matchScore += 1.0;
    } else {
      const distance = Math.min(
        Math.abs(currentEfficiency - minEff),
        Math.abs(currentEfficiency - maxEff),
      );
      matchScore += Math.max(0, 1 - distance / 20); // 距离越近分数越高
    }
  }

  // 周期阶段匹配
  if (conditions.requiredPhases && conditions.requiredPhases.length > 0) {
    conditionCount++;
    if (
      userData.periodData.currentPhase &&
      conditions.requiredPhases.includes(userData.periodData.currentPhase)
    ) {
      matchScore += 1.0;
    } else {
      matchScore += 0.3; // 部分匹配
    }
  }

  // 症状匹配
  if (conditions.requiredSymptoms && conditions.requiredSymptoms.length > 0) {
    conditionCount++;
    // 这里需要从用户数据中提取症状信息
    // 简化处理：假设部分匹配
    matchScore += 0.5;
  }

  // 如果没有条件，给中等分数
  if (conditionCount === 0) {
    return 0.5;
  }

  return matchScore / conditionCount;
}

/**
 * 计算时效性分数
 */
function calculateRecencyScore(userData: UserDataSnapshot): number {
  const lastUpdate = userData.metadata.lastUpdate;
  const daysSinceUpdate = Math.floor(
    (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // 数据越新鲜，分数越高
  if (daysSinceUpdate <= 1) return 1.0;
  if (daysSinceUpdate <= 3) return 0.8;
  if (daysSinceUpdate <= 7) return 0.6;
  if (daysSinceUpdate <= 14) return 0.4;
  return 0.2;
}

/**
 * 计算用户偏好分数（基于反馈历史）
 */
export function calculateUserPreferenceScore(
  item: RecommendationItem,
  feedbackHistory: RecommendationFeedbackHistory,
): number {
  let score = 50; // 基础分数

  // 如果用户忽略过，大幅降低分数
  if (feedbackHistory.ignoredItems.includes(item.id)) {
    score -= 30;
  }

  // 如果用户收藏过，增加分数
  if (feedbackHistory.savedItems.includes(item.id)) {
    score += 20;
  }

  // 如果用户给过评分，使用评分
  const rating = feedbackHistory.itemRatings[item.id];
  if (rating) {
    score += (rating - 3) * 10; // 3分为中性，每分±10
  }

  // 如果用户点击过同类型推荐，小幅增加
  const similarClicked = feedbackHistory.feedbacks.filter(
    (f) =>
      f.action === "clicked" && f.recommendationId.startsWith(item.category),
  ).length;
  score += Math.min(similarClicked * 5, 20); // 最多+20

  return Math.max(0, Math.min(100, score));
}

/**
 * 计算综合分数
 */
export function calculateFinalScore(
  item: RecommendationItem,
  userData: UserDataSnapshot,
  feedbackHistory: RecommendationFeedbackHistory,
): number {
  // 相关性分数
  const relevanceScore = calculateRelevanceScore(item, userData);

  // 用户偏好分数
  const preferenceScore = calculateUserPreferenceScore(item, feedbackHistory);

  // 综合分数 = 相关性 * 0.7 + 用户偏好 * 0.3
  const finalScore = relevanceScore * 0.7 + preferenceScore * 0.3;

  return Math.round(finalScore * 10) / 10; // 保留一位小数
}

/**
 * 应用时间衰减算法
 * 降低旧内容的权重
 */
export function applyTimeDecay(
  item: RecommendationItem,
  daysSinceCreation: number,
): number {
  // 使用指数衰减：e^(-λt)
  const decayRate = 0.1; // 衰减率
  const decayFactor = Math.exp(-decayRate * daysSinceCreation);

  return item.score * decayFactor;
}

/**
 * 计算多样性分数
 * 确保推荐列表的多样性
 */
export function calculateDiversityScore(
  item: RecommendationItem,
  existingRecommendations: RecommendationItem[],
): number {
  if (existingRecommendations.length === 0) return 1.0;

  // 检查是否已有相同类型
  const sameTypeCount = existingRecommendations.filter(
    (r) => r.type === item.type,
  ).length;

  // 检查是否已有相同分类
  const sameCategoryCount = existingRecommendations.filter(
    (r) => r.category === item.category,
  ).length;

  // 多样性分数：类型和分类越少，分数越高
  const typeDiversity =
    1 - (sameTypeCount / existingRecommendations.length) * 0.5;
  const categoryDiversity =
    1 - (sameCategoryCount / existingRecommendations.length) * 0.5;

  return (typeDiversity + categoryDiversity) / 2;
}

/**
 * 为推荐项列表计算并更新分数
 */
export function scoreRecommendations(
  items: RecommendationItem[],
  userData: UserDataSnapshot,
  feedbackHistory: RecommendationFeedbackHistory,
): RecommendationItem[] {
  return items.map((item) => {
    // 计算相关性
    const relevance = calculateRelevanceScore(item, userData);

    // 计算综合分数
    const score = calculateFinalScore(item, userData, feedbackHistory);

    return {
      ...item,
      relevance: Math.round(relevance * 10) / 10,
      score: Math.round(score * 10) / 10,
    };
  });
}
