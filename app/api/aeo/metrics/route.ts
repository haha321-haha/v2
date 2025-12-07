/**
 * AEO Metrics API Route
 * AEO 指标 API 路由
 *
 * GET /api/aeo/metrics?days=30
 *
 * 获取 AEO 指标数据
 */

import { NextRequest, NextResponse } from "next/server";
import { getAEOMetrics } from "@/lib/seo/aeo-tracking";
import { logError } from "@/lib/debug-logger";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "30", 10);

    if (isNaN(days) || days < 1 || days > 365) {
      return NextResponse.json(
        { error: "Invalid days parameter. Must be between 1 and 365." },
        { status: 400 },
      );
    }

    const metrics = await getAEOMetrics(days);

    return NextResponse.json(metrics);
  } catch (error) {
    logError("[AEO Metrics] Error getting metrics", error, "AEO");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
