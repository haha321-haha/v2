/**
 * 邮件工具函数
 */

import type { Locale } from "./types";

/**
 * 验证邮箱格式
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 获取基础URL
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
}

/**
 * 生成退订链接
 */
export function generateUnsubscribeUrl(
  token: string,
  locale: Locale = "zh",
): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/${locale}/unsubscribe?token=${token}`;
}

/**
 * 生成PDF下载URL
 */
export function getPdfDownloadUrl(locale: Locale = "zh"): string {
  const baseUrl = getBaseUrl();
  const filename = locale === "zh" ? "pain-guide.html" : "pain-guide-en.html";
  return `${baseUrl}/downloads/${filename}`;
}

/**
 * 生成场景解决方案URL
 */
export function getScenarioUrl(
  scenario: "office" | "travel",
  locale: Locale = "zh",
): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/${locale}/scenario-solutions#${scenario}`;
}

/**
 * 生成退订令牌
 */
export function generateUnsubscribeToken(email: string): string {
  // 简单的令牌生成，生产环境应使用更安全的方法
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return Buffer.from(`${email}-${timestamp}-${random}`).toString("base64");
}
