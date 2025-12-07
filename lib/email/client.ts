/**
 * Resend邮件客户端
 */

import { Resend } from "resend";
import { logError } from "@/lib/debug-logger";
import type { EmailTemplate, EmailSendResult } from "./types";

// 延迟初始化Resend客户端（避免构建时错误）
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

/**
 * 发送邮件
 */
export async function sendEmail(
  to: string,
  template: EmailTemplate,
): Promise<EmailSendResult> {
  try {
    // 验证API Key
    if (!process.env.RESEND_API_KEY) {
      return {
        success: false,
        error: "RESEND_API_KEY is not configured",
        errorCode: "CONFIG_ERROR",
      };
    }

    // 获取Resend客户端（延迟初始化）
    const client = getResendClient();

    // 发送邮件
    const response = await client.emails.send({
      from: template.fromName
        ? `${template.fromName} <${template.fromEmail}>`
        : template.fromEmail,
      to,
      subject: template.subject,
      html: template.htmlContent,
    });

    // Resend 响应结构：{ data: { id: string } } 或 { error: ErrorResponse }
    if (response.error) {
      return {
        success: false,
        error: response.error.message || "Failed to send email",
        errorCode: String(response.error.statusCode || "UNKNOWN_ERROR"),
      };
    }

    // 成功响应：data.id 存在
    const messageId = response.data?.id;
    if (!messageId) {
      return {
        success: false,
        error: "No message ID returned from Resend",
        errorCode: "NO_MESSAGE_ID",
      };
    }

    return {
      success: true,
      messageId,
    };
  } catch (error) {
    logError("[Resend Error]", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorCode =
      error instanceof Error && "statusCode" in error
        ? String(error.statusCode)
        : "UNKNOWN_ERROR";

    return {
      success: false,
      error: errorMessage,
      errorCode,
    };
  }
}
