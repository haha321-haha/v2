/**
 * AEO Tracking Repository
 * AEO 追踪数据仓库
 *
 * 提供 AEO 追踪数据的数据库操作接口
 */

import type { AIReference, AEOMetrics } from "@/lib/seo/aeo-tracking";

/**
 * 数据库配置接口
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
}

/**
 * AEO 引用数据接口（包含数据库字段）
 */
export interface AEOReferenceRecord extends AIReference {
  id?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * 保存 AI 引用到数据库
 *
 * @param reference AI 引用数据
 * @returns 保存的记录 ID
 */
export async function saveAIReference(reference: AIReference): Promise<number> {
  // 这里需要根据实际使用的数据库客户端实现
  // 示例使用 PostgreSQL (pg 库)

  // 实际实现示例：
  /*
  const query = `
    INSERT INTO aeo_references (
      source, page_url, content_snippet, accuracy_score,
      includes_source_link, user_query, timestamp
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
  `;

  const values = [
    reference.source,
    reference.pageUrl,
    reference.contentSnippet,
    reference.accuracyScore || null,
    reference.includesSourceLink,
    reference.userQuery || null,
    reference.timestamp || new Date().toISOString(),
  ];

  const result = await db.query(query, values);
  return result.rows[0].id;
  */

  // 临时实现：返回模拟 ID
  console.log("[AEO Repository] Saving reference:", reference);
  return Date.now();
}

/**
 * 从数据库获取 AEO 指标
 *
 * @param days 统计天数
 * @returns AEO 指标
 */
export async function getAEOMetricsFromDB(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _days: number = 30,
): Promise<AEOMetrics> {
  // 实际实现示例：
  /*
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // 按来源分组统计
  const sourceQuery = `
    SELECT source, COUNT(*) as count
    FROM aeo_references
    WHERE timestamp >= $1
    GROUP BY source
  `;

  // 按页面分组统计
  const pageQuery = `
    SELECT page_url, COUNT(*) as count
    FROM aeo_references
    WHERE timestamp >= $1
    GROUP BY page_url
  `;

  // 计算平均准确性评分
  const scoreQuery = `
    SELECT AVG(accuracy_score) as avg_score
    FROM aeo_references
    WHERE timestamp >= $1 AND accuracy_score IS NOT NULL
  `;

  // 计算来源链接百分比
  const linkQuery = `
    SELECT
      COUNT(*) FILTER (WHERE includes_source_link = TRUE)::FLOAT / COUNT(*) * 100 as percentage
    FROM aeo_references
    WHERE timestamp >= $1
  `;

  // 最近趋势
  const trendQuery = `
    SELECT
      DATE(timestamp) as date,
      COUNT(*) as count
    FROM aeo_references
    WHERE timestamp >= $1
    GROUP BY DATE(timestamp)
    ORDER BY date DESC
    LIMIT 30
  `;

  const [sourceResult, pageResult, scoreResult, linkResult, trendResult] =
    await Promise.all([
      db.query(sourceQuery, [cutoffDate]),
      db.query(pageQuery, [cutoffDate]),
      db.query(scoreQuery, [cutoffDate]),
      db.query(linkQuery, [cutoffDate]),
      db.query(trendQuery, [cutoffDate]),
    ]);

  const referencesBySource: Record<string, number> = {};
  sourceResult.rows.forEach(row => {
    referencesBySource[row.source] = parseInt(row.count);
  });

  const referencesByPage: Record<string, number> = {};
  pageResult.rows.forEach(row => {
    referencesByPage[row.page_url] = parseInt(row.count);
  });

  const totalReferences = Object.values(referencesBySource).reduce((sum, count) => sum + count, 0);
  const averageAccuracyScore = parseFloat(scoreResult.rows[0]?.avg_score || '0');
  const sourceLinkPercentage = parseFloat(linkResult.rows[0]?.percentage || '0');

  const recentTrend = trendResult.rows.map(row => ({
    date: row.date.toISOString().split('T')[0],
    count: parseInt(row.count),
  }));

  return {
    totalReferences,
    referencesBySource,
    referencesByPage,
    averageAccuracyScore,
    sourceLinkPercentage,
    recentTrend,
  };
  */

  // 临时实现：返回空指标
  return {
    totalReferences: 0,
    referencesBySource: {},
    referencesByPage: {},
    averageAccuracyScore: 0,
    sourceLinkPercentage: 0,
    recentTrend: [],
  };
}

/**
 * 获取特定页面的引用数据
 *
 * @param pageUrl 页面 URL
 * @param limit 返回数量限制
 * @returns 引用数组
 */
export async function getPageReferencesFromDB(
  pageUrl: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _limit: number = 100,
): Promise<AEOReferenceRecord[]> {
  // 实际实现示例：
  /*
  const query = `
    SELECT *
    FROM aeo_references
    WHERE page_url = $1
    ORDER BY timestamp DESC
    LIMIT $2
  `;

  const result = await db.query(query, [pageUrl, limit]);
  return result.rows.map(row => ({
    source: row.source,
    pageUrl: row.page_url,
    contentSnippet: row.content_snippet,
    accuracyScore: row.accuracy_score,
    includesSourceLink: row.includes_source_link,
    userQuery: row.user_query,
    timestamp: row.timestamp.toISOString(),
    id: row.id,
    created_at: row.created_at?.toISOString(),
    updated_at: row.updated_at?.toISOString(),
  }));
  */

  // 临时实现：返回空数组
  return [];
}

/**
 * 获取特定来源的引用数据
 *
 * @param source 来源名称
 * @param limit 返回数量限制
 * @returns 引用数组
 */
export async function getSourceReferencesFromDB(
  source: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _limit: number = 100,
): Promise<AEOReferenceRecord[]> {
  // 实际实现示例：
  /*
  const query = `
    SELECT *
    FROM aeo_references
    WHERE source = $1
    ORDER BY timestamp DESC
    LIMIT $2
  `;

  const result = await db.query(query, [source, limit]);
  return result.rows.map(row => ({
    source: row.source,
    pageUrl: row.page_url,
    contentSnippet: row.content_snippet,
    accuracyScore: row.accuracy_score,
    includesSourceLink: row.includes_source_link,
    userQuery: row.user_query,
    timestamp: row.timestamp.toISOString(),
    id: row.id,
    created_at: row.created_at?.toISOString(),
    updated_at: row.updated_at?.toISOString(),
  }));
  */

  // 临时实现：返回空数组
  return [];
}

/**
 * 数据库连接辅助函数
 * 根据环境变量配置数据库连接
 */
export function getDatabaseConfig(): DatabaseConfig | null {
  // 从环境变量读取数据库配置
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.warn(
      "[AEO Repository] DATABASE_URL not configured, using in-memory storage",
    );
    return null;
  }

  // 解析数据库 URL
  // 格式: postgresql://user:password@host:port/database
  try {
    const url = new URL(dbUrl);
    return {
      host: url.hostname,
      port: parseInt(url.port || "5432", 10),
      database: url.pathname.slice(1),
      user: url.username,
      password: url.password,
      ssl: url.searchParams.get("ssl") === "true",
    };
  } catch (error) {
    console.error("[AEO Repository] Invalid DATABASE_URL:", error);
    return null;
  }
}
