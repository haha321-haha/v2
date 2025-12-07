import { NextRequest, NextResponse } from "next/server";
import {
  getRecommendationStats,
  exportMetrics,
} from "@/lib/recommendationAnalytics";
import { getCacheStats } from "@/lib/recommendationCache";
import { logError } from "@/lib/debug-logger";

/**
 * GET /api/recommendation-stats
 * 获取推荐系统统计数据
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get("range") || "24h";

    // 计算时间范围
    let timeRange: { start: number; end: number } | undefined;
    const now = Date.now();

    switch (range) {
      case "24h":
        timeRange = { start: now - 24 * 60 * 60 * 1000, end: now };
        break;
      case "7d":
        timeRange = { start: now - 7 * 24 * 60 * 60 * 1000, end: now };
        break;
      case "30d":
        timeRange = { start: now - 30 * 24 * 60 * 60 * 1000, end: now };
        break;
      case "all":
        timeRange = undefined;
        break;
    }

    // 获取统计数据
    const stats = getRecommendationStats(timeRange);
    const cacheStats = getCacheStats();

    return NextResponse.json({
      success: true,
      stats,
      cacheStats,
      timeRange: range,
    });
  } catch (error) {
    logError(
      "Error fetching recommendation stats:",
      error,
      "api/recommendation-stats/GET",
    );
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch recommendation stats",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/recommendation-stats/export
 * 导出推荐数据
 */
export async function POST() {
  try {
    const metrics = exportMetrics();

    return NextResponse.json({
      success: true,
      data: metrics,
      exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    logError(
      "Error exporting metrics:",
      error,
      "api/recommendation-stats/POST",
    );
    return NextResponse.json(
      {
        success: false,
        error: "Failed to export metrics",
      },
      { status: 500 },
    );
  }
}
