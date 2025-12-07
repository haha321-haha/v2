/**
 * 欢迎邮件模板
 * 使用翻译键系统，符合项目规范
 */

import { getTranslations } from "next-intl/server";
import type { EmailTemplate, EmailTemplateVariables, Locale } from "../types";
import {
  getPdfDownloadUrl,
  getScenarioUrl,
  generateUnsubscribeUrl,
} from "../utils";

/**
 * 生成欢迎邮件HTML内容（使用翻译键）
 */
export async function generateWelcomeEmailHtml(
  variables: EmailTemplateVariables,
): Promise<string> {
  const {
    locale,
    downloadUrl,
    officeUrl,
    travelUrl,
    unsubscribeUrl,
    userName,
  } = variables;
  const isZh = locale === "zh";

  // 从翻译文件获取文案（服务端翻译）
  const t = await getTranslations({
    locale,
    namespace: "emailMarketing.emailTemplate",
  });

  // 获取翻译文本
  const texts = {
    greeting: userName
      ? isZh
        ? `Hi ${userName}！`
        : `Hi ${userName}!`
      : t("greeting"),
    title: t("greeting"),
    downloadPrompt: t("downloadPrompt"),
    downloadButton: t("downloadButtonText"),
    additionalTitle: t("additionalContentTitle"),
    officeLabel: isZh ? "上班族：" : "Office:",
    officeLink: t("officeScenario"),
    travelLabel: isZh ? "旅行党：" : "Travel:",
    travelLink: t("travelScenario"),
    signature: t("signature"),
    unsubscribe: t("unsubscribe"),
    teamSignature: t("teamSignature"),
  };

  return `
<!DOCTYPE html>
<html lang="${locale === "zh" ? "zh-CN" : "en-US"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isZh ? "经期急救指南" : "Period Rescue Guide"}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h2 style="color: #ec4899; margin-top: 0; font-size: 24px; line-height: 1.4;">
      ${texts.greeting} ${texts.title}
    </h2>

    <p style="line-height: 1.6; margin: 20px 0; font-size: 16px; color: #555;">
      ${texts.downloadPrompt}
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${downloadUrl}"
         style="background-color: #ec4899; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(236, 72, 153, 0.3); font-size: 16px;">
         ${texts.downloadButton}
      </a>
    </div>

    <hr style="margin: 24px 0; border: 0; border-top: 1px solid #eee;" />

    <h3 style="color: #333; margin-top: 30px; font-size: 18px; font-weight: 600;">
      ${texts.additionalTitle}
    </h3>
    <ul style="line-height: 1.8; padding-left: 20px; color: #555;">
      <li style="margin-bottom: 12px;">
        <strong>${texts.officeLabel}</strong>
        <a href="${officeUrl}" style="color: #ec4899; text-decoration: none;">${
          texts.officeLink
        }</a>
      </li>
      <li style="margin-bottom: 12px;">
        <strong>${texts.travelLabel}</strong>
        <a href="${travelUrl}" style="color: #ec4899; text-decoration: none;">${
          texts.travelLink
        }</a>
      </li>
    </ul>

    <p style="font-size: 12px; color: #999; margin-top: 40px; text-align: center; line-height: 1.6;">
      ${texts.teamSignature} - ${texts.signature}<br>
      ${
        unsubscribeUrl
          ? `<a href="${unsubscribeUrl}" style="color: #ccc; text-decoration: none;">${texts.unsubscribe}</a>`
          : ""
      }
    </p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * 生成欢迎邮件（使用翻译键）
 */
export async function generateWelcomeEmail(
  email: string,
  locale: Locale = "zh",
  unsubscribeToken?: string,
): Promise<EmailTemplate> {
  const downloadUrl = getPdfDownloadUrl(locale);
  const officeUrl = getScenarioUrl("office", locale);
  const travelUrl = getScenarioUrl("travel", locale);
  const unsubscribeUrl = unsubscribeToken
    ? generateUnsubscribeUrl(unsubscribeToken, locale)
    : undefined;

  const variables: EmailTemplateVariables = {
    locale,
    downloadUrl,
    officeUrl,
    travelUrl,
    unsubscribeUrl,
  };

  // 从翻译文件获取主题和发件人名称
  const t = await getTranslations({
    locale,
    namespace: "emailMarketing.emailTemplate",
  });

  const subject = t("subject");
  const fromName = locale === "zh" ? "Period Hub 小助手" : "Period Hub";

  // 生成 HTML 内容（异步）
  const htmlContent = await generateWelcomeEmailHtml(variables);

  return {
    subject,
    htmlContent,
    fromEmail: "hello@periodhub.health",
    fromName,
  };
}
