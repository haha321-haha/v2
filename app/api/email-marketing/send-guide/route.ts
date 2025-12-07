/**
 * 发送指南邮件 API 路由
 * POST /api/email-marketing/send-guide
 *
 * 优化版本：
 * - 使用 debug-logger 统一日志
 * - 使用翻译键系统（无硬编码）
 * - 无 Supabase 依赖（方案 A）
 * - 完善的错误处理和日志记录
 */

import { NextRequest, NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { logError, logInfo, logWarn } from "@/lib/debug-logger";
import type {
  SendGuideRequest,
  SendGuideResponse,
  Locale,
} from "@/lib/email/types";
import { validateEmail, generateUnsubscribeToken } from "@/lib/email/utils";
import { generateWelcomeEmail } from "@/lib/email/templates/welcome";
import { sendEmail } from "@/lib/email/client";

/**
 * 处理POST请求
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<SendGuideResponse>> {
  try {
    // 解析请求体
    const body: SendGuideRequest = await request.json();
    const { email, locale = "zh", source } = body;

    // [Log] 记录请求，方便 Vercel 后台查看
    logInfo(
      `[API/EmailMarketing] Attempting: ${email} | Source: ${
        source || "unknown"
      } | Locale: ${locale}`,
      undefined,
      "EmailMarketing",
    );

    // 1. 严格校验邮箱格式（Regex）
    if (!email || !validateEmail(email)) {
      logWarn(
        `[API/EmailMarketing] Invalid Email Blocked: ${email}`,
        undefined,
        "EmailMarketing",
      );
      const t = await getTranslations({
        locale,
        namespace: "emailMarketing.downloadModal",
      });
      return NextResponse.json<SendGuideResponse>(
        {
          success: false,
          error: t("errorInvalidEmail"),
          errorType: "validation",
        },
        { status: 400 },
      );
    }

    // 验证locale
    const validLocale: Locale = locale === "en" ? "en" : "zh";

    // 生成退订令牌
    const unsubscribeToken = generateUnsubscribeToken(email);

    // 2. 生成邮件模板（异步，使用翻译键）
    const emailTemplate = await generateWelcomeEmail(
      email,
      validLocale,
      unsubscribeToken,
    );

    // 3. 发送邮件（无 Supabase，直接发送）
    const result = await sendEmail(email, emailTemplate);

    if (!result.success) {
      logError(
        "[API/EmailMarketing] Resend Error",
        result.error,
        "EmailMarketing",
      );
      const t = await getTranslations({
        locale: validLocale,
        namespace: "emailMarketing.downloadModal",
      });

      return NextResponse.json<SendGuideResponse>(
        {
          success: false,
          error: t("errorServer"),
          errorType: "server",
        },
        { status: 500 },
      );
    }

    // 记录成功日志
    logInfo(
      `[API/EmailMarketing] Success: ${email} | MessageID: ${result.messageId}`,
      undefined,
      "EmailMarketing",
    );

    // 返回成功响应
    return NextResponse.json<SendGuideResponse>({
      success: true,
      id: result.messageId,
    });
  } catch (error) {
    logError("[API/EmailMarketing] Critical Error", error, "EmailMarketing");

    // 处理JSON解析错误
    if (error instanceof SyntaxError) {
      return NextResponse.json<SendGuideResponse>(
        {
          success: false,
          error: "Invalid request body",
          errorType: "validation",
        },
        { status: 400 },
      );
    }

    // 其他错误
    return NextResponse.json<SendGuideResponse>(
      {
        success: false,
        error: "Internal server error",
        errorType: "server",
      },
      { status: 500 },
    );
  }
}

/**
 * 处理OPTIONS请求（CORS预检）
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
