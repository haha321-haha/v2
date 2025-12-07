"use client";

import React from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import { Locale } from "../types/common";
import { QuizAnswer, QuizResult } from "../types/quiz";
import { TrainingSession } from "../types/training";
import { logError, logInfo, logWarn } from "@/lib/debug-logger";

// 测试阶段类型定义
export type QuizStage = "stage1" | "stage2" | "stage3" | "stage4";
export type QuizStageStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "locked";
export type StageType = "quiz" | "training" | "guidance";

interface StageProgress {
  status: QuizStageStatus;
  currentQuestionIndex: number;
  answers: (QuizAnswer | null)[];
  result: QuizResult | null;
  completedAt: Date | null;
  timeSpent: number; // 毫秒
}

export interface PartnerHandbookState {
  // 数据版本控制
  dataVersion: string;

  // 语言设置
  currentLanguage: Locale;

  // 多阶段测试状态
  currentStage: QuizStage;
  stageProgress: Record<QuizStage, StageProgress>;

  // 综合测试结果
  overallResult: {
    stage1Score: number;
    stage2Score: number | null;
    combinedLevel: "beginner" | "intermediate" | "advanced" | "expert" | null;
    recommendations: string[];
    completedAt: Date | null;
  } | null;

  // 训练计划相关状态
  trainingProgress: Record<string, boolean>;
  completedDays: string[];
  currentDay: number;
  trainingSessions: TrainingSession[];

  // 用户偏好设置
  userPreferences: {
    notifications: boolean;
    reminderTime: string;
    difficulty: "easy" | "medium" | "hard";
    autoAdvance: boolean;
    preferredStage: QuizStage | "auto";
  };

  // 时间戳
  lastVisitDate: Date | null;
  createdAt: Date;
}

interface PartnerHandbookActions {
  // 语言管理
  setLanguage: (lang: Locale) => void;

  // 多阶段测试管理
  setCurrentStage: (stage: QuizStage) => void;
  startStage: (stage: QuizStage) => void;
  setStageAnswer: (stage: QuizStage, index: number, answer: QuizAnswer) => void;
  nextStageQuestion: (stage: QuizStage) => void;
  completeStage: (stage: QuizStage, result: QuizResult) => void;
  resetStage: (stage: QuizStage) => void;
  resetAllStages: () => void;

  // 清除所有测试数据
  clearAllTestData: () => void;

  // 阶段解锁管理
  unlockStage: (stage: QuizStage) => void;
  isStageUnlocked: (stage: QuizStage) => boolean;
  getNextAvailableStage: () => QuizStage | null;

  // 综合结果管理
  calculateOverallResult: () => void;
  getCombinedRecommendations: () => string[];

  // 训练计划管理
  completeTraining: (day: string) => void;
  startTrainingSession: (dayId: string) => void;
  endTrainingSession: (dayId: string, notes?: string, rating?: number) => void;
  resetTraining: () => void;

  // 用户偏好管理
  updatePreferences: (
    preferences: Partial<PartnerHandbookState["userPreferences"]>,
  ) => void;

  // 工具方法
  getStageScore: (stage: QuizStage) => number;
  getStageProgress: (stage: QuizStage) => number;
  getTrainingProgress: () => number;
  getCurrentStreak: () => number;
  getLongestStreak: () => number;
  getCompletionRate: () => number;

  // 数据管理
  clearAllData: () => void;
  exportData: () => string;
  importData: (data: string) => void;

  // 阶段初始化
  initializeMissingStages: () => void;
}

type PartnerHandbookStore = PartnerHandbookState & PartnerHandbookActions;

const createDefaultStageProgress = (): StageProgress => ({
  status: "not_started",
  currentQuestionIndex: 0,
  answers: [],
  result: null,
  completedAt: null,
  timeSpent: 0,
});

// 数据迁移函数
const migrateData = (
  state: Partial<PartnerHandbookState> & {
    stageProgress?: PartnerHandbookState["stageProgress"];
    dataVersion?: string;
    currentLanguage?: Locale;
  },
): PartnerHandbookState => {
  const currentVersion = "2.0.1"; // 当前数据版本

  // 如果没有版本信息，说明是旧数据，需要重置
  if (!state.dataVersion) {
    logInfo(
      "🔄 Migrating old data to new version...",
      undefined,
      "partnerHandbookStore/migrateData",
    );
    return {
      ...defaultState,
      dataVersion: currentVersion,
      currentLanguage: state.currentLanguage || "zh",
    };
  }

  // 如果版本不匹配，也需要重置
  if (state.dataVersion !== currentVersion) {
    logInfo(
      "🔄 Migrating data from version",
      { from: state.dataVersion, to: currentVersion },
      "partnerHandbookStore/migrateData",
    );
    return {
      ...defaultState,
      dataVersion: currentVersion,
      currentLanguage: state.currentLanguage || "zh",
    };
  }

  // 额外检查：如果stage1的测试结果数据异常，强制重置
  if (state.stageProgress?.stage1?.result?.totalScore > 5) {
    logInfo(
      "🔄 Detected invalid stage1 result data, resetting...",
      undefined,
      "partnerHandbookStore/migrateData",
    );
    return {
      ...defaultState,
      dataVersion: currentVersion,
      currentLanguage: state.currentLanguage || "zh",
    };
  }

  return state as PartnerHandbookState;
};

const defaultState: PartnerHandbookState = {
  dataVersion: "2.0.1",
  currentLanguage: "zh",
  currentStage: "stage1",
  stageProgress: {
    stage1: createDefaultStageProgress(),
    stage2: { ...createDefaultStageProgress(), status: "locked" },
    stage3: { ...createDefaultStageProgress(), status: "locked" },
    stage4: { ...createDefaultStageProgress(), status: "locked" },
  },
  overallResult: null,
  trainingProgress: {},
  completedDays: [],
  currentDay: 1,
  trainingSessions: [],
  userPreferences: {
    notifications: true,
    reminderTime: "09:00",
    difficulty: "medium",
    autoAdvance: true,
    preferredStage: "auto",
  },
  lastVisitDate: null,
  createdAt: new Date(),
};

export const usePartnerHandbookStore = create<PartnerHandbookStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...defaultState,

        // 语言管理
        setLanguage: (lang) => {
          set({ currentLanguage: lang });
        },

        // 多阶段测试管理
        setCurrentStage: (stage) => {
          set({ currentStage: stage });
        },

        // 初始化缺失的阶段
        initializeMissingStages: () => {
          set((state) => {
            const newStageProgress = { ...state.stageProgress };
            let hasChanges = false;

            const stages: QuizStage[] = [
              "stage1",
              "stage2",
              "stage3",
              "stage4",
            ];
            stages.forEach((stage) => {
              if (!newStageProgress[stage]) {
                const defaultProgress = createDefaultStageProgress();
                if (stage === "stage1") {
                  defaultProgress.status = "not_started";
                } else {
                  defaultProgress.status = "locked";
                }
                newStageProgress[stage] = defaultProgress;
                hasChanges = true;
                logInfo(
                  `✅ Initialized missing stage: ${stage}`,
                  undefined,
                  "partnerHandbookStore/initializeMissingStages",
                );
              }
            });

            return hasChanges ? { stageProgress: newStageProgress } : state;
          });
        },

        startStage: (stage) => {
          set((state) => ({
            stageProgress: {
              ...state.stageProgress,
              [stage]: {
                ...state.stageProgress[stage],
                status: "in_progress",
                currentQuestionIndex: 0,
                answers: [],
                timeSpent: 0,
              },
            },
            currentStage: stage,
          }));
        },

        setStageAnswer: (stage, index, answer) => {
          set((state) => {
            const currentAnswers = state.stageProgress[stage]?.answers || [];
            const newAnswers = [...currentAnswers];

            // 调试信息：打印保存过程
            logInfo(
              "🔍 Debug - setStageAnswer",
              {
                stage,
                index,
                answerId: answer.questionId,
                currentAnswersLength: currentAnswers.length,
                newAnswersLength: newAnswers.length,
              },
              "partnerHandbookStore/setStageAnswer",
            );

            // 根据阶段确定题目数量，确保数组有正确的长度
            const questionCount = stage === "stage1" ? 5 : 10;
            while (newAnswers.length < questionCount) {
              newAnswers.push(null);
            }

            // 设置指定索引的答案
            newAnswers[index] = answer;

            // 调试信息：打印保存后的数组
            logInfo(
              "🔍 Debug - After saving",
              {
                newAnswersLength: newAnswers.length,
                savedAnswers: newAnswers.map((ans, idx) =>
                  ans
                    ? {
                        index: idx,
                        questionId: ans.questionId,
                        score: ans.score,
                      }
                    : { index: idx, questionId: null },
                ),
              },
              "partnerHandbookStore/setStageAnswer",
            );

            return {
              stageProgress: {
                ...state.stageProgress,
                [stage]: {
                  ...state.stageProgress[stage],
                  answers: newAnswers,
                },
              },
            };
          });
        },

        nextStageQuestion: (stage) => {
          set((state) => {
            const currentStageProgress = state.stageProgress[stage];
            if (!currentStageProgress) {
              logWarn(
                `Cannot move to next question: stage ${stage} not found`,
                undefined,
                "partnerHandbookStore/nextStageQuestion",
              );
              return state;
            }

            return {
              stageProgress: {
                ...state.stageProgress,
                [stage]: {
                  ...currentStageProgress,
                  currentQuestionIndex:
                    currentStageProgress.currentQuestionIndex + 1,
                },
              },
            };
          });
        },

        completeStage: (stage, result) => {
          set((state) => {
            const currentStageProgress = state.stageProgress[stage];
            if (!currentStageProgress) {
              logWarn(
                `Cannot complete stage: stage ${stage} not found`,
                undefined,
                "partnerHandbookStore/completeStage",
              );
              return state;
            }

            return {
              stageProgress: {
                ...state.stageProgress,
                [stage]: {
                  ...currentStageProgress,
                  status: "completed",
                  result,
                  completedAt: new Date(),
                },
              },
              lastVisitDate: new Date(),
            };
          });

          // 自动解锁下一阶段
          if (stage === "stage1") {
            get().unlockStage("stage2");
          }

          // 重新计算综合结果
          get().calculateOverallResult();
        },

        resetStage: (stage) => {
          set((state) => ({
            stageProgress: {
              ...state.stageProgress,
              [stage]: createDefaultStageProgress(),
            },
          }));
        },

        resetAllStages: () => {
          set(() => ({
            stageProgress: {
              stage1: createDefaultStageProgress(),
              stage2: { ...createDefaultStageProgress(), status: "locked" },
              stage3: { ...createDefaultStageProgress(), status: "locked" },
              stage4: { ...createDefaultStageProgress(), status: "locked" },
            },
            overallResult: null,
            currentStage: "stage1",
          }));
        },

        clearAllTestData: () => {
          // 清除localStorage中的测试数据
          try {
            localStorage.removeItem("partner-handbook-storage");
            logInfo(
              "🧹 已清除所有测试数据",
              undefined,
              "partnerHandbookStore/clearAllTestData",
            );
          } catch (error) {
            logError(
              "清除测试数据失败",
              error,
              "partnerHandbookStore/clearAllTestData",
            );
          }

          // 重置状态到初始值
          set({
            dataVersion: "1.0.0",
            currentLanguage: "zh",
            currentStage: "stage1",
            stageProgress: {
              stage1: createDefaultStageProgress(),
              stage2: { ...createDefaultStageProgress(), status: "locked" },
              stage3: { ...createDefaultStageProgress(), status: "locked" },
              stage4: { ...createDefaultStageProgress(), status: "locked" },
            },
            overallResult: null,
            trainingProgress: {},
            completedDays: [],
            currentDay: 1,
            trainingSessions: [],
            userPreferences: {
              notifications: true,
              reminderTime: "09:00",
              difficulty: "medium",
              autoAdvance: true,
              preferredStage: "auto",
            },
          });
        },

        // 阶段解锁管理
        unlockStage: (stage) => {
          set((state) => {
            const currentStageProgress = state.stageProgress[stage];
            if (!currentStageProgress) {
              logWarn(
                `Cannot unlock stage ${stage}: stage not found`,
                undefined,
                "partnerHandbookStore/unlockStage",
              );
              return state;
            }

            return {
              stageProgress: {
                ...state.stageProgress,
                [stage]: {
                  ...currentStageProgress,
                  status:
                    currentStageProgress.status === "locked"
                      ? "not_started"
                      : currentStageProgress.status,
                },
              },
            };
          });
        },

        isStageUnlocked: (stage) => {
          const state = get();
          const stageProgress = state.stageProgress[stage];

          // 如果阶段不存在，返回false（锁定状态），不在这里初始化
          if (!stageProgress) {
            logWarn(
              `Stage ${stage} not found in stageProgress`,
              undefined,
              "partnerHandbookStore/isStageUnlocked",
            );
            return false;
          }

          return stageProgress.status !== "locked";
        },

        getNextAvailableStage: () => {
          const state = get();
          const stages: QuizStage[] = ["stage1", "stage2", "stage3", "stage4"];

          for (const stage of stages) {
            const stageProgress = state.stageProgress[stage];
            if (
              stageProgress &&
              (stageProgress.status === "not_started" ||
                stageProgress.status === "in_progress")
            ) {
              return stage;
            }
          }
          return null;
        },

        // 综合结果管理
        calculateOverallResult: () => {
          const state = get();
          const stage1Result = state.stageProgress.stage1?.result;
          const stage2Result = state.stageProgress.stage2?.result;

          if (!stage1Result) return;

          const stage1Score = stage1Result.percentage;
          const stage2Score = stage2Result?.percentage || null;

          // 计算综合等级
          let combinedLevel:
            | "beginner"
            | "intermediate"
            | "advanced"
            | "expert";
          if (stage2Score !== null) {
            // 如果有第二阶段结果，使用加权平均
            const combinedScore = stage1Score * 0.3 + stage2Score * 0.7;
            if (combinedScore < 40) combinedLevel = "beginner";
            else if (combinedScore < 60) combinedLevel = "intermediate";
            else if (combinedScore < 80) combinedLevel = "advanced";
            else combinedLevel = "expert";
          } else {
            // 只有第一阶段结果
            if (stage1Score < 40) combinedLevel = "beginner";
            else if (stage1Score < 60) combinedLevel = "intermediate";
            else if (stage1Score < 80) combinedLevel = "advanced";
            else combinedLevel = "expert";
          }

          // 生成综合建议
          const recommendations = get().getCombinedRecommendations();

          set({
            overallResult: {
              stage1Score,
              stage2Score,
              combinedLevel,
              recommendations,
              completedAt: new Date(),
            },
          });
        },

        getCombinedRecommendations: () => {
          const state = get();
          const stage1Result = state.stageProgress.stage1?.result;
          const stage2Result = state.stageProgress.stage2?.result;

          const recommendations: string[] = [];

          if (stage1Result && Array.isArray(stage1Result.recommendations)) {
            recommendations.push(...stage1Result.recommendations);
          }

          if (stage2Result && Array.isArray(stage2Result.recommendations)) {
            recommendations.push(...stage2Result.recommendations);
          }

          // 去重并返回
          return [...new Set(recommendations)];
        },

        // 训练计划管理
        completeTraining: (day) => {
          set((state) => {
            const newCompletedDays = [...state.completedDays];
            if (!newCompletedDays.includes(day)) {
              newCompletedDays.push(day);
            }

            return {
              trainingProgress: {
                ...state.trainingProgress,
                [day]: true,
              },
              completedDays: newCompletedDays,
              currentDay: Math.max(
                state.currentDay,
                parseInt(day.replace("day", "")) + 1,
              ),
              lastVisitDate: new Date(),
            };
          });
        },

        startTrainingSession: (dayId) => {
          const session: TrainingSession = {
            dayId,
            startTime: new Date(),
            completedTasks: [],
          };

          set((state) => ({
            trainingSessions: [...state.trainingSessions, session],
          }));
        },

        endTrainingSession: (dayId, notes, rating) => {
          set((state) => ({
            trainingSessions: state.trainingSessions.map((session) =>
              session.dayId === dayId
                ? {
                    ...session,
                    endTime: new Date(),
                    notes,
                    rating,
                  }
                : session,
            ),
          }));
        },

        resetTraining: () => {
          set({
            trainingProgress: {},
            completedDays: [],
            currentDay: 1,
            trainingSessions: [],
          });
        },

        // 用户偏好管理
        updatePreferences: (preferences) => {
          set((state) => ({
            userPreferences: {
              ...state.userPreferences,
              ...preferences,
            },
          }));
        },

        // 工具方法
        getStageScore: (stage) => {
          const state = get();
          return state.stageProgress[stage].result?.totalScore || 0;
        },

        getStageProgress: (stage) => {
          const state = get();
          const stageData = state.stageProgress[stage];
          if (stageData.status === "completed") return 100;
          if (stageData.status === "not_started") return 0;

          // 假设每个阶段有固定数量的题目
          const totalQuestions = stage === "stage1" ? 5 : 10;
          return Math.round(
            (stageData.currentQuestionIndex / totalQuestions) * 100,
          );
        },

        getTrainingProgress: () => {
          const state = get();
          const totalDays = 30; // 30天训练计划
          return Math.round((state.completedDays.length / totalDays) * 100);
        },

        getCurrentStreak: () => {
          const state = get();
          const sortedDays = state.completedDays
            .map((day) => parseInt(day.replace("day", "")))
            .sort((a, b) => a - b);

          if (sortedDays.length === 0) return 0;

          let streak = 1;
          for (let i = sortedDays.length - 1; i > 0; i--) {
            if (sortedDays[i] - sortedDays[i - 1] === 1) {
              streak++;
            } else {
              break;
            }
          }

          return streak;
        },

        getLongestStreak: () => {
          const state = get();
          const sortedDays = state.completedDays
            .map((day) => parseInt(day.replace("day", "")))
            .sort((a, b) => a - b);

          if (sortedDays.length === 0) return 0;

          let longestStreak = 1;
          let currentStreak = 1;

          for (let i = 1; i < sortedDays.length; i++) {
            if (sortedDays[i] - sortedDays[i - 1] === 1) {
              currentStreak++;
            } else {
              longestStreak = Math.max(longestStreak, currentStreak);
              currentStreak = 1;
            }
          }

          return Math.max(longestStreak, currentStreak);
        },

        getCompletionRate: () => {
          const state = get();
          const totalSessions = state.trainingSessions.length;
          const completedSessions = state.trainingSessions.filter(
            (session) => session.endTime !== undefined,
          ).length;

          return totalSessions > 0
            ? Math.round((completedSessions / totalSessions) * 100)
            : 0;
        },

        // 数据管理
        clearAllData: () => {
          set({
            ...defaultState,
            createdAt: new Date(),
          });
        },

        exportData: () => {
          const state = get();
          const exportData = {
            stageProgress: state.stageProgress,
            overallResult: state.overallResult,
            trainingProgress: state.trainingProgress,
            completedDays: state.completedDays,
            trainingSessions: state.trainingSessions,
            userPreferences: state.userPreferences,
            exportDate: new Date().toISOString(),
          };

          return JSON.stringify(exportData, null, 2);
        },

        importData: (data) => {
          try {
            const importedData = JSON.parse(data);

            set((state) => ({
              ...state,
              stageProgress: importedData.stageProgress || state.stageProgress,
              overallResult: importedData.overallResult || null,
              trainingProgress: importedData.trainingProgress || {},
              completedDays: importedData.completedDays || [],
              trainingSessions: importedData.trainingSessions || [],
              userPreferences: {
                ...state.userPreferences,
                ...importedData.userPreferences,
              },
            }));
          } catch (error) {
            logError(
              "Failed to import data",
              error,
              "partnerHandbookStore/importData",
            );
          }
        },
      }),
      {
        name: "partner-handbook-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          dataVersion: state.dataVersion,
          currentLanguage: state.currentLanguage,
          currentStage: state.currentStage,
          stageProgress: state.stageProgress,
          overallResult: state.overallResult,
          trainingProgress: state.trainingProgress,
          completedDays: state.completedDays,
          currentDay: state.currentDay,
          trainingSessions: state.trainingSessions,
          userPreferences: state.userPreferences,
          lastVisitDate: state.lastVisitDate,
          createdAt: state.createdAt,
        }),
      },
    ),
    {
      name: "partner-handbook-store",
      migrate: migrateData,
      version: 0,
    },
  ),
);

// 选择器hooks，用于优化性能
export const useStageState = (stage: QuizStage) => {
  const stageProgress = usePartnerHandbookStore(
    (state) => state.stageProgress[stage],
  );
  const currentStage = usePartnerHandbookStore((state) => state.currentStage);
  const initializeMissingStages = usePartnerHandbookStore(
    (state) => state.initializeMissingStages,
  );

  // 使用useEffect来处理初始化，避免在渲染期间调用setState
  React.useEffect(() => {
    if (!stageProgress) {
      logWarn(
        `Stage ${stage} not found in stageProgress, initializing...`,
        undefined,
        "partnerHandbookStore/useStageState",
      );
      initializeMissingStages();
    }
  }, [stageProgress, stage, initializeMissingStages]);

  // 如果stageProgress不存在，返回默认值
  if (!stageProgress) {
    return {
      ...createDefaultStageProgress(),
      isCurrentStage: currentStage === stage,
    };
  }

  return {
    ...stageProgress,
    isCurrentStage: currentStage === stage,
  };
};

export const useAllStagesState = () => {
  const stageProgress = usePartnerHandbookStore((state) => state.stageProgress);
  const currentStage = usePartnerHandbookStore((state) => state.currentStage);
  const overallResult = usePartnerHandbookStore((state) => state.overallResult);

  return {
    stageProgress,
    currentStage,
    overallResult,
  };
};

export const useStageActions = () => {
  const setCurrentStage = usePartnerHandbookStore(
    (state) => state.setCurrentStage,
  );
  const startStage = usePartnerHandbookStore((state) => state.startStage);
  const setStageAnswer = usePartnerHandbookStore(
    (state) => state.setStageAnswer,
  );
  const nextStageQuestion = usePartnerHandbookStore(
    (state) => state.nextStageQuestion,
  );
  const completeStage = usePartnerHandbookStore((state) => state.completeStage);
  const resetStage = usePartnerHandbookStore((state) => state.resetStage);
  const resetAllStages = usePartnerHandbookStore(
    (state) => state.resetAllStages,
  );
  const clearAllTestData = usePartnerHandbookStore(
    (state) => state.clearAllTestData,
  );
  const unlockStage = usePartnerHandbookStore((state) => state.unlockStage);
  const isStageUnlocked = usePartnerHandbookStore(
    (state) => state.isStageUnlocked,
  );
  const getNextAvailableStage = usePartnerHandbookStore(
    (state) => state.getNextAvailableStage,
  );
  const initializeMissingStages = usePartnerHandbookStore(
    (state) => state.initializeMissingStages,
  );

  return {
    setCurrentStage,
    startStage,
    setStageAnswer,
    nextStageQuestion,
    completeStage,
    resetStage,
    resetAllStages,
    clearAllTestData,
    unlockStage,
    isStageUnlocked,
    getNextAvailableStage,
    initializeMissingStages,
  };
};

export const useTrainingState = () => {
  const progress = usePartnerHandbookStore((state) => state.trainingProgress);
  const completedDays = usePartnerHandbookStore((state) => state.completedDays);
  const currentDay = usePartnerHandbookStore((state) => state.currentDay);
  const sessions = usePartnerHandbookStore((state) => state.trainingSessions);

  return {
    progress,
    completedDays,
    currentDay,
    sessions,
  };
};

export const useUserPreferences = () => {
  const preferences = usePartnerHandbookStore((state) => state.userPreferences);
  const updatePreferences = usePartnerHandbookStore(
    (state) => state.updatePreferences,
  );

  return {
    preferences,
    updatePreferences,
  };
};
