import { NextRequest, NextResponse } from "next/server";
import { trackRecommendationClick } from "@/lib/recommendationAnalytics";
import { logError } from "@/lib/debug-logger";

/**
 * POST /api/recommendation-click
 * 追踪推荐文章点击
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentArticle, clickedArticle, recommendedArticles, locale } =
      body;

    // 验证必需字段
    if (!currentArticle || !clickedArticle || !recommendedArticles || !locale) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      );
    }

    // 获取用户代理
    const userAgent = request.headers.get("user-agent") || undefined;

    // 追踪点击
    trackRecommendationClick(
      currentArticle,
      recommendedArticles,
      clickedArticle,
      locale,
      userAgent,
    );

    return NextResponse.json({
      success: true,
      message: "Click tracked successfully",
    });
  } catch (error) {
    logError(
      "Error tracking recommendation click:",
      error,
      "api/recommendation-click/POST",
    );
    return NextResponse.json(
      {
        success: false,
        error: "Failed to track click",
      },
      { status: 500 },
    );
  }
}
