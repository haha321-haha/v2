/**
 * 邮件营销系统 - TypeScript类型定义
 */

// 语言类型
export type Locale = "zh" | "en";

// 请求/响应类型
export interface SendGuideRequest {
  email: string;
  locale?: Locale;
  source?: string; // 来源标识（如：'上班痛经', 'travel' 等）
}

export interface SendGuideResponse {
  success: boolean;
  id?: string;
  error?: string;
  errorType?: "validation" | "network" | "server" | "rate_limit";
}

// 邮件模板类型
export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  fromEmail: string;
  fromName?: string;
}

// 邮件模板变量
export interface EmailTemplateVariables {
  locale: Locale;
  downloadUrl: string;
  officeUrl: string;
  travelUrl: string;
  unsubscribeUrl?: string;
  userName?: string;
}

// 邮件偏好设置类型
export interface EmailPreferences {
  userId: string;
  email: string;
  categories: {
    educational: boolean; // 教育内容
    toolReminders: boolean; // 工具提醒
    weeklyDigest: boolean; // 周报
    productUpdates: boolean; // 产品更新
    seasonalContent: boolean; // 季节性内容
  };
  frequency: "daily" | "weekly" | "monthly";
  timezone: string;
  lastEmailSentAt?: Date; // 上次发送时间
  unsubscribeToken: string; // 退订令牌
  createdAt: Date;
  updatedAt: Date;
}

// 用户生命周期状态
export type UserLifecycleStage =
  | "new" // 新用户（0-7天）
  | "active" // 活跃用户（7-30天内有活动）
  | "dormant" // 沉睡用户（30-90天无活动）
  | "churned"; // 流失用户（90+天无活动）

// 邮件触发规则
export interface EmailTriggerRule {
  type:
    | "welcome"
    | "tool_complete"
    | "re_engagement"
    | "weekly_digest"
    | "seasonal";
  condition: {
    lifecycleStage?: UserLifecycleStage[];
    daysSinceLastActivity?: number;
    toolCompleted?: string[];
  };
  delay?: number; // 延迟发送时间（小时）
}

// 邮件发送结果
export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  errorCode?: string;
}

// 速率限制配置
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  storageType: "memory" | "redis";
}
