/**
 * 推荐质量分析器
 * 用于分析推荐系统的推荐质量
 */

import {
  RecommendationResult,
  UserDataSnapshot,
} from "../types/recommendation";

export interface QualityMetrics {
  relevance: number; // 相关性 (0-100)
  diversity: number; // 多样性 (0-100)
  coverage: number; // 覆盖率 (0-100)
  novelty: number; // 新颖性 (0-100)
  overall: number; // 综合质量 (0-100)
}

export interface QualityAnalysis {
  metrics: QualityMetrics;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

/**
 * 分析推荐质量
 */
export function analyzeRecommendationQuality(
  result: RecommendationResult,
  userData: UserDataSnapshot,
): QualityAnalysis {
  void userData;
  const metrics: QualityMetrics = {
    relevance: calculateRelevance(result),
    diversity: calculateDiversity(result),
    coverage: calculateCoverage(result),
    novelty: calculateNovelty(result),
    overall: 0,
  };

  // 计算综合质量（加权平均）
  metrics.overall = Math.round(
    metrics.relevance * 0.4 +
      metrics.diversity * 0.2 +
      metrics.coverage * 0.2 +
      metrics.novelty * 0.2,
  );

  // 分析优势和劣势
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  // 相关性分析
  if (metrics.relevance >= 80) {
    strengths.push("推荐相关性高，与用户数据匹配良好");
  } else if (metrics.relevance < 60) {
    weaknesses.push("推荐相关性较低，需要改进匹配算法");
    recommendations.push("检查推荐条件匹配逻辑，确保推荐与用户状态相关");
  }

  // 多样性分析
  if (metrics.diversity >= 70) {
    strengths.push("推荐具有良好的多样性");
  } else if (metrics.diversity < 50) {
    weaknesses.push("推荐多样性不足，推荐过于单一");
    recommendations.push("增加多样性控制权重，确保推荐覆盖多个分类和类型");
  }

  // 覆盖率分析
  if (metrics.coverage >= 60) {
    strengths.push("推荐覆盖了多个分类");
  } else if (metrics.coverage < 40) {
    weaknesses.push("推荐覆盖率较低，分类覆盖不足");
    recommendations.push("检查推荐内容库，确保各分类都有足够的推荐项");
  }

  // 新颖性分析
  if (metrics.novelty >= 60) {
    strengths.push("推荐具有较好的新颖性");
  } else if (metrics.novelty < 40) {
    weaknesses.push("推荐新颖性不足，可能重复推荐相同内容");
    recommendations.push("增加时间衰减算法，降低已推荐内容的权重");
  }

  // 推荐数量分析
  if (result.recommendations.length < 5) {
    weaknesses.push("推荐数量较少，可能无法满足用户需求");
    recommendations.push("考虑增加推荐数量或降低最低分数阈值");
  } else if (result.recommendations.length >= 8) {
    strengths.push("推荐数量充足");
  }

  // 高优先级推荐分析
  const highPriorityCount = result.recommendations.filter(
    (r) => r.priority >= 80,
  ).length;
  if (highPriorityCount === 0) {
    weaknesses.push("缺少高优先级推荐");
    recommendations.push("检查推荐内容库，确保有足够的高优先级推荐项");
  } else if (highPriorityCount >= 3) {
    strengths.push("包含多个高优先级推荐");
  }

  return {
    metrics,
    strengths,
    weaknesses,
    recommendations,
  };
}

/**
 * 计算相关性
 */
function calculateRelevance(result: RecommendationResult): number {
  if (result.recommendations.length === 0) return 0;

  let relevanceSum = 0;
  result.recommendations.forEach((item) => {
    // 基于推荐分数计算相关性
    relevanceSum += item.score;
  });

  return Math.round(relevanceSum / result.recommendations.length);
}

/**
 * 计算多样性
 */
function calculateDiversity(result: RecommendationResult): number {
  if (result.recommendations.length === 0) return 0;

  const categories = new Set(result.recommendations.map((r) => r.category));
  const types = new Set(result.recommendations.map((r) => r.type));

  // 多样性 = (分类数 + 类型数) / (总推荐数 * 2) * 100
  const categoryDiversity =
    (categories.size / result.recommendations.length) * 100;
  const typeDiversity = (types.size / result.recommendations.length) * 100;

  return Math.round((categoryDiversity + typeDiversity) / 2);
}

/**
 * 计算覆盖率
 */
function calculateCoverage(result: RecommendationResult): number {
  // 理想情况下应该覆盖所有主要分类
  const mainCategories = [
    "pain-relief",
    "medical",
    "work-adjustment",
    "tracking",
    "nutrition",
  ];

  const coveredCategories = new Set(
    result.recommendations.map((r) => r.category),
  );
  const coverage = (coveredCategories.size / mainCategories.length) * 100;

  return Math.min(100, Math.round(coverage));
}

/**
 * 计算新颖性
 */
function calculateNovelty(result: RecommendationResult): number {
  // 简化处理：基于推荐项的多样性来评估新颖性
  // 实际应该考虑用户历史推荐记录
  const uniqueItems = new Set(result.recommendations.map((r) => r.id));
  const novelty = (uniqueItems.size / result.recommendations.length) * 100;

  return Math.round(novelty);
}

/**
 * 验证推荐合理性
 */
export function validateRecommendationReasonableness(
  result: RecommendationResult,
  userData: UserDataSnapshot,
): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // 检查高疼痛时是否推荐了疼痛缓解内容
  if (userData.workImpact.currentPainLevel >= 7) {
    const hasPainRelief = result.recommendations.some(
      (r) => r.category === "pain-relief" || r.category === "medical",
    );
    if (!hasPainRelief) {
      issues.push("高疼痛等级时应该推荐疼痛缓解或医疗相关内容");
    }
  }

  // 检查低效率时是否推荐了工作调整内容
  if (userData.workImpact.currentEfficiency < 60) {
    const hasWorkAdjustment = result.recommendations.some(
      (r) => r.category === "work-adjustment",
    );
    if (!hasWorkAdjustment) {
      issues.push("低工作效率时应该推荐工作调整相关内容");
    }
  }

  // 检查推荐分数是否合理
  const lowScoreCount = result.recommendations.filter(
    (r) => r.score < 30,
  ).length;
  if (lowScoreCount > 0) {
    issues.push(`有 ${lowScoreCount} 个推荐分数过低（<30），建议过滤`);
  }

  // 检查推荐数量
  if (result.recommendations.length === 0) {
    issues.push("推荐结果为空，应该至少返回一些通用推荐");
  } else if (result.recommendations.length > 10) {
    issues.push("推荐数量超过限制（10个），应该进行截断");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
