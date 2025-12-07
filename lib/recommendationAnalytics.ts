/**
 * 推荐效果监控和分析系统
 * 用于追踪推荐点击、展示和效果分析
 */

import { logInfo } from "@/lib/debug-logger";

export interface RecommendationMetrics {
  articleSlug: string;
  recommendedArticles: string[];
  clickedArticle?: string;
  timestamp: number;
  locale: string;
  userAgent?: string;
}

export interface RecommendationDisplayMetrics {
  articleSlug: string;
  recommendedArticles: string[];
  timestamp: number;
  locale: string;
}

export interface RecommendationStats {
  totalDisplays: number;
  totalClicks: number;
  clickThroughRate: number;
  topRecommendedArticles: Array<{ slug: string; count: number }>;
  topClickedArticles: Array<{ slug: string; count: number }>;
}

// 内存存储（生产环境应使用数据库）
const clickMetrics: RecommendationMetrics[] = [];
const displayMetrics: RecommendationDisplayMetrics[] = [];

// 配置
const MAX_METRICS_SIZE = 10000; // 最大存储条目数

/**
 * 追踪推荐展示
 */
export function trackRecommendationDisplay(
  currentArticle: string,
  recommendedArticles: string[],
  locale: string,
): void {
  const metrics: RecommendationDisplayMetrics = {
    articleSlug: currentArticle,
    recommendedArticles,
    timestamp: Date.now(),
    locale,
  };

  displayMetrics.push(metrics);

  // 限制存储大小
  if (displayMetrics.length > MAX_METRICS_SIZE) {
    displayMetrics.shift();
  }

  logInfo(
    "[RecommendationAnalytics] Display tracked",
    {
      article: currentArticle,
      recommended: recommendedArticles.length,
    },
    "recommendationAnalytics/trackRecommendationDisplay",
  );
}

/**
 * 追踪推荐点击
 */
export function trackRecommendationClick(
  currentArticle: string,
  recommendedArticles: string[],
  clickedArticle: string,
  locale: string,
  userAgent?: string,
): void {
  const metrics: RecommendationMetrics = {
    articleSlug: currentArticle,
    recommendedArticles,
    clickedArticle,
    timestamp: Date.now(),
    locale,
    userAgent,
  };

  clickMetrics.push(metrics);

  // 限制存储大小
  if (clickMetrics.length > MAX_METRICS_SIZE) {
    clickMetrics.shift();
  }

  logInfo(
    "[RecommendationAnalytics] Click tracked",
    {
      from: currentArticle,
      to: clickedArticle,
    },
    "recommendationAnalytics/trackRecommendationClick",
  );

  // 可以在这里发送到外部分析系统
  // sendToAnalytics(metrics);
}

/**
 * 获取推荐统计数据
 */
export function getRecommendationStats(timeRange?: {
  start: number;
  end: number;
}): RecommendationStats {
  // 过滤时间范围
  const filteredClicks = timeRange
    ? clickMetrics.filter(
        (m) => m.timestamp >= timeRange.start && m.timestamp <= timeRange.end,
      )
    : clickMetrics;

  const filteredDisplays = timeRange
    ? displayMetrics.filter(
        (m) => m.timestamp >= timeRange.start && m.timestamp <= timeRange.end,
      )
    : displayMetrics;

  // 计算点击率
  const totalDisplays = filteredDisplays.length;
  const totalClicks = filteredClicks.length;
  const clickThroughRate =
    totalDisplays > 0 ? (totalClicks / totalDisplays) * 100 : 0;

  // 统计最常被推荐的文章
  const recommendedCount = new Map<string, number>();
  filteredDisplays.forEach((display) => {
    display.recommendedArticles.forEach((slug) => {
      recommendedCount.set(slug, (recommendedCount.get(slug) || 0) + 1);
    });
  });

  // 统计最常被点击的文章
  const clickedCount = new Map<string, number>();
  filteredClicks.forEach((click) => {
    if (click.clickedArticle) {
      clickedCount.set(
        click.clickedArticle,
        (clickedCount.get(click.clickedArticle) || 0) + 1,
      );
    }
  });

  // 转换为数组并排序
  const topRecommendedArticles = Array.from(recommendedCount.entries())
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topClickedArticles = Array.from(clickedCount.entries())
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalDisplays,
    totalClicks,
    clickThroughRate,
    topRecommendedArticles,
    topClickedArticles,
  };
}

/**
 * 获取特定文章的推荐效果
 */
export function getArticleRecommendationStats(articleSlug: string): {
  timesRecommended: number;
  timesClicked: number;
  clickThroughRate: number;
} {
  // 统计被推荐次数
  const timesRecommended = displayMetrics.filter((display) =>
    display.recommendedArticles.includes(articleSlug),
  ).length;

  // 统计被点击次数
  const timesClicked = clickMetrics.filter(
    (click) => click.clickedArticle === articleSlug,
  ).length;

  // 计算点击率
  const clickThroughRate =
    timesRecommended > 0 ? (timesClicked / timesRecommended) * 100 : 0;

  return {
    timesRecommended,
    timesClicked,
    clickThroughRate,
  };
}

/**
 * 导出数据（用于分析）
 */
export function exportMetrics(): {
  clicks: RecommendationMetrics[];
  displays: RecommendationDisplayMetrics[];
} {
  return {
    clicks: [...clickMetrics],
    displays: [...displayMetrics],
  };
}

/**
 * 清空所有指标
 */
export function clearMetrics(): void {
  clickMetrics.length = 0;
  displayMetrics.length = 0;
  logInfo(
    "[RecommendationAnalytics] All metrics cleared",
    undefined,
    "recommendationAnalytics/clearMetrics",
  );
}
