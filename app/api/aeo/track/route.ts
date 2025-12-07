/**
 * AEO Tracking API Route
 * AEO 追踪 API 路由
 *
 * POST /api/aeo/track
 *
 * 接收 AI 引用追踪数据
 */

import { NextRequest, NextResponse } from "next/server";
import { trackAIReference, type AIReference } from "@/lib/seo/aeo-tracking";
import { logInfo, logError } from "@/lib/debug-logger";

export async function POST(request: NextRequest) {
  try {
    const body: AIReference = await request.json();

    // 验证必需字段
    if (!body.source || !body.pageUrl || !body.contentSnippet) {
      return NextResponse.json(
        { error: "Missing required fields: source, pageUrl, contentSnippet" },
        { status: 400 },
      );
    }

    // 记录引用（异步保存到数据库）
    await trackAIReference({
      ...body,
      timestamp: body.timestamp || new Date().toISOString(),
    });

    logInfo(
      `[AEO Tracking] Reference tracked: ${body.source} -> ${body.pageUrl}`,
      undefined,
      "AEO",
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("[AEO Tracking] Error tracking reference", error, "AEO");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
