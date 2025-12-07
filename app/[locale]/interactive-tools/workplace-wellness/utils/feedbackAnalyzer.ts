/**
 * 用户反馈分析器
 * 用于分析用户反馈数据，优化推荐算法
 */

import { RecommendationFeedbackHistory } from "../types";
import { RecommendationItem } from "../types/recommendation";

export interface FeedbackAnalysis {
  totalFeedback: number;
  clickRate: number; // 点击率
  saveRate: number; // 收藏率
  dismissRate: number; // 忽略率
  averageRating: number; // 平均评分
  popularItems: Array<{ id: string; count: number }>;
  unpopularItems: Array<{ id: string; count: number }>;
  insights: string[];
}

/**
 * 分析用户反馈
 */
export function analyzeFeedback(
  feedbackHistory: RecommendationFeedbackHistory,
): FeedbackAnalysis {
  const totalFeedback = feedbackHistory.feedbacks.length;

  if (totalFeedback === 0) {
    return {
      totalFeedback: 0,
      clickRate: 0,
      saveRate: 0,
      dismissRate: 0,
      averageRating: 0,
      popularItems: [],
      unpopularItems: [],
      insights: ["暂无用户反馈数据"],
    };
  }

  // 统计各种操作
  const clicks = feedbackHistory.feedbacks.filter(
    (f) => f.action === "clicked",
  ).length;
  const saves = feedbackHistory.feedbacks.filter(
    (f) => f.action === "saved",
  ).length;
  const dismisses = feedbackHistory.feedbacks.filter(
    (f) => f.action === "dismissed",
  ).length;
  const ratings = feedbackHistory.feedbacks.filter(
    (f) => f.action === "rated" && f.rating,
  );

  // 计算比率
  const clickRate = (clicks / totalFeedback) * 100;
  const saveRate = (saves / totalFeedback) * 100;
  const dismissRate = (dismisses / totalFeedback) * 100;

  // 计算平均评分
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, f) => sum + (f.rating || 0), 0) / ratings.length
      : 0;

  // 统计热门和不受欢迎的推荐
  const itemCounts: Record<string, number> = {};
  feedbackHistory.feedbacks.forEach((f) => {
    itemCounts[f.recommendationId] = (itemCounts[f.recommendationId] || 0) + 1;
  });

  const popularItems = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({ id, count }));

  const unpopularItems = Object.entries(itemCounts)
    .filter(([id]) => feedbackHistory.ignoredItems.includes(id))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({ id, count }));

  // 生成洞察
  const insights: string[] = [];

  if (clickRate > 50) {
    insights.push("用户点击率较高，推荐内容吸引用户");
  } else if (clickRate < 20) {
    insights.push("用户点击率较低，建议改进推荐标题和描述");
  }

  if (saveRate > 30) {
    insights.push("用户收藏率较高，推荐内容有价值");
  }

  if (dismissRate > 40) {
    insights.push("用户忽略率较高，建议调整推荐策略");
  }

  if (averageRating >= 4) {
    insights.push("用户评分较高，推荐质量良好");
  } else if (averageRating < 3) {
    insights.push("用户评分较低，需要改进推荐质量");
  }

  if (popularItems.length > 0) {
    insights.push(
      `最受欢迎的推荐: ${popularItems[0].id} (${popularItems[0].count}次)`,
    );
  }

  return {
    totalFeedback,
    clickRate: Math.round(clickRate * 10) / 10,
    saveRate: Math.round(saveRate * 10) / 10,
    dismissRate: Math.round(dismissRate * 10) / 10,
    averageRating: Math.round(averageRating * 10) / 10,
    popularItems,
    unpopularItems,
    insights,
  };
}

/**
 * 根据反馈优化推荐分数
 */
export function optimizeRecommendationScore(
  item: RecommendationItem,
  feedbackHistory: RecommendationFeedbackHistory,
): number {
  let scoreAdjustment = 0;

  // 如果用户收藏过，增加分数
  if (feedbackHistory.savedItems.includes(item.id)) {
    scoreAdjustment += 20;
  }

  // 如果用户忽略过，降低分数
  if (feedbackHistory.ignoredItems.includes(item.id)) {
    scoreAdjustment -= 30;
  }

  // 根据评分调整
  const rating = feedbackHistory.itemRatings[item.id];
  if (rating) {
    scoreAdjustment += (rating - 3) * 10; // 3分为中性
  }

  // 根据点击次数调整
  const clickCount = feedbackHistory.feedbacks.filter(
    (f) => f.recommendationId === item.id && f.action === "clicked",
  ).length;
  scoreAdjustment += Math.min(clickCount * 5, 15); // 最多+15

  return Math.max(0, Math.min(100, item.score + scoreAdjustment));
}

/**
 * 生成反馈报告
 */
export function generateFeedbackReport(
  feedbackHistory: RecommendationFeedbackHistory,
): string {
  const analysis = analyzeFeedback(feedbackHistory);

  let report = "=== 用户反馈分析报告 ===\n\n";
  report += `总反馈数: ${analysis.totalFeedback}\n`;
  report += `点击率: ${analysis.clickRate}%\n`;
  report += `收藏率: ${analysis.saveRate}%\n`;
  report += `忽略率: ${analysis.dismissRate}%\n`;
  report += `平均评分: ${analysis.averageRating.toFixed(1)}/5\n\n`;

  if (analysis.popularItems.length > 0) {
    report += "热门推荐:\n";
    analysis.popularItems.forEach((item, index) => {
      report += `  ${index + 1}. ${item.id} (${item.count}次)\n`;
    });
    report += "\n";
  }

  if (analysis.insights.length > 0) {
    report += "洞察:\n";
    analysis.insights.forEach((insight) => {
      report += `  - ${insight}\n`;
    });
  }

  return report;
}
