// 真实反馈数据收集API端点
// 处理用户反馈数据

import { NextRequest, NextResponse } from "next/server";
import { RealFeedbackData } from "@/lib/real-data-collector";
import { logInfo, logError } from "@/lib/debug-logger";

interface FeedbackDataRequest {
  feedback: RealFeedbackData;
  metadata?: {
    apiVersion: string;
    clientInfo: string;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
}

// 内存存储（生产环境应该使用数据库）
let feedbackStore: RealFeedbackData[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackDataRequest = await request.json();
    const { feedback } = body;

    // 数据验证
    if (!feedback || !feedback.id || !feedback.userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "无效的反馈数据",
          error: "缺少必要的反馈标识符",
        },
        { status: 400 },
      );
    }

    // 隐私检查
    if (!hasValidConsent(feedback.userId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "用户未同意数据收集",
          error: "CONSENT_REQUIRED",
        },
        { status: 403 },
      );
    }

    // 数据清洗和验证
    const cleanedFeedback = cleanFeedbackData(feedback);

    // 存储反馈数据
    const existingIndex = feedbackStore.findIndex((f) => f.id === feedback.id);
    if (existingIndex >= 0) {
      feedbackStore[existingIndex] = {
        ...feedbackStore[existingIndex],
        ...cleanedFeedback,
      };
    } else {
      feedbackStore.push(cleanedFeedback);
    }

    // 保持存储大小在合理范围内（最近5000条记录）
    if (feedbackStore.length > 5000) {
      feedbackStore = feedbackStore.slice(-4000); // 保留最近4000条
    }

    logInfo(
      `📝 收到用户反馈: ${feedback.userId}, 评分: ${feedback.rating}, 情感: ${feedback.sentiment}`,
      {
        userId: feedback.userId,
        rating: feedback.rating,
        sentiment: feedback.sentiment,
      },
      "api/analytics/feedback/POST",
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "反馈数据已保存",
      data: {
        feedbackId: feedback.id,
        timestamp: new Date().toISOString(),
        storedFeedbackCount: feedbackStore.length,
      },
    });
  } catch (error) {
    logError("反馈数据处理错误:", error, "api/analytics/feedback/POST");
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "服务器内部错误",
        error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const feature = searchParams.get("feature");
    const sentiment = searchParams.get("sentiment");
    const limit = parseInt(searchParams.get("limit") || "100");

    let filteredFeedback = feedbackStore;

    // 按用户过滤
    if (userId) {
      filteredFeedback = filteredFeedback.filter((f) => f.userId === userId);
    }

    // 按功能过滤
    if (feature) {
      filteredFeedback = filteredFeedback.filter((f) => f.feature === feature);
    }

    // 按情感过滤
    if (sentiment) {
      filteredFeedback = filteredFeedback.filter(
        (f) => f.sentiment === sentiment,
      );
    }

    // 限制返回数量
    const limitedFeedback = filteredFeedback.slice(-limit);

    // 统计数据
    const stats = {
      totalCount: filteredFeedback.length,
      sentimentDistribution: {
        positive: filteredFeedback.filter((f) => f.sentiment === "positive")
          .length,
        neutral: filteredFeedback.filter((f) => f.sentiment === "neutral")
          .length,
        negative: filteredFeedback.filter((f) => f.sentiment === "negative")
          .length,
      },
      averageRating:
        filteredFeedback.length > 0
          ? filteredFeedback.reduce((sum, f) => sum + f.rating, 0) /
            filteredFeedback.length
          : 0,
      featureDistribution: getFeatureDistribution(filteredFeedback),
    };

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "反馈数据获取成功",
      data: {
        feedback: limitedFeedback,
        statistics: stats,
        totalCount: filteredFeedback.length,
        returnedCount: limitedFeedback.length,
      },
    });
  } catch (error) {
    logError("获取反馈数据错误:", error, "api/analytics/feedback/GET");
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "获取数据失败",
        error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId) {
      // 删除特定用户的反馈（GDPR合规）
      feedbackStore = feedbackStore.filter((f) => f.userId !== userId);

      return NextResponse.json<ApiResponse>({
        success: true,
        message: `用户 ${userId} 的反馈数据已删除`,
        data: {
          remainingFeedback: feedbackStore.length,
        },
      });
    } else {
      // 清空所有数据（仅开发环境使用）
      feedbackStore = [];

      return NextResponse.json<ApiResponse>({
        success: true,
        message: "所有反馈数据已清空",
        data: {
          remainingFeedback: 0,
        },
      });
    }
  } catch (error) {
    logError("删除反馈数据错误:", error, "api/analytics/feedback/DELETE");
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "删除数据失败",
        error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
      },
      { status: 500 },
    );
  }
}

// 辅助函数
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function hasValidConsent(_userId: string): boolean {
  // 检查用户的同意状态
  // 在生产环境中，这里应该查询数据库
  return true; // 临时返回true，实际应该检查数据库中的同意记录
}

function cleanFeedbackData(feedback: RealFeedbackData): RealFeedbackData {
  // 数据清洗和验证
  const cleaned = { ...feedback };

  // 确保必要字段存在
  if (!cleaned.timestamp) cleaned.timestamp = new Date();
  if (!cleaned.sentiment) cleaned.sentiment = "neutral";
  if (!cleaned.topics) cleaned.topics = [];
  if (!cleaned.rating) cleaned.rating = 3;

  // 数据类型验证和清理
  cleaned.rating = Math.max(1, Math.min(5, cleaned.rating)); // 限制在1-5范围内
  cleaned.comment = cleaned.comment?.substring(0, 1000) || ""; // 限制评论长度
  cleaned.timeSpent = Math.max(0, Math.min(24 * 60 * 60, cleaned.timeSpent)); // 限制在24小时内

  // 情感分析验证
  if (!["positive", "neutral", "negative"].includes(cleaned.sentiment)) {
    cleaned.sentiment = "neutral";
  }

  // 主题验证
  const validTopics = [
    "performance",
    "ui_ux",
    "functionality",
    "content",
    "mobile",
  ];
  cleaned.topics = cleaned.topics.filter((topic) =>
    validTopics.includes(topic),
  );

  return cleaned;
}

function getFeatureDistribution(
  feedback: RealFeedbackData[],
): Record<string, number> {
  const distribution: Record<string, number> = {};

  feedback.forEach((f) => {
    distribution[f.feature] = (distribution[f.feature] || 0) + 1;
  });

  return distribution;
}
