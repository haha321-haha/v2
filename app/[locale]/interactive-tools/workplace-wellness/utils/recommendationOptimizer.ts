/**
 * 推荐系统优化器
 * 基于测试结果和用户反馈提供优化建议
 */

import {
  RecommendationResult,
  UserDataSnapshot,
} from "../types/recommendation";
import { RecommendationFeedbackHistory } from "../types";
import {
  analyzeRecommendationQuality,
  validateRecommendationReasonableness,
} from "./recommendationQualityAnalyzer";
import { analyzeFeedback } from "./feedbackAnalyzer";

export interface OptimizationSuggestion {
  priority: "high" | "medium" | "low";
  category: "algorithm" | "content" | "performance" | "ux";
  title: string;
  description: string;
  impact: string;
  effort: "low" | "medium" | "high";
  steps: string[];
}

export interface OptimizationReport {
  qualityScore: number;
  suggestions: OptimizationSuggestion[];
  priorityActions: OptimizationSuggestion[];
  quickWins: OptimizationSuggestion[];
}

/**
 * 生成优化建议
 */
export function generateOptimizationSuggestions(
  result: RecommendationResult,
  userData: UserDataSnapshot,
  feedbackHistory: RecommendationFeedbackHistory,
): OptimizationReport {
  const qualityAnalysis = analyzeRecommendationQuality(result, userData);
  const reasonableness = validateRecommendationReasonableness(result, userData);
  const feedbackAnalysis = analyzeFeedback(feedbackHistory);

  const suggestions: OptimizationSuggestion[] = [];

  // 基于质量分析的建议
  if (qualityAnalysis.metrics.relevance < 70) {
    suggestions.push({
      priority: "high",
      category: "algorithm",
      title: "提升推荐相关性",
      description: "推荐相关性较低，需要改进匹配算法",
      impact: "高 - 直接影响用户体验",
      effort: "medium",
      steps: [
        "检查推荐条件匹配逻辑",
        "优化条件匹配分数计算",
        "增加用户数据维度（如症状、周期阶段）",
        "调整相关性权重",
      ],
    });
  }

  if (qualityAnalysis.metrics.diversity < 60) {
    suggestions.push({
      priority: "medium",
      category: "algorithm",
      title: "增加推荐多样性",
      description: "推荐多样性不足，推荐过于单一",
      impact: "中 - 影响推荐覆盖范围",
      effort: "low",
      steps: [
        "增加多样性控制权重",
        "确保推荐覆盖多个分类和类型",
        "限制同一分类的推荐数量",
      ],
    });
  }

  if (qualityAnalysis.metrics.coverage < 50) {
    suggestions.push({
      priority: "medium",
      category: "content",
      title: "扩展推荐内容库",
      description: "推荐覆盖率较低，分类覆盖不足",
      impact: "中 - 影响推荐丰富度",
      effort: "high",
      steps: [
        "检查推荐内容库，确保各分类都有足够的推荐项",
        "添加更多推荐内容",
        "平衡各分类的推荐数量",
      ],
    });
  }

  // 基于合理性验证的建议
  reasonableness.issues.forEach((issue) => {
    if (issue.includes("高疼痛")) {
      suggestions.push({
        priority: "high",
        category: "algorithm",
        title: "优化高疼痛场景推荐",
        description: issue,
        impact: "高 - 影响用户体验和安全性",
        effort: "low",
        steps: [
          "检查疼痛缓解和医疗相关推荐的触发条件",
          "确保高疼痛等级时优先推荐医疗相关内容",
          "调整推荐优先级",
        ],
      });
    } else if (issue.includes("低效率")) {
      suggestions.push({
        priority: "medium",
        category: "algorithm",
        title: "优化低效率场景推荐",
        description: issue,
        impact: "中 - 影响工作场景推荐",
        effort: "low",
        steps: [
          "检查工作调整相关推荐的触发条件",
          "确保低效率时推荐工作调整内容",
        ],
      });
    }
  });

  // 基于反馈分析的建议
  if (feedbackAnalysis.clickRate < 20) {
    suggestions.push({
      priority: "high",
      category: "ux",
      title: "提升推荐点击率",
      description: "用户点击率较低，推荐内容可能不够吸引人",
      impact: "高 - 影响推荐系统效果",
      effort: "medium",
      steps: [
        "优化推荐标题和描述",
        "改进推荐理由的展示",
        "增加推荐预览信息",
        "A/B测试不同的推荐展示方式",
      ],
    });
  }

  if (feedbackAnalysis.dismissRate > 40) {
    suggestions.push({
      priority: "high",
      category: "algorithm",
      title: "降低推荐忽略率",
      description: "用户忽略率较高，推荐可能不够相关",
      impact: "高 - 影响用户满意度",
      effort: "medium",
      steps: [
        "分析被忽略的推荐特征",
        "调整推荐过滤条件",
        "改进推荐评分算法",
        "增加用户偏好学习",
      ],
    });
  }

  if (
    feedbackAnalysis.averageRating < 3 &&
    feedbackAnalysis.averageRating > 0
  ) {
    suggestions.push({
      priority: "high",
      category: "content",
      title: "提升推荐内容质量",
      description: "用户评分较低，推荐内容质量需要改进",
      impact: "高 - 影响用户信任",
      effort: "high",
      steps: [
        "审查推荐内容库",
        "更新过时的推荐内容",
        "确保推荐链接有效",
        "改进推荐描述质量",
      ],
    });
  }

  // 基于性能的建议
  if (result.recommendations.length > 10) {
    suggestions.push({
      priority: "low",
      category: "performance",
      title: "限制推荐数量",
      description: "推荐数量超过限制，应该进行截断",
      impact: "低 - 影响性能",
      effort: "low",
      steps: ["检查推荐数量限制逻辑", "确保推荐数量不超过10个"],
    });
  }

  // 分类建议
  const priorityActions = suggestions.filter((s) => s.priority === "high");
  const quickWins = suggestions.filter(
    (s) =>
      s.effort === "low" && (s.priority === "high" || s.priority === "medium"),
  );

  return {
    qualityScore: qualityAnalysis.metrics.overall,
    suggestions,
    priorityActions,
    quickWins,
  };
}

/**
 * 生成优化报告
 */
export function generateOptimizationReport(
  result: RecommendationResult,
  userData: UserDataSnapshot,
  feedbackHistory: RecommendationFeedbackHistory,
): string {
  const report = generateOptimizationSuggestions(
    result,
    userData,
    feedbackHistory,
  );
  const qualityAnalysis = analyzeRecommendationQuality(result, userData);

  let reportText = "=== 推荐系统优化报告 ===\n\n";
  reportText += `综合质量分数: ${report.qualityScore}/100\n\n`;

  reportText += "质量指标:\n";
  reportText += `  相关性: ${qualityAnalysis.metrics.relevance}/100\n`;
  reportText += `  多样性: ${qualityAnalysis.metrics.diversity}/100\n`;
  reportText += `  覆盖率: ${qualityAnalysis.metrics.coverage}/100\n`;
  reportText += `  新颖性: ${qualityAnalysis.metrics.novelty}/100\n\n`;

  if (report.priorityActions.length > 0) {
    reportText += "高优先级行动:\n";
    report.priorityActions.forEach((action, index) => {
      reportText += `  ${index + 1}. ${action.title}\n`;
      reportText += `     影响: ${action.impact}\n`;
      reportText += `     工作量: ${action.effort}\n`;
    });
    reportText += "\n";
  }

  if (report.quickWins.length > 0) {
    reportText += "快速改进:\n";
    report.quickWins.forEach((win, index) => {
      reportText += `  ${index + 1}. ${win.title}\n`;
    });
    reportText += "\n";
  }

  if (report.suggestions.length > 0) {
    reportText += "所有建议:\n";
    report.suggestions.forEach((suggestion, index) => {
      reportText += `  ${index + 1}. [${suggestion.priority.toUpperCase()}] ${
        suggestion.title
      }\n`;
      reportText += `     ${suggestion.description}\n`;
    });
  } else {
    reportText += "✅ 推荐系统运行良好，暂无优化建议\n";
  }

  return reportText;
}
