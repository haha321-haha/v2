/**
 * 进度保存Hook
 * 提供断点续测、自动保存等功能
 */

import { useEffect, useCallback, useRef } from "react";
import { usePartnerHandbookStore } from "../stores/partnerHandbookStore";
import { progressManager } from "../utils/progressManager";
import { logError, logInfo } from "@/lib/debug-logger";
import type { QuizStage, StageProgress, QuizResult } from "../types/quiz";

export const useProgressSave = () => {
  const store = usePartnerHandbookStore();
  const lastSaveTime = useRef<Date>(new Date());
  const isSaving = useRef<boolean>(false);

  // 保存进度
  const saveProgress = useCallback(async () => {
    if (isSaving.current) return;

    try {
      isSaving.current = true;

      // 使用选择器获取当前状态
      // 注意：ProgressData 接口期望的类型与 store 中的类型略有不同
      const currentState = {
        stageProgress: store.stageProgress as Record<QuizStage, StageProgress>,
        overallResult: store.overallResult
          ? ({
              totalScore:
                store.overallResult.stage1Score +
                (store.overallResult.stage2Score || 0),
              maxScore: 100, // 假设最大分数
              percentage: 0,
              level: store.overallResult.combinedLevel || "beginner",
              title: "",
              feedback: "",
              recommendations: store.overallResult.recommendations,
              completedAt: store.overallResult.completedAt || new Date(),
              timeSpent: 0,
            } as QuizResult)
          : null,
        userPreferences: store.userPreferences as Record<string, unknown>,
        lastSaved: new Date().toISOString(),
        version: store.dataVersion,
      };
      const success = progressManager.saveProgress(currentState);

      if (success) {
        lastSaveTime.current = new Date();
        logInfo("💾 进度保存成功", undefined, "useProgressSave/saveProgress");
      }
    } catch (error) {
      logError("❌ 进度保存失败", error, "useProgressSave/saveProgress");
    } finally {
      isSaving.current = false;
    }
  }, [store]);

  // 加载进度
  const loadProgress = useCallback(() => {
    try {
      const success = progressManager.restoreProgress(store);
      if (success) {
        logInfo("📂 进度加载成功", undefined, "useProgressSave/loadProgress");
        return true;
      }
    } catch (error) {
      logError("❌ 进度加载失败", error, "useProgressSave/loadProgress");
    }
    return false;
  }, [store]);

  // 清除进度
  const clearProgress = useCallback(() => {
    try {
      const success = progressManager.clearProgress();
      if (success) {
        // 重置store状态
        store.resetAllStages();
        logInfo("🗑️ 进度清除成功", undefined, "useProgressSave/clearProgress");
      }
      return success;
    } catch (error) {
      logError("❌ 进度清除失败", error, "useProgressSave/clearProgress");
      return false;
    }
  }, [store]);

  // 检查断点续测
  const checkResumePoint = useCallback(() => {
    try {
      const resumePoint = progressManager.checkResumePoint();
      if (resumePoint) {
        logInfo(
          "🔄 发现断点续测点",
          { resumePoint },
          "useProgressSave/checkResumePoint",
        );
        return resumePoint;
      }
    } catch (error) {
      logError(
        "❌ 检查断点续测失败",
        error,
        "useProgressSave/checkResumePoint",
      );
    }
    return null;
  }, []);

  // 导出进度
  const exportProgress = useCallback(() => {
    try {
      const exportData = progressManager.exportProgress();
      if (exportData) {
        // 创建下载链接
        const blob = new Blob([exportData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `partner-handbook-progress-${
          new Date().toISOString().split("T")[0]
        }.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        logInfo("📤 进度导出成功", undefined, "useProgressSave/exportProgress");
        return true;
      }
    } catch (error) {
      logError("❌ 进度导出失败", error, "useProgressSave/exportProgress");
    }
    return false;
  }, []);

  // 导入进度
  const importProgress = useCallback(
    (file: File) => {
      return new Promise<boolean>((resolve) => {
        try {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const content = e.target?.result as string;
              const success = progressManager.importProgress(content);
              if (success) {
                // 重新加载进度到store
                loadProgress();
                logInfo(
                  "📥 进度导入成功",
                  undefined,
                  "useProgressSave/importProgress",
                );
              }
              resolve(success);
            } catch (error) {
              logError(
                "❌ 进度导入失败",
                error,
                "useProgressSave/importProgress",
              );
              resolve(false);
            }
          };
          reader.onerror = () => {
            logError(
              "❌ 文件读取失败",
              undefined,
              "useProgressSave/importProgress",
            );
            resolve(false);
          };
          reader.readAsText(file);
        } catch (error) {
          logError("❌ 进度导入失败", error, "useProgressSave/importProgress");
          resolve(false);
        }
      });
    },
    [loadProgress],
  );

  // 获取进度统计
  const getProgressStats = useCallback(() => {
    try {
      return progressManager.getProgressStats();
    } catch (error) {
      logError(
        "❌ 获取进度统计失败",
        error,
        "useProgressSave/getProgressStats",
      );
      return null;
    }
  }, []);

  // 创建进度快照
  const createSnapshot = useCallback(() => {
    try {
      return progressManager.createSnapshot();
    } catch (error) {
      logError("❌ 创建进度快照失败", error, "useProgressSave/createSnapshot");
      return null;
    }
  }, []);

  // 恢复进度快照
  const restoreSnapshot = useCallback(
    (snapshotData: string) => {
      try {
        const success = progressManager.restoreSnapshot(snapshotData);
        if (success) {
          loadProgress();
          logInfo(
            "🔄 进度快照恢复成功",
            undefined,
            "useProgressSave/restoreSnapshot",
          );
        }
        return success;
      } catch (error) {
        logError(
          "❌ 进度快照恢复失败",
          error,
          "useProgressSave/restoreSnapshot",
        );
        return false;
      }
    },
    [loadProgress],
  );

  // 监听状态变化，自动保存
  useEffect(() => {
    // 注意：Zustand store不支持直接的subscribe方法
    // 这里使用定时器来定期检查状态变化
    const interval = setInterval(() => {
      const now = new Date();
      const timeSinceLastSave = now.getTime() - lastSaveTime.current.getTime();

      // 如果距离上次保存超过30秒，则保存
      if (timeSinceLastSave > 30000) {
        saveProgress();
      }
    }, 10000); // 每10秒检查一次

    return () => {
      clearInterval(interval);
    };
  }, [saveProgress]);

  // 页面卸载时保存进度
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProgress();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [saveProgress]);

  // 页面可见性变化时保存进度
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveProgress();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [saveProgress]);

  return {
    saveProgress,
    loadProgress,
    clearProgress,
    checkResumePoint,
    exportProgress,
    importProgress,
    getProgressStats,
    createSnapshot,
    restoreSnapshot,
  };
};
