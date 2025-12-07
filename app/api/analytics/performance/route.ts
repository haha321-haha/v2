import { NextRequest, NextResponse } from "next/server";
import { logInfo, logError } from "@/lib/debug-logger";

export async function POST(request: NextRequest) {
  try {
    const performanceData = await request.json();

    // 记录性能数据
    logInfo(
      "Performance Metrics",
      {
        url: performanceData.url,
        pageLoadTime: performanceData.pageLoadTime,
        ttfb: performanceData.ttfb,
        timestamp: performanceData.timestamp,
      },
      "api/analytics/performance/POST",
    );

    // 这里可以存储到数据库或发送到监控服务
    // await savePerformanceData(performanceData);

    return NextResponse.json({ success: true });
  } catch (error) {
    logError(
      "Error processing performance data:",
      error,
      "api/analytics/performance/POST",
    );
    return NextResponse.json(
      { error: "Failed to process performance data" },
      { status: 500 },
    );
  }
}
