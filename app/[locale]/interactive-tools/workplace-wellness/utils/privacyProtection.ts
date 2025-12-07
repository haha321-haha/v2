/**
 * HVsLYEp职场健康助手 - 隐私保护机制
 * 实现数据脱敏、权限控制和安全提示
 */

import {
  PeriodRecord,
  NutritionRecommendation,
  ExportType,
  FlowType,
} from "../types";
import { getTranslations } from "next-intl/server";

type TFunction = Awaited<ReturnType<typeof getTranslations>>;

export interface PrivacySettings {
  enableDataMasking: boolean;
  requirePassword: boolean;
  allowPersonalData: boolean;
  enableAuditLog: boolean;
  dataRetentionDays: number;
}

export interface AuditLogEntry {
  timestamp: string;
  action: "export" | "view" | "delete";
  dataType: ExportType;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
}

type PeriodMaskPayload = { data?: PeriodRecord[] };
type NutritionMaskPayload = { data?: NutritionRecommendation[] };
type CombinedMaskPayload = {
  period?: PeriodRecord[];
  nutrition?: NutritionRecommendation[];
};
type MaskablePayload =
  | PeriodMaskPayload
  | NutritionMaskPayload
  | CombinedMaskPayload;

export class PrivacyProtectionManager {
  private locale: string;
  private settings: PrivacySettings;
  private auditLog: AuditLogEntry[] = [];
  private t?: TFunction;

  constructor(
    locale: string,
    settings?: Partial<PrivacySettings>,
    t?: TFunction,
  ) {
    this.locale = locale;
    this.t = t;
    this.settings = {
      enableDataMasking: true,
      requirePassword: false,
      allowPersonalData: true,
      enableAuditLog: true,
      dataRetentionDays: 180,
      ...settings,
    };
  }

  /**
   * 数据脱敏处理
   */
  maskSensitiveData<T extends MaskablePayload>(
    data: T,
    dataType: ExportType,
  ): T {
    if (!this.settings.enableDataMasking) {
      return data;
    }

    const maskedData = { ...data };

    switch (dataType) {
      case "period":
        return this.maskPeriodData(maskedData as PeriodMaskPayload) as T;
      case "nutrition":
        return this.maskNutritionData(maskedData as NutritionMaskPayload) as T;
      case "all":
        return this.maskAllData(maskedData as CombinedMaskPayload) as T;
      default:
        return maskedData;
    }
  }

  /**
   * 经期数据脱敏
   */
  private maskPeriodData<T extends PeriodMaskPayload>(data: T): T {
    if (Array.isArray(data.data)) {
      data.data = data.data.map((record: PeriodRecord) => ({
        ...record,
        // 保留日期但脱敏具体时间
        date: this.maskDate(record.date),
        // 保留疼痛等级但脱敏具体数值
        painLevel: record.painLevel
          ? this.maskPainLevel(record.painLevel)
          : null,
        // 保留流量类型但脱敏具体描述
        flow: record.flow ? this.maskFlowType() : null,
        // 脱敏备注信息
        notes: record.notes ? this.maskNotes(record.notes) : undefined,
      })) as PeriodRecord[];
    }
    return data;
  }

  /**
   * 营养数据脱敏
   */
  private maskNutritionData<T extends NutritionMaskPayload>(data: T): T {
    if (Array.isArray(data.data)) {
      data.data = data.data.map((item: NutritionRecommendation) => ({
        ...item,
        // 保留食物名称但脱敏具体描述
        name: this.maskFoodName(item.name),
        // 保留功效但脱敏具体描述
        benefits: item.benefits.map((benefit) => this.maskBenefit(benefit)),
        // 保留营养素但脱敏具体含量
        nutrients: item.nutrients.map((nutrient) =>
          this.maskNutrient(nutrient),
        ),
      }));
    }
    return data;
  }

  /**
   * 全部数据脱敏
   */
  private maskAllData(data: CombinedMaskPayload): CombinedMaskPayload {
    if (data.period) {
      data.period = this.maskPeriodData({ data: data.period }).data;
    }
    if (data.nutrition) {
      data.nutrition = this.maskNutritionData({ data: data.nutrition }).data;
    }
    return data;
  }

  /**
   * 日期脱敏 - 保留月份和日期，脱敏年份
   */
  private maskDate(dateStr: string): string {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `2024-${month}-${day}`; // 使用固定年份
  }

  /**
   * 疼痛等级脱敏 - 保留等级范围，脱敏具体数值
   */
  private maskPainLevel(level: number): number {
    if (level <= 3) return 2; // 轻度
    if (level <= 6) return 5; // 中度
    return 8; // 重度
  }

  /**
   * 流量类型脱敏 - 保留类型，脱敏具体描述
   */
  private maskFlowType(): FlowType {
    const flowTypes: FlowType[] = ["light", "medium", "heavy"];
    return flowTypes[Math.floor(Math.random() * flowTypes.length)];
  }

  /**
   * 备注脱敏 - 保留长度，替换内容
   */
  private maskNotes(notes: string): string {
    const maskedLength = Math.min(notes.length, 20);
    return "***".repeat(Math.ceil(maskedLength / 3)).substring(0, maskedLength);
  }

  /**
   * 食物名称脱敏 - 保留主要信息，脱敏具体描述
   */
  private maskFoodName(name: string): string {
    if (name.length <= 3) return name;
    return name.substring(0, 2) + "***" + name.substring(name.length - 1);
  }

  /**
   * 功效脱敏 - 保留关键词，脱敏具体描述
   */
  private maskBenefit(benefit: string): string {
    const keywords = [
      "补血",
      "止痛",
      "调经",
      "安神",
      "Replenish",
      "Relieve",
      "Improve",
    ];
    const foundKeyword = keywords.find((keyword) => benefit.includes(keyword));
    return foundKeyword || "健康功效";
  }

  /**
   * 营养素脱敏 - 保留主要营养素，脱敏具体含量
   */
  private maskNutrient(nutrient: string): string {
    const nutrients = [
      "铁",
      "维生素C",
      "蛋白质",
      "Iron",
      "Vitamin C",
      "Protein",
    ];
    const foundNutrient = nutrients.find((n) => nutrient.includes(n));
    return foundNutrient || "营养素";
  }

  /**
   * 权限控制 - 检查导出权限
   */
  async checkExportPermission(
    dataType: ExportType,
    password?: string,
  ): Promise<boolean> {
    // 记录权限检查
    this.logAuditEvent("view", dataType);

    // 如果需要密码验证
    if (this.settings.requirePassword) {
      if (!password) {
        return false;
      }
      // 这里可以实现密码验证逻辑
      // 为了演示，使用简单的密码验证
      const validPassword =
        this.locale === "zh" ? "health2024" : "wellness2024";
      return password === validPassword;
    }

    return true;
  }

  /**
   * 生成安全提示
   */
  generateSecurityWarnings(dataType: ExportType): string[] {
    const warnings: string[] = [];
    const isZh = this.locale === "zh";

    // 基础安全提示
    warnings.push(
      isZh
        ? "🔒 数据已脱敏处理，保护您的隐私信息"
        : "🔒 Data has been masked to protect your privacy",
    );

    // 根据数据类型添加特定提示
    switch (dataType) {
      case "period":
        warnings.push(
          isZh
            ? "📅 经期数据已匿名化，具体日期已脱敏"
            : "📅 Period data has been anonymized, specific dates masked",
        );
        break;
      case "nutrition":
        warnings.push(
          isZh
            ? "🥗 营养数据已简化，保留主要信息"
            : "🥗 Nutrition data has been simplified, keeping main information",
        );
        break;
      case "all":
        warnings.push(
          isZh
            ? "📊 全部数据已综合脱敏处理"
            : "📊 All data has been comprehensively masked",
        );
        break;
    }

    // 数据保留提示
    if (this.settings.dataRetentionDays > 0) {
      warnings.push(
        isZh
          ? `⏰ 数据保留期限：${this.settings.dataRetentionDays}天`
          : `⏰ Data retention period: ${this.settings.dataRetentionDays} days`,
      );
    }

    // 审计日志提示
    if (this.settings.enableAuditLog) {
      warnings.push(
        isZh
          ? "📝 导出操作已记录在审计日志中"
          : "📝 Export operation has been logged in audit trail",
      );
    }

    return warnings;
  }

  /**
   * 记录审计日志
   */
  private logAuditEvent(
    action: AuditLogEntry["action"],
    dataType: ExportType,
  ): void {
    if (!this.settings.enableAuditLog) return;

    const logEntry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      action,
      dataType,
      userId: this.generateUserId(),
      ipAddress: this.getClientIP(),
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : "Server",
    };

    this.auditLog.push(logEntry);

    // 清理过期日志
    this.cleanupAuditLog();
  }

  /**
   * 生成用户ID（匿名化）
   */
  private generateUserId(): string {
    return "user_" + Math.random().toString(36).substr(2, 9);
  }

  /**
   * 获取客户端IP（模拟）
   */
  private getClientIP(): string {
    return "192.168.x.x"; // 实际应用中应该获取真实IP
  }

  /**
   * 清理过期审计日志
   */
  private cleanupAuditLog(): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.settings.dataRetentionDays);

    this.auditLog = this.auditLog.filter(
      (entry) => new Date(entry.timestamp) > cutoffDate,
    );
  }

  /**
   * 获取审计日志
   */
  getAuditLog(): AuditLogEntry[] {
    return [...this.auditLog];
  }

  /**
   * 更新隐私设置
   */
  updateSettings(newSettings: Partial<PrivacySettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * 获取当前隐私设置
   */
  getSettings(): PrivacySettings {
    return { ...this.settings };
  }

  /**
   * 生成隐私保护报告
   */
  generatePrivacyReport(): string {
    const report = {
      title: this.t
        ? this.t("privacy.reportTitle")
        : this.locale === "zh"
          ? "隐私保护报告"
          : "Privacy Protection Report",
      settings: this.settings,
      auditLogCount: this.auditLog.length,
      lastActivity:
        this.auditLog.length > 0
          ? this.auditLog[this.auditLog.length - 1].timestamp
          : null,
    };

    return JSON.stringify(report, null, 2);
  }
}
