/**
 * AEO Tracking System
 * AEO 追踪系统
 *
 * 追踪 AI 搜索引擎的引用情况
 * 监控 Perplexity, ChatGPT, Claude 等 AI 工具的引用数据
 */

/**
 * AI 引用追踪接口
 */
export interface AIReference {
  /** 引用来源（Perplexity, ChatGPT, Claude 等） */
  source: string;
  /** 引用时间 */
  timestamp: string;
  /** 引用的页面 URL */
  pageUrl: string;
  /** 引用的内容片段 */
  contentSnippet: string;
  /** 引用准确性评分（0-100） */
  accuracyScore?: number;
  /** 是否包含来源链接 */
  includesSourceLink: boolean;
  /** 用户查询 */
  userQuery?: string;
}

/**
 * AEO 指标接口
 */
export interface AEOMetrics {
  /** 总引用次数 */
  totalReferences: number;
  /** 按来源分组的引用次数 */
  referencesBySource: Record<string, number>;
  /** 按页面分组的引用次数 */
  referencesByPage: Record<string, number>;
  /** 平均准确性评分 */
  averageAccuracyScore: number;
  /** 包含来源链接的引用百分比 */
  sourceLinkPercentage: number;
  /** 最近 30 天的引用趋势 */
  recentTrend: Array<{
    date: string;
    count: number;
  }>;
}

/**
 * 存储 AI 引用数据（实际应用中应使用数据库）
 */
const aiReferences: AIReference[] = [];

/**
 * 记录 AI 引用
 *
 * @param reference AI 引用数据
 */
export async function trackAIReference(reference: AIReference): Promise<void> {
  const timestamp = reference.timestamp || new Date().toISOString();

  // 添加到内存存储（用于向后兼容）
  aiReferences.push({
    ...reference,
    timestamp,
  });

  // 尝试保存到数据库（如果配置了数据库）
  try {
    const { saveAIReference } = await import("@/lib/db/aeo-repository");
    await saveAIReference({
      ...reference,
      timestamp,
    });
  } catch {
    // 数据库未配置或保存失败，继续使用内存存储
    // 这在开发环境中是正常的
    if (process.env.NODE_ENV === "development") {
      console.log(
        "[AEO Tracking] Using in-memory storage (database not configured)",
      );
    }
  }
}

/**
 * 获取 AEO 指标
 *
 * @param days 统计天数（默认 30 天）
 * @returns AEO 指标
 */
export async function getAEOMetrics(days: number = 30): Promise<AEOMetrics> {
  // 尝试从数据库获取指标（如果配置了数据库）
  try {
    const { getAEOMetricsFromDB } = await import("@/lib/db/aeo-repository");
    const dbMetrics = await getAEOMetricsFromDB(days);

    // 如果数据库有数据，优先使用数据库数据
    if (dbMetrics.totalReferences > 0) {
      return dbMetrics;
    }
  } catch {
    // 数据库未配置或查询失败，继续使用内存存储
    if (process.env.NODE_ENV === "development") {
      console.log(
        "[AEO Metrics] Using in-memory storage (database not configured)",
      );
    }
  }

  // 使用内存存储（向后兼容）
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentReferences = aiReferences.filter(
    (ref) => new Date(ref.timestamp) >= cutoffDate,
  );

  // 按来源分组
  const referencesBySource: Record<string, number> = {};
  recentReferences.forEach((ref) => {
    referencesBySource[ref.source] = (referencesBySource[ref.source] || 0) + 1;
  });

  // 按页面分组
  const referencesByPage: Record<string, number> = {};
  recentReferences.forEach((ref) => {
    referencesByPage[ref.pageUrl] = (referencesByPage[ref.pageUrl] || 0) + 1;
  });

  // 计算平均准确性评分
  const scoresWithValue = recentReferences.filter(
    (ref) => ref.accuracyScore !== undefined,
  );
  const averageAccuracyScore =
    scoresWithValue.length > 0
      ? scoresWithValue.reduce(
          (sum, ref) => sum + (ref.accuracyScore || 0),
          0,
        ) / scoresWithValue.length
      : 0;

  // 计算包含来源链接的百分比
  const withSourceLink = recentReferences.filter(
    (ref) => ref.includesSourceLink,
  ).length;
  const sourceLinkPercentage =
    recentReferences.length > 0
      ? (withSourceLink / recentReferences.length) * 100
      : 0;

  // 计算最近趋势（按日期分组）
  const trendMap = new Map<string, number>();
  recentReferences.forEach((ref) => {
    const date = ref.timestamp.split("T")[0];
    trendMap.set(date, (trendMap.get(date) || 0) + 1);
  });

  const recentTrend = Array.from(trendMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30); // 最近 30 天

  return {
    totalReferences: recentReferences.length,
    referencesBySource,
    referencesByPage,
    averageAccuracyScore,
    sourceLinkPercentage,
    recentTrend,
  };
}

/**
 * 获取特定页面的引用数据
 *
 * @param pageUrl 页面 URL
 * @returns 引用数组
 */
export function getPageReferences(pageUrl: string): AIReference[] {
  return aiReferences.filter((ref) => ref.pageUrl === pageUrl);
}

/**
 * 获取特定来源的引用数据
 *
 * @param source 来源名称
 * @returns 引用数组
 */
export function getSourceReferences(source: string): AIReference[] {
  return aiReferences.filter((ref) => ref.source === source);
}

/**
 * 导出引用数据（用于分析）
 *
 * @param format 导出格式（json, csv）
 * @returns 导出的数据
 */
export function exportReferences(format: "json" | "csv" = "json"): string {
  if (format === "csv") {
    const headers = [
      "Source",
      "Timestamp",
      "Page URL",
      "Content Snippet",
      "Accuracy Score",
      "Includes Source Link",
      "User Query",
    ];
    const rows = aiReferences.map((ref) => [
      ref.source,
      ref.timestamp,
      ref.pageUrl,
      `"${ref.contentSnippet.replace(/"/g, '""')}"`,
      ref.accuracyScore?.toString() || "",
      ref.includesSourceLink.toString(),
      ref.userQuery || "",
    ]);

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  }

  return JSON.stringify(aiReferences, null, 2);
}
