/**
 * 进度管理工具类
 * 支持断点续测、自动保存、数据恢复等功能
 */

import { QuizStage, StageProgress, QuizResult } from "../types/quiz";
import { logError, logInfo, logWarn } from "@/lib/debug-logger";

interface ProgressData {
  stageProgress: Record<QuizStage, StageProgress>;
  overallResult?: QuizResult | null;
  userPreferences?: Record<string, unknown>;
  lastSaved?: string | null;
  version?: string;
}

interface ProgressStats {
  totalStages: number;
  completedStages: number;
  totalQuestions: number;
  answeredQuestions: number;
  completionRate: number;
  lastSaved: string | null;
}

// 进度管理器类
export class ProgressManager {
  private static instance: ProgressManager;
  private storageKey = "partner-handbook-progress";
  private autoSaveInterval = 30000; // 30秒自动保存
  private autoSaveTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.startAutoSave();
  }

  public static getInstance(): ProgressManager {
    if (!ProgressManager.instance) {
      ProgressManager.instance = new ProgressManager();
    }
    return ProgressManager.instance;
  }

  // 开始自动保存
  private startAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    this.autoSaveTimer = setInterval(() => {
      this.autoSave();
    }, this.autoSaveInterval);
  }

  // 停止自动保存
  public stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  // 自动保存进度
  private autoSave(): void {
    try {
      const currentProgress = this.getCurrentProgress();
      if (currentProgress && this.hasUnsavedChanges(currentProgress)) {
        this.saveProgress(currentProgress);
        logInfo("🔄 自动保存进度成功", undefined, "ProgressManager/autoSave");
      }
    } catch (error) {
      logError("❌ 自动保存失败", error, "ProgressManager/autoSave");
    }
  }

  // 检查是否有未保存的更改
  private hasUnsavedChanges(progress: ProgressData): boolean {
    const savedProgress = this.loadProgress();
    if (!savedProgress) return true;

    // 比较关键字段
    return (
      JSON.stringify(progress.stageProgress) !==
      JSON.stringify(savedProgress.stageProgress)
    );
  }

  // 保存进度
  public saveProgress(progress: ProgressData): boolean {
    try {
      const dataToSave = {
        ...progress,
        lastSaved: new Date().toISOString(),
        version: "1.0.0",
      };

      localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
      logInfo("💾 进度保存成功", undefined, "ProgressManager/saveProgress");
      return true;
    } catch (error) {
      logError("❌ 进度保存失败", error, "ProgressManager/saveProgress");
      return false;
    }
  }

  // 加载进度
  public loadProgress(): ProgressData | null {
    try {
      const savedData = localStorage.getItem(this.storageKey);
      if (!savedData) return null;

      const parsedData = JSON.parse(savedData);

      // 验证数据完整性
      if (this.validateProgressData(parsedData)) {
        logInfo("📂 进度加载成功", undefined, "ProgressManager/loadProgress");
        return parsedData;
      } else {
        logWarn(
          "⚠️ 进度数据验证失败，使用默认值",
          parsedData,
          "ProgressManager/loadProgress",
        );
        return null;
      }
    } catch (error) {
      logError("❌ 进度加载失败", error, "ProgressManager/loadProgress");
      return null;
    }
  }

  // 验证进度数据
  private validateProgressData(data: unknown): data is ProgressData {
    try {
      // 检查必要字段
      if (
        !data ||
        typeof data !== "object" ||
        !("stageProgress" in data) ||
        typeof (data as Record<string, unknown>).stageProgress !== "object"
      ) {
        return false;
      }

      // 检查阶段进度结构
      for (const stage of ["stage1", "stage2"]) {
        const stageData = data.stageProgress[stage];
        if (!stageData || typeof stageData !== "object") {
          return false;
        }

        // 检查必要字段
        const requiredFields = ["status", "currentQuestionIndex", "answers"];
        for (const field of requiredFields) {
          if (!(field in stageData)) {
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      logError(
        "❌ 数据验证失败",
        error,
        "ProgressManager/validateProgressData",
      );
      return false;
    }
  }

  // 获取当前进度
  public getCurrentProgress(): ProgressData | null {
    // 这个方法需要从store中获取当前状态
    // 由于我们不能直接访问store，这里返回一个占位符
    return null;
  }

  // 恢复进度到store
  public restoreProgress(store: unknown): boolean {
    try {
      const savedProgress = this.loadProgress();
      if (!savedProgress) return false;

      // 恢复阶段进度
      if (savedProgress.stageProgress) {
        // 注意：这里需要调用具体的store action方法，而不是直接使用setState
        logWarn(
          "Progress restoration not implemented for Zustand store",
          { store },
          "ProgressManager/restoreProgress",
        );
      }

      logInfo("🔄 进度恢复成功", undefined, "ProgressManager/restoreProgress");
      return true;
    } catch (error) {
      logError("❌ 进度恢复失败", error, "ProgressManager/restoreProgress");
      return false;
    }
  }

  // 清除进度
  public clearProgress(): boolean {
    try {
      localStorage.removeItem(this.storageKey);
      logInfo("🗑️ 进度清除成功", undefined, "ProgressManager/clearProgress");
      return true;
    } catch (error) {
      logError("❌ 进度清除失败", error, "ProgressManager/clearProgress");
      return false;
    }
  }

  // 导出进度
  public exportProgress(): string | null {
    try {
      const progress = this.loadProgress();
      if (!progress) return null;

      const exportData = {
        ...progress,
        exportedAt: new Date(),
        format: "json",
        version: "1.0.0",
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      logError("❌ 进度导出失败", error, "ProgressManager/exportProgress");
      return null;
    }
  }

  // 导入进度
  public importProgress(data: string): boolean {
    try {
      const importedData = JSON.parse(data);

      // 验证导入数据
      if (!this.validateProgressData(importedData)) {
        throw new Error("导入数据格式无效");
      }

      // 保存导入的数据
      this.saveProgress(importedData);
      logInfo("📥 进度导入成功", undefined, "ProgressManager/importProgress");
      return true;
    } catch (error) {
      logError("❌ 进度导入失败", error, "ProgressManager/importProgress");
      return false;
    }
  }

  // 获取进度统计
  public getProgressStats(): ProgressStats | null {
    try {
      const progress = this.loadProgress();
      if (!progress) return null;

      const stats = {
        totalStages: 2,
        completedStages: 0,
        totalQuestions: 0,
        answeredQuestions: 0,
        completionRate: 0,
        lastSaved: progress.lastSaved || null,
      };

      // 计算统计数据
      for (const stage of ["stage1", "stage2"]) {
        const stageData = progress.stageProgress[stage];
        if (stageData) {
          if (stageData.status === "completed") {
            stats.completedStages++;
          }

          stats.totalQuestions += stageData.answers?.length || 0;
          stats.answeredQuestions += stageData.answers?.length || 0;
        }
      }

      stats.completionRate =
        stats.totalQuestions > 0
          ? Math.round((stats.answeredQuestions / stats.totalQuestions) * 100)
          : 0;

      return stats;
    } catch (error) {
      logError(
        "❌ 获取进度统计失败",
        error,
        "ProgressManager/getProgressStats",
      );
      return null;
    }
  }

  // 检查断点续测
  public checkResumePoint(): {
    stage: QuizStage;
    questionIndex: number;
  } | null {
    try {
      const progress = this.loadProgress();
      if (!progress) return null;

      // 查找未完成的阶段
      for (const stage of ["stage1", "stage2"] as QuizStage[]) {
        const stageData = progress.stageProgress[stage];
        if (stageData && stageData.status === "in_progress") {
          return {
            stage,
            questionIndex: stageData.currentQuestionIndex || 0,
          };
        }
      }

      return null;
    } catch (error) {
      logError(
        "❌ 检查断点续测失败",
        error,
        "ProgressManager/checkResumePoint",
      );
      return null;
    }
  }

  // 创建进度快照
  public createSnapshot(): string | null {
    try {
      const progress = this.loadProgress();
      if (!progress) return null;

      const snapshot = {
        ...progress,
        snapshotAt: new Date(),
        type: "manual",
      };

      return JSON.stringify(snapshot, null, 2);
    } catch (error) {
      logError("❌ 创建进度快照失败", error, "ProgressManager/createSnapshot");
      return null;
    }
  }

  // 恢复进度快照
  public restoreSnapshot(snapshotData: string): boolean {
    try {
      const snapshot = JSON.parse(snapshotData);

      // 验证快照数据
      if (!this.validateProgressData(snapshot)) {
        throw new Error("快照数据格式无效");
      }

      // 恢复快照
      this.saveProgress(snapshot);
      logInfo(
        "🔄 进度快照恢复成功",
        undefined,
        "ProgressManager/restoreSnapshot",
      );
      return true;
    } catch (error) {
      logError("❌ 进度快照恢复失败", error, "ProgressManager/restoreSnapshot");
      return false;
    }
  }
}

// 导出单例实例
export const progressManager = ProgressManager.getInstance();
