// 基于技术日志的存储管理经验，实现命名空间管理
import type {
  MedicalCareGuideStorage,
  AssessmentResult,
} from "../types/medical-care-guide";
import { logError, logWarn, logInfo } from "@/lib/debug-logger";

// 基础存储管理器类
class StorageManager {
  private namespace: string;
  private version: number = 1;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  private getKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  protected setItem(key: string, value: unknown): void {
    try {
      const serializedValue = JSON.stringify({
        data: value,
        version: this.version,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(this.getKey(key), serializedValue);
    } catch (error) {
      logError(`Storage error (set ${key}):`, error, "storageManager/setItem");
      // 如果存储失败，尝试清理旧数据
      this.cleanup();
    }
  }

  protected getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (!item) {
        return defaultValue || null;
      }

      const parsed = JSON.parse(item);

      // 检查版本兼容性
      if (parsed.version && parsed.version !== this.version) {
        logWarn(
          `Version mismatch for ${key}. Expected ${this.version}, got ${parsed.version}`,
          "storageManager/getItem",
        );
        // 可以在这里实现数据迁移逻辑
      }

      return parsed.data;
    } catch (error) {
      logError(`Storage error (get ${key}):`, error, "storageManager/getItem");
      return defaultValue || null;
    }
  }

  protected removeItem(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      logError(
        `Storage error (remove ${key}):`,
        error,
        "storageManager/removeItem",
      );
    }
  }

  protected clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(`${this.namespace}:`)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      logError("Storage error (clear):", error, "storageManager/clear");
    }
  }

  // 清理过期或损坏的数据
  private cleanup(): void {
    try {
      const keys = Object.keys(localStorage);
      const namespaceKeys = keys.filter((key) =>
        key.startsWith(`${this.namespace}:`),
      );

      // 按时间戳排序，删除最老的数据
      const keyData = namespaceKeys
        .map((key) => {
          try {
            const item = localStorage.getItem(key);
            const parsed = item ? JSON.parse(item) : null;
            return {
              key,
              timestamp: parsed?.timestamp
                ? new Date(parsed.timestamp).getTime()
                : 0,
            };
          } catch {
            return { key, timestamp: 0 };
          }
        })
        .sort((a, b) => a.timestamp - b.timestamp);

      // 删除最老的25%数据
      const deleteCount = Math.floor(keyData.length * 0.25);
      for (let i = 0; i < deleteCount; i++) {
        localStorage.removeItem(keyData[i].key);
      }
    } catch (error) {
      logError("Storage cleanup error:", error, "storageManager/cleanup");
    }
  }

  // 获取存储使用情况
  getStorageInfo(): {
    used: number;
    available: number;
    itemCount: number;
  } {
    try {
      const keys = Object.keys(localStorage);
      const namespaceKeys = keys.filter((key) =>
        key.startsWith(`${this.namespace}:`),
      );

      let totalSize = 0;
      namespaceKeys.forEach((key) => {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += item.length;
        }
      });

      // 估算可用空间（localStorage通常限制为5-10MB）
      const estimatedLimit = 5 * 1024 * 1024; // 5MB

      return {
        used: totalSize,
        available: estimatedLimit - totalSize,
        itemCount: namespaceKeys.length,
      };
    } catch (error) {
      logError("Storage info error:", error, "storageManager/getStorageInfo");
      return { used: 0, available: 0, itemCount: 0 };
    }
  }
}

// 医疗护理指南专用存储管理器
class MedicalCareGuideStorageManager extends StorageManager {
  constructor() {
    super("medicalCareGuide");
  }

  // 保存评估结果
  saveAssessmentResult(result: AssessmentResult): void {
    try {
      const history = this.getAssessmentHistory();
      const updatedHistory = [result, ...history.slice(0, 9)]; // 保留最近10次

      this.setItem("assessmentHistory", updatedHistory);
      this.setItem("lastAssessment", result);

      // 更新统计信息
      this.updateStatistics(result);
    } catch (error) {
      logError(
        "Failed to save assessment result:",
        error,
        "storageManager/saveAssessmentResult",
      );
    }
  }

  // 获取评估历史
  getAssessmentHistory(): AssessmentResult[] {
    return this.getItem("assessmentHistory", []) || [];
  }

  // 获取最后一次评估
  getLastAssessment(): AssessmentResult | null {
    return this.getItem("lastAssessment", null);
  }

  // 清除历史记录
  clearHistory(): void {
    this.removeItem("assessmentHistory");
    this.removeItem("lastAssessment");
    this.removeItem("statistics");
  }

  // 保存用户偏好
  saveUserPreferences(
    preferences: MedicalCareGuideStorage["userPreferences"],
  ): void {
    this.setItem("userPreferences", preferences);
  }

  // 获取用户偏好
  getUserPreferences(): MedicalCareGuideStorage["userPreferences"] {
    return (
      this.getItem("userPreferences", {
        language: "zh",
        reminderEnabled: false,
        lastVisit: new Date().toISOString(),
      }) || {
        language: "zh",
        reminderEnabled: false,
        lastVisit: new Date().toISOString(),
      }
    );
  }

  // 更新统计信息
  private updateStatistics(result: AssessmentResult): void {
    try {
      const stats = this.getItem("statistics", {
        totalAssessments: 0,
        averagePainLevel: 0,
        riskLevelCounts: {
          low: 0,
          medium: 0,
          high: 0,
          emergency: 0,
        },
        lastUpdated: new Date().toISOString(),
      }) || {
        totalAssessments: 0,
        averagePainLevel: 0,
        riskLevelCounts: {
          low: 0,
          medium: 0,
          high: 0,
          emergency: 0,
        },
        lastUpdated: new Date().toISOString(),
      };

      if (stats) {
        stats.totalAssessments += 1;
        stats.riskLevelCounts[result.riskLevel] += 1;

        // 计算平均疼痛等级
        const history = this.getAssessmentHistory();
        const totalPainLevel = history.reduce(
          (sum, assessment) => sum + assessment.painLevel,
          0,
        );
        stats.averagePainLevel = totalPainLevel / history.length;

        stats.lastUpdated = new Date().toISOString();

        this.setItem("statistics", stats);
      }
    } catch (error) {
      logError(
        "Failed to update statistics:",
        error,
        "storageManager/updateStatistics",
      );
    }
  }

  // 获取统计信息
  getStatistics() {
    return this.getItem("statistics", null);
  }

  // 导出所有数据
  exportAllData(): string {
    try {
      const lastAssessment = this.getLastAssessment();
      const data: MedicalCareGuideStorage = {
        assessmentHistory: this.getAssessmentHistory(),
        ...(lastAssessment ? { lastAssessment } : {}),
        userPreferences: this.getUserPreferences(),
        version: 1,
      };

      return JSON.stringify(data, null, 2);
    } catch (error) {
      logError("Failed to export data:", error, "storageManager/exportAllData");
      return "";
    }
  }

  // 导入数据
  importData(jsonData: string): boolean {
    try {
      const data: MedicalCareGuideStorage = JSON.parse(jsonData);

      // 验证数据结构
      if (!this.validateImportData(data)) {
        throw new Error("Invalid data structure");
      }

      // 导入数据
      const dataWithHistory = data as {
        assessmentHistory?: unknown;
        lastAssessment?: unknown;
      };
      if (dataWithHistory.assessmentHistory) {
        this.setItem("assessmentHistory", dataWithHistory.assessmentHistory);
      }

      if (dataWithHistory.lastAssessment) {
        this.setItem("lastAssessment", dataWithHistory.lastAssessment);
      }

      if (data.userPreferences) {
        this.setItem("userPreferences", data.userPreferences);
      }

      return true;
    } catch (error) {
      logError("Failed to import data:", error, "storageManager/importData");
      return false;
    }
  }

  // 验证导入数据
  private validateImportData(data: unknown): data is MedicalCareGuideStorage {
    if (!data || typeof data !== "object") {
      return false;
    }

    // 检查必要字段
    const dataWithHistory = data as { assessmentHistory?: unknown };
    if (
      dataWithHistory.assessmentHistory &&
      !Array.isArray(dataWithHistory.assessmentHistory)
    ) {
      return false;
    }

    const dataWithAll = dataWithHistory as {
      lastAssessment?: unknown;
      userPreferences?: unknown;
    };
    if (
      dataWithAll.lastAssessment &&
      typeof dataWithAll.lastAssessment !== "object"
    ) {
      return false;
    }

    if (
      dataWithAll.userPreferences &&
      typeof dataWithAll.userPreferences !== "object"
    ) {
      return false;
    }

    return true;
  }

  // 数据迁移（用于版本升级）
  migrateData(fromVersion: number, toVersion: number): boolean {
    try {
      logInfo(
        `Migrating data from version ${fromVersion} to ${toVersion}`,
        "storageManager/migrateData",
      );

      // 这里可以实现具体的迁移逻辑
      switch (fromVersion) {
        case 1:
          // 从版本1迁移的逻辑
          break;
        default:
          logWarn(
            `No migration path from version ${fromVersion}`,
            "storageManager/migrateData",
          );
          return false;
      }

      return true;
    } catch (error) {
      logError("Data migration failed:", error, "storageManager/migrateData");
      return false;
    }
  }

  // 检查存储健康状态
  checkStorageHealth(): {
    isHealthy: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      // 检查存储可用性
      const storageInfo = this.getStorageInfo();

      if (storageInfo.used > storageInfo.available * 0.8) {
        issues.push("Storage usage is high");
        recommendations.push("Consider clearing old assessment history");
      }

      // 检查数据完整性
      const history = this.getAssessmentHistory();
      const lastAssessment = this.getLastAssessment();

      if (history.length > 0 && !lastAssessment) {
        issues.push("Last assessment is missing");
        recommendations.push("Recalculate last assessment from history");
      }

      // 检查数据一致性
      if (lastAssessment && history.length > 0) {
        const latestInHistory = history[0];
        if (latestInHistory.timestamp !== lastAssessment.timestamp) {
          issues.push("Last assessment timestamp mismatch");
          recommendations.push("Synchronize last assessment with history");
        }
      }

      return {
        isHealthy: issues.length === 0,
        issues,
        recommendations,
      };
    } catch {
      return {
        isHealthy: false,
        issues: ["Storage health check failed"],
        recommendations: ["Check browser storage permissions"],
      };
    }
  }
}

// 导出单例实例
export const medicalCareGuideStorage = new MedicalCareGuideStorageManager();

// 导出基础类供其他模块使用
export { StorageManager };
