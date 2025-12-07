/**
 * HVsLYEp职场健康助手 - Zustand状态管理
 * 基于HVsLYEp的appState结构设计
 */

"use client";

import {
  create,
  useStore,
  type Mutate,
  type StoreApi as ZustandStoreApi,
  type UseBoundStore,
  type StateCreator,
} from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  WorkplaceWellnessState,
  CalendarState,
  WorkImpactData,
  NutritionData,
  ExportConfig,
  PainLevel,
  MenstrualPhase,
  HolisticHealthConstitution,
  ExportType,
  ExportFormat,
  ExtendedExportFormat,
  // Day 11: 新增类型导入
  UserPreferences,
  ExportTemplate,
  BatchExportQueue,
  BatchExportItem,
  ExportHistory,
  SystemSettings,
  Theme,
  FontSize,
  SettingsValidationResult,
  PreferenceChange,
  PeriodRecord,
  RecommendationFeedback,
  RecommendationFeedbackHistory,
  // Phase 2: 评估相关类型
  AssessmentRecord,
  AssessmentHistory,
} from "../types";
import type { AssessmentAnalyticsRecord } from "../../shared/types";
import type { RecommendationFeedbackAction } from "../types/recommendation";
import { logError, logInfo, logWarn } from "@/lib/debug-logger";

// Day 11: 导入默认值
import {
  DEFAULT_USER_PREFERENCES,
  DEFAULT_EXPORT_TEMPLATES,
  DEFAULT_SYSTEM_SETTINGS,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_ACCESSIBILITY_SETTINGS,
} from "../types/defaults";
import { mockPeriodData } from "../data";

// 扩展状态接口，添加Actions
export interface WorkplaceWellnessStore extends WorkplaceWellnessState {
  // 标签页相关Actions
  setActiveTab: (
    tab:
      | "calendar"
      | "focus-calm"
      | "nutrition"
      | "energy"
      | "export"
      | "settings"
      | "assessment"
      | "recommendations"
      | "tracking"
      | "analytics"
      | "work-impact"
      | "analysis",
  ) => void;

  // 日历相关Actions
  updateCalendar: (updates: Partial<CalendarState>) => void;
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date | null) => void;
  toggleAddForm: () => void;
  addPeriodRecord: (record: PeriodRecord) => void;
  updatePeriodRecord: (date: string, record: Partial<PeriodRecord>) => void;
  deletePeriodRecord: (date: string) => void;

  // 工作影响相关Actions
  updateWorkImpact: (updates: Partial<WorkImpactData>) => void;
  setPainLevel: (level: number) => void;
  setEfficiency: (efficiency: number) => void;
  selectTemplate: (templateId: number | null) => void;

  // 营养相关Actions
  updateNutrition: (updates: Partial<NutritionData>) => void;
  setSelectedPhase: (phase: string) => void;
  setConstitutionType: (type: string) => void;
  setSearchTerm: (term: string) => void;

  // 导出相关Actions
  updateExport: (updates: Partial<ExportConfig>) => void;
  setExportType: (type: string) => void;
  setExportFormat: (format: string) => void;
  setExporting: (exporting: boolean) => void;

  // 工具方法
  resetState: () => void;
  getStateSnapshot: () => Partial<WorkplaceWellnessState>;

  // Day 11: 用户偏好设置相关Actions
  updateUserPreferences: (updates: Partial<UserPreferences>) => void;
  setTheme: (theme: Theme) => void;
  setFontSize: (fontSize: FontSize) => void;
  toggleAnimations: () => void;
  toggleCompactMode: () => void;
  updateNotificationSettings: (
    updates: Partial<UserPreferences["notifications"]>,
  ) => void;
  updatePrivacySettings: (updates: Partial<UserPreferences["privacy"]>) => void;
  updateAccessibilitySettings: (
    updates: Partial<UserPreferences["accessibility"]>,
  ) => void;
  validateSettings: () => SettingsValidationResult;
  resetPreferences: () => void;

  // Phase 2: 评估历史相关Actions
  addAssessmentResult: (record: AssessmentRecord) => void;
  getAssessmentHistory: () => AssessmentHistory;
  getAssessmentByDate: (date: string) => AssessmentRecord | null;
  clearAssessmentHistory: () => void;
  migrateAssessmentsFromLocalStorage: () => void;

  // Day 11: 导出模板相关Actions
  addExportTemplate: (
    template: Omit<ExportTemplate, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateExportTemplate: (id: string, updates: Partial<ExportTemplate>) => void;
  deleteExportTemplate: (id: string) => void;
  setActiveTemplate: (template: ExportTemplate | null) => void;
  loadTemplate: (id: string) => void;
  duplicateTemplate: (id: string) => void;

  // Day 11: 批量导出相关Actions
  createBatchExport: (
    items: Omit<BatchExportItem, "id" | "createdAt" | "status" | "progress">[],
  ) => void;
  updateBatchItemStatus: (
    itemId: string,
    status: BatchExportItem["status"],
    progress?: number,
    error?: string,
  ) => void;
  cancelBatchExport: () => void;
  retryFailedItems: () => void;
  clearBatchExport: () => void;

  // Day 11: 导出历史相关Actions
  addExportHistory: (history: Omit<ExportHistory, "id" | "createdAt">) => void;
  clearExportHistory: () => void;
  deleteExportHistory: (id: string) => void;

  // Day 11: 系统设置相关Actions
  updateSystemSettings: (updates: Partial<SystemSettings>) => void;
  resetSystemSettings: () => void;

  // Day 11: 偏好设置变更追踪
  addPreferenceChange: (change: PreferenceChange) => void;
  getPreferenceHistory: () => PreferenceChange[];
  clearPreferenceHistory: () => void;

  // 推荐反馈 Actions
  addRecommendationFeedback: (
    feedback: Omit<RecommendationFeedback, "timestamp">,
  ) => void;
  clearIgnoredItem: (id: string) => void;
  clearAllIgnored: () => void;
  getFeedbackHistory: () => RecommendationFeedbackHistory;
  recordTelemetry: (record: AssessmentAnalyticsRecord) => void;
  recordNavigation: (action: RecommendationFeedbackAction) => void;
}

// 类型定义 - 兼容 Zustand 5.x
// StoreApi 类型：使用 Mutate 包装以支持中间件
type StoreApi = UseBoundStore<
  Mutate<
    ZustandStoreApi<WorkplaceWellnessStore>,
    [["zustand/persist", unknown]]
  >
>;

// 初始状态 - 基于HVsLYEp的appState
// 使用函数来延迟 Date 对象的创建，避免 SSR 问题
const getInitialState = (): WorkplaceWellnessState => ({
  activeTab: "calendar",
  calendar: {
    currentDate: typeof window !== "undefined" ? new Date() : new Date(0), // SSR 安全
    selectedDate: null,
    showAddForm: false,
    periodData: [], // 空数组，让persist中间件从localStorage恢复数据
  },
  workImpact: {
    painLevel: 0 as PainLevel,
    efficiency: 100,
    selectedTemplateId: null,
  },
  nutrition: {
    selectedPhase: "menstrual" as MenstrualPhase,
    constitutionType: "balanced" as HolisticHealthConstitution,
    searchTerm: "",
  },
  export: {
    exportType: "period" as ExportType,
    format: "json" as ExportFormat,
    isExporting: false,
  },

  // Day 11: 扩展状态
  userPreferences: DEFAULT_USER_PREFERENCES,
  exportTemplates: DEFAULT_EXPORT_TEMPLATES,
  activeTemplate: null,
  batchExportQueue: null,
  exportHistory: [],
  systemSettings: DEFAULT_SYSTEM_SETTINGS,

  // 推荐反馈
  recommendationFeedback: {
    feedbacks: [],
    ignoredItems: [],
    savedItems: [],
    itemRatings: {},
  },
  telemetryLog: [],
  navigationActions: [],

  // Phase 2: 评估历史初始状态
  assessmentHistory: {
    records: [],
    lastAssessmentDate: null,
    totalAssessments: 0,
    premiumAssessments: 0,
  },
});

// 创建Zustand Store - 使用persist进行本地存储持久化
// 使用延迟创建，确保在 SSR 时不会执行
let storeInstance: ZustandStoreApi<WorkplaceWellnessStore> | null = null;

const createStore = () => {
  // 双重检查：确保只在客户端执行
  if (typeof window === "undefined") {
    throw new Error("Store can only be created on the client side");
  }

  if (storeInstance) return storeInstance;

  // 使用 StateCreator 类型确保类型安全
  const stateCreator: StateCreator<
    WorkplaceWellnessStore,
    [["zustand/persist", unknown]],
    [],
    WorkplaceWellnessStore
  > = (set, get) => ({
    // 初始状态 - 使用函数获取，确保每次都是新的 Date 对象
    ...getInitialState(),

    // 语言相关Actions

    // 标签页相关Actions
    setActiveTab: (tab) => set({ activeTab: tab }),

    // 日历相关Actions
    updateCalendar: (updates) =>
      set((state) => ({
        calendar: { ...state.calendar, ...updates },
      })),

    setCurrentDate: (date) =>
      set((state) => ({
        calendar: { ...state.calendar, currentDate: date },
      })),

    setSelectedDate: (date) =>
      set((state) => ({
        calendar: { ...state.calendar, selectedDate: date },
      })),

    toggleAddForm: () =>
      set((state) => ({
        calendar: {
          ...state.calendar,
          showAddForm: !state.calendar.showAddForm,
        },
      })),

    addPeriodRecord: (record) =>
      set((state) => {
        // 检查是否已存在相同日期的记录，如果存在则更新，否则添加
        const existingIndex = state.calendar.periodData.findIndex(
          (r) => r.date === record.date,
        );
        let updatedPeriodData =
          existingIndex >= 0
            ? state.calendar.periodData.map((r, index) =>
              index === existingIndex ? record : r,
            )
            : [...state.calendar.periodData, record];

        logInfo(
          "addPeriodRecord - before cleanup",
          updatedPeriodData,
          "useWorkplaceWellnessStore",
        );

        // 数据清理：只保留最近 6 个月的记录，适当放宽限制
        // 这样图表可以显示更完整的数据，同时避免存储过多
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // 只在数据量超过50条时才进行清理，避免频繁清理
        if (updatedPeriodData.length > 50) {
          updatedPeriodData = updatedPeriodData.filter((r) => {
            try {
              const recordDate = new Date(r.date);
              return recordDate >= sixMonthsAgo;
            } catch {
              return false; // 无效日期，删除
            }
          });

          // 按日期排序（最新的在前）
          updatedPeriodData.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );

          // 如果仍然超过40条，只保留最近40条
          if (updatedPeriodData.length > 40) {
            updatedPeriodData = updatedPeriodData.slice(0, 40);
            logWarn(
              "数据过多，已自动清理，只保留最近 40 条记录",
              undefined,
              "useWorkplaceWellnessStore",
            );
          }

          logInfo(
            "addPeriodRecord - after cleanup",
            updatedPeriodData,
            "useWorkplaceWellnessStore",
          );
        }

        // 全面数据清理：清理其他累积数据
        const cleanedExportHistory =
          state.exportHistory.length > 5
            ? state.exportHistory.slice(-5)
            : state.exportHistory;

        const cleanedFeedbacks =
          state.recommendationFeedback.feedbacks.length > 20
            ? state.recommendationFeedback.feedbacks.slice(-20)
            : state.recommendationFeedback.feedbacks;

        const cleanedExportTemplates =
          state.exportTemplates.length > 5
            ? state.exportTemplates.slice(-5)
            : state.exportTemplates;

        return {
          calendar: {
            ...state.calendar,
            periodData: updatedPeriodData,
          },
          // 清理其他累积数据
          exportHistory: cleanedExportHistory,
          exportTemplates: cleanedExportTemplates,
          batchExportQueue: null, // 清空临时数据
          recommendationFeedback: {
            ...state.recommendationFeedback,
            feedbacks: cleanedFeedbacks,
          },
        };
      }),

    updatePeriodRecord: (date, updates) =>
      set((state) => {
        const updatedPeriodData = state.calendar.periodData.map((r) =>
          r.date === date ? { ...r, ...updates } : r,
        );

        return {
          calendar: {
            ...state.calendar,
            periodData: updatedPeriodData,
          },
        };
      }),

    deletePeriodRecord: (date) =>
      set((state) => {
        const updatedPeriodData = state.calendar.periodData.filter(
          (r) => r.date !== date,
        );

        return {
          calendar: {
            ...state.calendar,
            periodData: updatedPeriodData,
          },
        };
      }),

    // 工作影响相关Actions
    updateWorkImpact: (updates) =>
      set((state) => ({
        workImpact: { ...state.workImpact, ...updates },
      })),

    setPainLevel: (level) =>
      set((state) => ({
        workImpact: {
          ...state.workImpact,
          painLevel: level as PainLevel, // 类型断言
        },
      })),

    setEfficiency: (efficiency) =>
      set((state) => ({
        workImpact: { ...state.workImpact, efficiency },
      })),

    selectTemplate: (templateId) =>
      set((state) => ({
        workImpact: { ...state.workImpact, selectedTemplateId: templateId },
      })),

    // 营养相关Actions
    updateNutrition: (updates) =>
      set((state) => ({
        nutrition: { ...state.nutrition, ...updates },
      })),

    setSelectedPhase: (phase) =>
      set((state) => ({
        nutrition: {
          ...state.nutrition,
          selectedPhase: phase as MenstrualPhase,
        },
      })),

    setConstitutionType: (type) =>
      set((state) => ({
        nutrition: {
          ...state.nutrition,
          constitutionType: type as HolisticHealthConstitution,
        },
      })),

    setSearchTerm: (term) =>
      set((state) => ({
        nutrition: { ...state.nutrition, searchTerm: term },
      })),

    // 导出相关Actions
    updateExport: (updates) =>
      set((state) => ({
        export: { ...state.export, ...updates },
      })),

    setExportType: (type) =>
      set((state) => ({
        export: { ...state.export, exportType: type as ExportType },
      })),

    setExportFormat: (format) =>
      set((state) => ({
        export: { ...state.export, format: format as ExportFormat },
      })),

    setExporting: (exporting) =>
      set((state) => ({
        export: { ...state.export, isExporting: exporting },
      })),

    // Day 11: 用户偏好设置相关Actions
    updateUserPreferences: (updates) =>
      set((state) => ({
        userPreferences: { ...state.userPreferences, ...updates },
      })),

    setTheme: (theme) =>
      set((state) => ({
        userPreferences: {
          ...state.userPreferences,
          ui: { ...state.userPreferences.ui, theme },
        },
      })),

    setFontSize: (fontSize) =>
      set((state) => ({
        userPreferences: {
          ...state.userPreferences,
          ui: { ...state.userPreferences.ui, fontSize },
        },
      })),

    toggleAnimations: () =>
      set((state) => ({
        userPreferences: {
          ...state.userPreferences,
          ui: {
            ...state.userPreferences.ui,
            animations: !state.userPreferences.ui.animations,
          },
        },
      })),

    toggleCompactMode: () =>
      set((state) => ({
        userPreferences: {
          ...state.userPreferences,
          ui: {
            ...state.userPreferences.ui,
            compactMode: !state.userPreferences.ui.compactMode,
          },
        },
      })),

    updateNotificationSettings: (updates) =>
      set((state) => ({
        userPreferences: {
          ...state.userPreferences,
          notifications: {
            ...state.userPreferences.notifications,
            ...updates,
          },
        },
      })),

    updatePrivacySettings: (updates) =>
      set((state) => ({
        userPreferences: {
          ...state.userPreferences,
          privacy: { ...state.userPreferences.privacy, ...updates },
        },
      })),

    updateAccessibilitySettings: (updates) =>
      set((state) => ({
        userPreferences: {
          ...state.userPreferences,
          accessibility: {
            ...state.userPreferences.accessibility,
            ...updates,
          },
        },
      })),

    validateSettings: () => {
      const state = get();
      const errors: SettingsValidationResult["errors"] = [];
      const warnings: SettingsValidationResult["warnings"] = [];

      // 安全检查：确保 userPreferences 和嵌套属性存在
      if (!state.userPreferences || typeof state.userPreferences !== "object") {
        return {
          isValid: false,
          errors: [
            {
              category: "ui" as keyof UserPreferences,
              key: "preferences",
              message: "Preferences not initialized",
            },
          ],
          warnings: [],
        };
      }

      const preferences = state.userPreferences;
      const notifications = preferences.notifications;

      // 验证时间格式
      if (
        notifications &&
        typeof notifications === "object" &&
        notifications.reminderTime &&
        !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(notifications.reminderTime)
      ) {
        errors.push({
          category: "notifications",
          key: "reminderTime",
          message: "Invalid time format",
        });
      }

      // 验证提醒天数
      if (
        notifications &&
        typeof notifications === "object" &&
        notifications.reminderDays &&
        Array.isArray(notifications.reminderDays) &&
        !notifications.reminderDays.every((day) => day >= 0 && day <= 6)
      ) {
        errors.push({
          category: "notifications",
          key: "reminderDays",
          message: "Invalid reminder days",
        });
      }

      // 验证文本缩放
      const accessibility = preferences.accessibility;
      if (
        accessibility &&
        typeof accessibility === "object" &&
        typeof accessibility.textScaling === "number" &&
        (accessibility.textScaling < 0.8 || accessibility.textScaling > 2.0)
      ) {
        errors.push({
          category: "accessibility",
          key: "textScaling",
          message: "Invalid text scaling",
        });
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    },

    resetPreferences: () =>
      set(() => ({
        userPreferences: DEFAULT_USER_PREFERENCES,
      })),

    // Day 11: 导出模板相关Actions
    addExportTemplate: (template) => {
      const newTemplate: ExportTemplate = {
        ...template,
        id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        exportTemplates: [...state.exportTemplates, newTemplate],
      }));
    },

    updateExportTemplate: (id, updates) =>
      set((state) => ({
        exportTemplates: state.exportTemplates.map((template) =>
          template.id === id
            ? {
              ...template,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
            : template,
        ),
      })),

    deleteExportTemplate: (id) =>
      set((state) => ({
        exportTemplates: state.exportTemplates.filter(
          (template) => template.id !== id,
        ),
        activeTemplate:
          state.activeTemplate?.id === id ? null : state.activeTemplate,
      })),

    setActiveTemplate: (template) => set({ activeTemplate: template }),

    loadTemplate: (id) => {
      const state = get();
      const template = state.exportTemplates.find((t) => t.id === id);
      if (template) {
        set({ activeTemplate: template });
      }
    },

    duplicateTemplate: (id) => {
      const state = get();
      const template = state.exportTemplates.find((t) => t.id === id);
      if (template) {
        const newTemplate: Omit<
          ExportTemplate,
          "id" | "createdAt" | "updatedAt"
        > = {
          name: `${template.name} (Copy)`,
          description: template.description,
          exportType: template.exportType,
          format: template.format,
          fields: template.fields,
          dateRange: template.dateRange,
          filters: template.filters,
          isDefault: false,
        };
        get().addExportTemplate(newTemplate);
      }
    },

    // Day 11: 批量导出相关Actions
    createBatchExport: (items) => {
      const batchItems: BatchExportItem[] = items.map((item) => ({
        ...item,
        id: `batch_item_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        status: "pending" as const,
        progress: 0,
        createdAt: new Date().toISOString(),
      }));

      const batchQueue: BatchExportQueue = {
        id: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `Batch Export ${new Date().toLocaleDateString()}`,
        items: batchItems,
        status: "idle",
        totalItems: batchItems.length,
        completedItems: 0,
        failedItems: 0,
        createdAt: new Date().toISOString(),
      };

      set({ batchExportQueue: batchQueue });
    },

    updateBatchItemStatus: (itemId, status, progress = 0, error) => {
      set((state) => {
        if (!state.batchExportQueue) return state;

        const updatedItems = state.batchExportQueue.items.map((item) =>
          item.id === itemId
            ? {
              ...item,
              status,
              progress,
              error,
              completedAt:
                status === "completed" ? new Date().toISOString() : undefined,
            }
            : item,
        );

        const completedItems = updatedItems.filter(
          (item) => item.status === "completed",
        ).length;
        const failedItems = updatedItems.filter(
          (item) => item.status === "failed",
        ).length;

        return {
          batchExportQueue: {
            ...state.batchExportQueue,
            items: updatedItems,
            completedItems,
            failedItems,
            status:
              status === "completed" || status === "failed"
                ? status
                : "running",
          },
        };
      });
    },

    cancelBatchExport: () =>
      set((state) => ({
        batchExportQueue: state.batchExportQueue
          ? {
            ...state.batchExportQueue,
            status: "cancelled",
          }
          : null,
      })),

    retryFailedItems: () =>
      set((state) => {
        if (!state.batchExportQueue) return state;

        const updatedItems = state.batchExportQueue.items.map((item) =>
          item.status === "failed"
            ? {
              ...item,
              status: "pending" as const,
              progress: 0,
              error: undefined,
            }
            : item,
        );

        return {
          batchExportQueue: {
            ...state.batchExportQueue,
            items: updatedItems,
            status: "idle",
            failedItems: 0,
          },
        };
      }),

    clearBatchExport: () => set({ batchExportQueue: null }),

    // Day 11: 导出历史相关Actions
    addExportHistory: (history) => {
      const newHistory: ExportHistory = {
        ...history,
        id: `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };

      set((state) => ({
        exportHistory: [newHistory, ...state.exportHistory].slice(0, 100), // 保留最近100条记录
      }));
    },

    clearExportHistory: () => set({ exportHistory: [] }),

    deleteExportHistory: (id) =>
      set((state) => ({
        exportHistory: state.exportHistory.filter(
          (history) => history.id !== id,
        ),
      })),

    // Day 11: 系统设置相关Actions
    updateSystemSettings: (updates) =>
      set((state) => ({
        systemSettings: { ...state.systemSettings, ...updates },
      })),

    resetSystemSettings: () => set({ systemSettings: DEFAULT_SYSTEM_SETTINGS }),

    // Day 11: 偏好设置变更追踪
    addPreferenceChange: (change) => {
      // 这里可以扩展为存储到历史记录中
      logInfo("Preference change tracked", change, "useWorkplaceWellnessStore");
    },

    getPreferenceHistory: () => {
      // 这里可以返回偏好设置变更历史
      return [];
    },

    clearPreferenceHistory: () => {
      // 清除偏好设置变更历史
    },

    // 推荐反馈 Actions
    addRecommendationFeedback: (feedback) => {
      const newFeedback: RecommendationFeedback = {
        ...feedback,
        timestamp: new Date().toISOString(),
      };

      set((state) => {
        const newState = {
          ...state.recommendationFeedback,
          feedbacks: [...state.recommendationFeedback.feedbacks, newFeedback],
        };

        // 更新忽略列表
        if (feedback.action === "dismissed") {
          newState.ignoredItems = [
            ...state.recommendationFeedback.ignoredItems,
            feedback.recommendationId,
          ];
        }

        // 更新收藏列表
        if (feedback.action === "saved") {
          newState.savedItems = [
            ...state.recommendationFeedback.savedItems,
            feedback.recommendationId,
          ];
        }

        // 更新评分
        if (feedback.rating) {
          const existingRating =
            state.recommendationFeedback.itemRatings[feedback.recommendationId];
          newState.itemRatings = {
            ...state.recommendationFeedback.itemRatings,
            [feedback.recommendationId]: existingRating
              ? (existingRating + feedback.rating) / 2
              : feedback.rating,
          };
        }

        return { recommendationFeedback: newState };
      });
    },

    clearIgnoredItem: (id) => {
      set((state) => ({
        recommendationFeedback: {
          ...state.recommendationFeedback,
          ignoredItems: state.recommendationFeedback.ignoredItems.filter(
            (i) => i !== id,
          ),
        },
      }));
    },

    clearAllIgnored: () => {
      set((state) => ({
        recommendationFeedback: {
          ...state.recommendationFeedback,
          ignoredItems: [],
        },
      }));
    },

    getFeedbackHistory: () => {
      return get().recommendationFeedback;
    },

    recordTelemetry: (record) => {
      set((state) => ({
        telemetryLog: [...state.telemetryLog, record].slice(-100),
      }));
    },
    recordNavigation: (action) => {
      set((state) => ({
        navigationActions: [...state.navigationActions, action].slice(-50),
      }));
    },

    // Phase 2: 评估历史相关Actions
    addAssessmentResult: (record) => {
      set((state) => {
        const newRecords = [...state.assessmentHistory.records, record];
        const sortedRecords = newRecords.sort(
          (a, b) => b.timestamp - a.timestamp,
        ); // 最新的在前

        return {
          assessmentHistory: {
            records: sortedRecords,
            lastAssessmentDate: record.date,
            totalAssessments: state.assessmentHistory.totalAssessments + 1,
            premiumAssessments: record.isPremium
              ? state.assessmentHistory.premiumAssessments + 1
              : state.assessmentHistory.premiumAssessments,
          },
        };
      });
    },

    getAssessmentHistory: () => {
      const state = get();
      return state.assessmentHistory;
    },

    getAssessmentByDate: (date) => {
      const state = get();
      return (
        state.assessmentHistory.records.find(
          (record) => record.date === date,
        ) || null
      );
    },

    clearAssessmentHistory: () => {
      set(() => ({
        assessmentHistory: {
          records: [],
          lastAssessmentDate: null,
          totalAssessments: 0,
          premiumAssessments: 0,
        },
      }));
    },

    migrateAssessmentsFromLocalStorage: () => {
      if (typeof window === "undefined") return;

      try {
        const existingData = localStorage.getItem("stress_assessments");
        if (!existingData) return;

        const assessments = JSON.parse(existingData);
        const state = get();

        if (
          state.assessmentHistory.records.length === 0 &&
          assessments.length > 0
        ) {
          interface LocalStorageAssessment {
            timestamp?: number;
            answers?: number[];
            stressScore?: number;
            stressLevel?: string;
            primaryPainPoint?: string;
            isPremium?: boolean;
          }
          const migratedRecords: AssessmentRecord[] = assessments.map(
            (assessment: LocalStorageAssessment, index: number) => ({
              id: `migrated_${Date.now()}_${index}`,
              date: new Date(assessment.timestamp).toISOString().split("T")[0],
              answers: assessment.answers || [],
              stressScore: assessment.stressScore || 0,
              stressLevel: assessment.stressLevel || "",
              primaryPainPoint: assessment.primaryPainPoint || "default",
              isPremium: assessment.isPremium || false,
              timestamp: assessment.timestamp || Date.now(),
              completedAt: new Date(assessment.timestamp).toISOString(),
            }),
          );

          set(() => ({
            assessmentHistory: {
              records: migratedRecords,
              lastAssessmentDate:
                migratedRecords.length > 0 ? migratedRecords[0].date : null,
              totalAssessments: migratedRecords.length,
              premiumAssessments: migratedRecords.filter((r) => r.isPremium)
                .length,
            },
          }));

          // 清理旧数据
          localStorage.removeItem("stress_assessments");

          logInfo(
            "评估数据迁移完成",
            {
              migratedCount: migratedRecords.length,
              premiumCount: migratedRecords.filter((r) => r.isPremium).length,
            },
            "useWorkplaceWellnessStore",
          );
        }
      } catch (error) {
        logError("评估数据迁移失败", error, "useWorkplaceWellnessStore");
      }
    },

    // 工具方法
    resetState: () => set(getInitialState()),

    getStateSnapshot: () => {
      const state = get();
      return {
        activeTab: state.activeTab,
        calendar: state.calendar,
        workImpact: state.workImpact,
        nutrition: state.nutrition,
        export: state.export,
        // Day 11: 扩展状态快照
        userPreferences: state.userPreferences,
        exportTemplates: state.exportTemplates,
        activeTemplate: state.activeTemplate,
        batchExportQueue: state.batchExportQueue,
        exportHistory: state.exportHistory,
        systemSettings: state.systemSettings,
      };
    },
  });

  // 创建 store 实例，使用 persist 中间件
  storeInstance = create<WorkplaceWellnessStore>()(
    persist(stateCreator, {
      name: "workplace-wellness-storage",
      storage:
        typeof window !== "undefined"
          ? createJSONStorage(() => {
            // 双重检查：确保在客户端
            if (typeof window === "undefined") {
              throw new Error(
                "Storage can only be created on the client side",
              );
            }
            // 自定义 storage 适配器，处理 QuotaExceededError
            const safeStorage: Storage = {
              getItem: (key: string) => {
                try {
                  if (typeof window === "undefined") return null;
                  // 先尝试从 localStorage 读取
                  const data = localStorage.getItem(key);
                  if (data) {
                    // 验证并修复数据完整性
                    try {
                      const parsed = JSON.parse(data);
                      // 检查 userPreferences 是否完整
                      if (parsed?.state?.userPreferences) {
                        const prefs = parsed.state.userPreferences;
                        // 如果 userPreferences 不完整，自动修复
                        if (
                          !prefs.ui ||
                          typeof prefs.ui !== "object" ||
                          !prefs.ui.theme
                        ) {
                          logWarn(
                            "检测到 userPreferences 数据不完整，自动修复...",
                            undefined,
                            "useWorkplaceWellnessStore",
                          );
                          parsed.state.userPreferences = {
                            ...DEFAULT_USER_PREFERENCES,
                            ...prefs,
                            ui: {
                              ...DEFAULT_USER_PREFERENCES.ui,
                              ...(prefs.ui || {}),
                              theme:
                                prefs.ui?.theme ||
                                DEFAULT_USER_PREFERENCES.ui.theme,
                            },
                            notifications:
                              prefs.notifications &&
                                typeof prefs.notifications === "object"
                                ? {
                                  ...DEFAULT_USER_PREFERENCES.notifications,
                                  ...prefs.notifications,
                                }
                                : DEFAULT_USER_PREFERENCES.notifications,
                            privacy:
                              prefs.privacy &&
                                typeof prefs.privacy === "object"
                                ? {
                                  ...DEFAULT_USER_PREFERENCES.privacy,
                                  ...prefs.privacy,
                                }
                                : DEFAULT_USER_PREFERENCES.privacy,
                            accessibility:
                              prefs.accessibility &&
                                typeof prefs.accessibility === "object"
                                ? {
                                  ...DEFAULT_USER_PREFERENCES.accessibility,
                                  ...prefs.accessibility,
                                }
                                : DEFAULT_USER_PREFERENCES.accessibility,
                            export:
                              prefs.export && typeof prefs.export === "object"
                                ? {
                                  ...DEFAULT_USER_PREFERENCES.export,
                                  ...prefs.export,
                                }
                                : DEFAULT_USER_PREFERENCES.export,
                          };
                          // 保存修复后的数据
                          const fixedData = JSON.stringify(parsed);
                          try {
                            localStorage.setItem(key, fixedData);
                            logInfo(
                              "userPreferences 数据已自动修复",
                              undefined,
                              "useWorkplaceWellnessStore",
                            );
                          } catch {
                            logWarn(
                              "修复后的数据保存失败，使用修复后的内存数据",
                              undefined,
                              "useWorkplaceWellnessStore",
                            );
                          }
                          return fixedData;
                        }
                      }
                      return data;
                    } catch (parseError) {
                      logWarn(
                        "数据解析失败，使用默认值",
                        parseError,
                        "useWorkplaceWellnessStore",
                      );
                      // 数据损坏，返回 null 让 Zustand 使用默认值
                      return null;
                    }
                  }
                  // 如果 localStorage 没有，尝试从 sessionStorage 读取
                  return sessionStorage.getItem(key);
                } catch {
                  // 如果都失败，返回 null
                  return null;
                }
              },
              setItem: (key: string, value: string) => {
                try {
                  if (typeof window === "undefined") return;
                  localStorage.setItem(key, value);
                  logInfo(
                    "数据已保存到 localStorage",
                    { key, size: value.length },
                    "useWorkplaceWellnessStore",
                  );
                } catch (error) {
                  // 处理配额超出错误
                  if (
                    error instanceof DOMException &&
                    (error.code === 22 || error.name === "QuotaExceededError")
                  ) {
                    logWarn(
                      "Storage quota exceeded, attempting cleanup...",
                      error,
                      "useWorkplaceWellnessStore",
                    );

                    // 先尝试清理所有 workplace-wellness 相关的旧数据
                    try {
                      if (typeof window !== "undefined") {
                        const keysToRemove: string[] = [];
                        for (let i = localStorage.length - 1; i >= 0; i--) {
                          const k = localStorage.key(i);
                          if (
                            k &&
                            (k.startsWith("workplace-wellness-") ||
                              k === "workplace-wellness-storage" ||
                              k.includes("workplace-wellness"))
                          ) {
                            keysToRemove.push(k);
                          }
                        }
                        keysToRemove.forEach((k) => {
                          try {
                            localStorage.removeItem(k);
                          } catch {
                            // 忽略单个删除错误
                          }
                        });
                      }
                    } catch (cleanupError) {
                      logWarn(
                        "Failed to cleanup, localStorage may be completely full",
                        cleanupError,
                        "useWorkplaceWellnessStore",
                      );
                    }

                    // 尝试保存最小数据集
                    try {
                      const minimalData = {
                        state: {
                          activeTab: (() => {
                            try {
                              const parsed = JSON.parse(value);
                              return parsed?.state?.activeTab || "calendar";
                            } catch {
                              return "calendar";
                            }
                          })(),
                          calendar: {
                            currentDate: new Date().toISOString(),
                            selectedDate: null,
                            showAddForm: false,
                            periodData: [], // 清空历史数据
                          },
                          workImpact: {
                            painLevel: null,
                            efficiency: 100,
                            selectedTemplateId: null,
                          },
                          nutrition: {
                            selectedPhase: "menstrual",
                            constitutionType: "balanced",
                            searchTerm: "",
                          },
                          export: {
                            exportType: "single",
                            format: "json",
                            isExporting: false,
                          },
                          userPreferences: DEFAULT_USER_PREFERENCES,
                          exportTemplates: [],
                          activeTemplate: null,
                          batchExportQueue: null,
                          exportHistory: [],
                          systemSettings: {},
                          recommendationFeedback: {
                            feedbacks: [],
                            ignoredItems: [],
                            savedItems: [],
                            itemRatings: {},
                          },
                        },
                      };

                      const minimalDataString = JSON.stringify(minimalData);

                      // 尝试保存最小数据集到 localStorage
                      try {
                        if (typeof window !== "undefined") {
                          localStorage.setItem(key, minimalDataString);
                          logInfo(
                            "Storage cleaned and minimal data saved to localStorage",
                            undefined,
                            "useWorkplaceWellnessStore",
                          );
                          return;
                        }
                      } catch (minimalSaveError) {
                        logWarn(
                          "localStorage completely full after cleanup, using sessionStorage",
                          minimalSaveError,
                          "useWorkplaceWellnessStore",
                        );
                        // 直接使用 sessionStorage，不再尝试 localStorage
                        try {
                          if (typeof window !== "undefined") {
                            sessionStorage.setItem(key, minimalDataString);
                            logInfo(
                              "Data saved to sessionStorage instead",
                              undefined,
                              "useWorkplaceWellnessStore",
                            );
                            // 触发存储警告事件，通知界面显示提示
                            window.dispatchEvent(
                              new CustomEvent("storage-warning", {
                                detail: {
                                  type: "sessionStorage",
                                  message:
                                    "存储空间不足，数据已临时保存。关闭浏览器后数据将丢失。",
                                },
                              }),
                            );
                            return;
                          }
                        } catch (sessionError) {
                          logError(
                            "Both localStorage and sessionStorage failed",
                            sessionError,
                            "useWorkplaceWellnessStore",
                          );
                          // 触发严重警告事件
                          if (typeof window !== "undefined") {
                            window.dispatchEvent(
                              new CustomEvent("storage-warning", {
                                detail: {
                                  type: "failed",
                                  message:
                                    "存储空间已满，无法保存数据。请清理浏览器存储或导出数据。",
                                },
                              }),
                            );
                          }
                          return;
                        }
                      }
                    } catch (dataError) {
                      logError(
                        "Failed to create minimal data",
                        dataError,
                        "useWorkplaceWellnessStore",
                      );
                      // 如果创建最小数据集也失败，直接使用 sessionStorage 保存原始值
                      try {
                        if (typeof window !== "undefined") {
                          sessionStorage.setItem(key, value);
                          logInfo(
                            "Original data saved to sessionStorage",
                            undefined,
                            "useWorkplaceWellnessStore",
                          );
                          // 触发存储警告事件
                          window.dispatchEvent(
                            new CustomEvent("storage-warning", {
                              detail: {
                                type: "sessionStorage",
                                message:
                                  "存储空间不足，数据已临时保存。关闭浏览器后数据将丢失。",
                              },
                            }),
                          );
                          return;
                        }
                      } catch {
                        logError(
                          "All storage options failed",
                          undefined,
                          "useWorkplaceWellnessStore",
                        );
                        // 触发严重警告事件
                        if (typeof window !== "undefined") {
                          window.dispatchEvent(
                            new CustomEvent("storage-warning", {
                              detail: {
                                type: "failed",
                                message:
                                  "存储空间已满，无法保存数据。请清理浏览器存储或导出数据。",
                              },
                            }),
                          );
                        }
                        return;
                      }
                    }
                  } else {
                    // 非配额错误，记录但不抛出
                    logError(
                      "Storage setItem error",
                      error,
                      "useWorkplaceWellnessStore",
                    );
                    // 不抛出错误，静默失败
                  }
                }
              },
              removeItem: (key: string) => {
                try {
                  if (typeof window === "undefined") return;
                  localStorage.removeItem(key);
                } catch {
                  // 忽略错误
                }
              },
              clear: () => {
                try {
                  if (typeof window === "undefined") return;
                  localStorage.clear();
                } catch {
                  // 忽略错误
                }
              },
              get length() {
                try {
                  if (typeof window === "undefined") return 0;
                  return localStorage.length;
                } catch {
                  return 0;
                }
              },
              key: (index: number) => {
                try {
                  if (typeof window === "undefined") return null;
                  return localStorage.key(index);
                } catch {
                  return null;
                }
              },
            };
            return safeStorage;
          })
          : undefined,
      // 添加SSR安全配置 - 跳过服务器端hydration
      // 注意：skipHydration: true 需要手动调用 rehydrate()
      skipHydration: true,
      // 只在客户端运行
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          logError(
            "Zustand store rehydration error",
            error,
            "useWorkplaceWellnessStore",
          );
          // 触发全局错误事件
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("store-rehydrate-error", { detail: error }),
            );
          }
        } else if (state) {
          logInfo(
            "Zustand store rehydrated successfully",
            undefined,
            "useWorkplaceWellnessStore",
          );

          // 确保基础结构存在
          if (!state.calendar) {
            state.calendar = {
              currentDate: new Date(),
              selectedDate: null,
              showAddForm: false,
              periodData: [],
            };
          }

          // 处理 periodData
          if (
            !state.calendar.periodData ||
            state.calendar.periodData.length === 0
          ) {
            logInfo(
              "未找到已保存的经期数据，使用示例数据",
              undefined,
              "useWorkplaceWellnessStore",
            );
            state.calendar.periodData = mockPeriodData;
          } else {
            logInfo(
              "成功恢复经期记录",
              {
                count: state.calendar.periodData.length,
              },
              "useWorkplaceWellnessStore",
            );
            // 验证数据结构
            state.calendar.periodData = state.calendar.periodData.filter(
              (record) => record && typeof record === "object" && record.date,
            );

            if (state.calendar.periodData.length > 0) {
              logInfo(
                "验证后保留有效记录",
                { count: state.calendar.periodData.length },
                "useWorkplaceWellnessStore",
              );
            } else {
              logWarn(
                "所有记录都无效，使用示例数据",
                undefined,
                "useWorkplaceWellnessStore",
              );
              state.calendar.periodData = mockPeriodData;
            }
          }

          // 确保 userPreferences 结构完整
          if (
            !state.userPreferences ||
            !state.userPreferences.ui ||
            typeof state.userPreferences.ui !== "object" ||
            !state.userPreferences.ui.theme
          ) {
            // 如果 userPreferences 不存在或不完整，完全重建
            if (
              !state.userPreferences ||
              !state.userPreferences.ui ||
              typeof state.userPreferences.ui !== "object" ||
              !state.userPreferences.ui.theme
            ) {
              logWarn(
                "数据恢复后检测到 userPreferences 不完整，自动修复...",
                undefined,
                "useWorkplaceWellnessStore",
              );
              state.userPreferences = {
                ...DEFAULT_USER_PREFERENCES,
                ...(state.userPreferences || {}),
                ui: {
                  ...DEFAULT_USER_PREFERENCES.ui,
                  ...(state.userPreferences?.ui || {}),
                  theme:
                    state.userPreferences?.ui?.theme ||
                    DEFAULT_USER_PREFERENCES.ui.theme,
                },
                notifications:
                  state.userPreferences?.notifications &&
                    typeof state.userPreferences.notifications === "object"
                    ? {
                      ...DEFAULT_NOTIFICATION_SETTINGS,
                      ...state.userPreferences.notifications,
                    }
                    : DEFAULT_NOTIFICATION_SETTINGS,
                privacy:
                  state.userPreferences?.privacy &&
                    typeof state.userPreferences.privacy === "object"
                    ? {
                      ...DEFAULT_PRIVACY_SETTINGS,
                      ...state.userPreferences.privacy,
                    }
                    : DEFAULT_PRIVACY_SETTINGS,
                accessibility:
                  state.userPreferences?.accessibility &&
                    typeof state.userPreferences.accessibility === "object"
                    ? {
                      ...DEFAULT_ACCESSIBILITY_SETTINGS,
                      ...state.userPreferences.accessibility,
                    }
                    : DEFAULT_ACCESSIBILITY_SETTINGS,
                export:
                  state.userPreferences?.export &&
                    typeof state.userPreferences.export === "object"
                    ? {
                      defaultFormat: "pdf" as ExtendedExportFormat,
                      defaultTemplate: undefined,
                      autoSave: true,
                      includeCharts: true,
                      compression: false,
                      ...state.userPreferences.export,
                    }
                    : {
                      defaultFormat: "pdf" as ExtendedExportFormat,
                      defaultTemplate: undefined,
                      autoSave: true,
                      includeCharts: true,
                      compression: false,
                    },
              };
              logInfo(
                "userPreferences 已自动修复",
                undefined,
                "useWorkplaceWellnessStore",
              );
            } else {
              // 即使存在，也确保所有嵌套属性完整
              if (!state.userPreferences.ui.theme) {
                state.userPreferences.ui.theme =
                  DEFAULT_USER_PREFERENCES.ui.theme;
              }
              if (
                !state.userPreferences.notifications ||
                typeof state.userPreferences.notifications !== "object"
              ) {
                state.userPreferences.notifications = {
                  ...DEFAULT_NOTIFICATION_SETTINGS,
                  ...(state.userPreferences.notifications || {}),
                };
              }
              if (
                !state.userPreferences.privacy ||
                typeof state.userPreferences.privacy !== "object"
              ) {
                state.userPreferences.privacy = {
                  ...DEFAULT_PRIVACY_SETTINGS,
                  ...(state.userPreferences.privacy || {}),
                };
              }
              if (
                !state.userPreferences.accessibility ||
                typeof state.userPreferences.accessibility !== "object"
              ) {
                state.userPreferences.accessibility = {
                  ...DEFAULT_ACCESSIBILITY_SETTINGS,
                  ...(state.userPreferences.accessibility || {}),
                };
              }
              if (
                !state.userPreferences.export ||
                typeof state.userPreferences.export !== "object"
              ) {
                state.userPreferences.export = {
                  defaultFormat: "pdf" as ExtendedExportFormat,
                  defaultTemplate: undefined,
                  autoSave: true,
                  includeCharts: true,
                  compression: false,
                  ...(state.userPreferences.export || {}),
                };
              }
            }
          } else if (state) {
            // 如果 userPreferences 完全缺失，使用默认值
            state.userPreferences = DEFAULT_USER_PREFERENCES;
          }

          // 触发恢复完成事件
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("store-rehydrate-complete", {
                detail: {
                  recordCount: state.calendar.periodData.length,
                  hasValidData: state.calendar.periodData.length > 0,
                },
              }),
            );
          }

          logInfo(
            "Zustand store rehydrated successfully",
            state,
            "useWorkplaceWellnessStore",
          );
        }
      },
    }),
  );

  return storeInstance;
};

// 导出 store hook - 延迟创建，确保 SSR 安全
export const useWorkplaceWellnessStore = <T = WorkplaceWellnessStore>(
  selector?: (state: WorkplaceWellnessStore) => T,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _equalityFn?: (a: T, b: T) => boolean,
): T | WorkplaceWellnessStore => {
  const store = createStore();

  // 必须在所有条件分支之前调用 hooks，确保 React Hooks 规则
  // 使用默认 selector 如果没有提供
  const defaultSelector = (state: WorkplaceWellnessStore) => state as T;
  const actualSelector = selector || defaultSelector;

  // 始终调用 useStore，确保 hooks 调用顺序一致
  const storeState = useStore(store, actualSelector);

  if (typeof window === "undefined") {
    // SSR 时返回初始状态，避免错误
    const initialState = getInitialState() as unknown as WorkplaceWellnessStore;
    if (selector) {
      return selector(initialState);
    }
    return initialState;
  }

  return storeState;
};

// 添加 store 的静态方法 - 延迟初始化
// 添加 store 的静态方法 - 延迟初始化
// 使用类型断言来扩展函数类型
(
  useWorkplaceWellnessStore as unknown as StoreApi & {
    getState: () => WorkplaceWellnessStore;
    setState: (
      state:
        | Partial<WorkplaceWellnessStore>
        | ((state: WorkplaceWellnessStore) => Partial<WorkplaceWellnessStore>),
    ) => void;
    subscribe: (
      listener: (
        state: WorkplaceWellnessStore,
        prevState: WorkplaceWellnessStore,
      ) => void,
    ) => () => void;
    persist?: {
      hasHydrated: () => boolean;
      onHydrate: (fn: () => void) => () => void;
      onFinishHydration: (
        fn: (state: WorkplaceWellnessStore) => void,
      ) => () => void;
    };
  }
).getState = () => {
  if (typeof window === "undefined")
    return getInitialState() as unknown as WorkplaceWellnessStore;
  const store = createStore();
  return store.getState();
};

(
  useWorkplaceWellnessStore as unknown as StoreApi & {
    setState: (
      state:
        | Partial<WorkplaceWellnessStore>
        | ((state: WorkplaceWellnessStore) => Partial<WorkplaceWellnessStore>),
    ) => void;
  }
).setState = (state) => {
  if (typeof window === "undefined") return;
  const store = createStore();
  store.setState(state as Parameters<typeof store.setState>[0]);
};

(
  useWorkplaceWellnessStore as unknown as StoreApi & {
    subscribe: (
      listener: (
        state: WorkplaceWellnessStore,
        prevState: WorkplaceWellnessStore,
      ) => void,
    ) => () => void;
  }
).subscribe = (listener) => {
  if (typeof window === "undefined") return () => { };
  const store = createStore();
  return store.subscribe(listener as Parameters<typeof store.subscribe>[0]);
};

// persist 属性 - 使用类型断言
Object.defineProperty(useWorkplaceWellnessStore, "persist", {
  get: () => {
    if (typeof window === "undefined") return undefined;
    const store = createStore();
    return (store as { persist?: unknown }).persist;
  },
  configurable: true,
});

// ===== 类型定义 =====
// Action Hooks 返回类型
type WorkplaceWellnessActions = {
  setActiveTab: WorkplaceWellnessStore["setActiveTab"];
  updateCalendar: WorkplaceWellnessStore["updateCalendar"];
  setCurrentDate: WorkplaceWellnessStore["setCurrentDate"];
  addPeriodRecord: WorkplaceWellnessStore["addPeriodRecord"];
  updatePeriodRecord: WorkplaceWellnessStore["updatePeriodRecord"];
  deletePeriodRecord: WorkplaceWellnessStore["deletePeriodRecord"];
  updateWorkImpact: WorkplaceWellnessStore["updateWorkImpact"];
  selectTemplate: WorkplaceWellnessStore["selectTemplate"];
  updateNutrition: WorkplaceWellnessStore["updateNutrition"];
  updateExport: WorkplaceWellnessStore["updateExport"];
  setExporting: WorkplaceWellnessStore["setExporting"];
  resetState: WorkplaceWellnessStore["resetState"];
  // Phase 2: 评估历史相关Actions
  addAssessmentResult: WorkplaceWellnessStore["addAssessmentResult"];
  getAssessmentHistory: WorkplaceWellnessStore["getAssessmentHistory"];
  getAssessmentByDate: WorkplaceWellnessStore["getAssessmentByDate"];
  clearAssessmentHistory: WorkplaceWellnessStore["clearAssessmentHistory"];
  migrateAssessmentsFromLocalStorage: WorkplaceWellnessStore["migrateAssessmentsFromLocalStorage"];
  // Day 11: 导出模板相关Actions
  addExportTemplate: WorkplaceWellnessStore["addExportTemplate"];
  updateExportTemplate: WorkplaceWellnessStore["updateExportTemplate"];
  deleteExportTemplate: WorkplaceWellnessStore["deleteExportTemplate"];
  setActiveTemplate: WorkplaceWellnessStore["setActiveTemplate"];
  // Batch Export Actions
  createBatchExport: WorkplaceWellnessStore["createBatchExport"];
  cancelBatchExport: WorkplaceWellnessStore["cancelBatchExport"];
  clearBatchExport: WorkplaceWellnessStore["clearBatchExport"];
  // Export History Actions
  addExportHistory: WorkplaceWellnessStore["addExportHistory"];
  clearExportHistory: WorkplaceWellnessStore["clearExportHistory"];
  deleteExportHistory: WorkplaceWellnessStore["deleteExportHistory"];
  // User Preferences Actions
  updateUserPreferences: WorkplaceWellnessStore["updateUserPreferences"];
  updateAccessibilitySettings: WorkplaceWellnessStore["updateAccessibilitySettings"];
  validateSettings: WorkplaceWellnessStore["validateSettings"];
  resetPreferences: WorkplaceWellnessStore["resetPreferences"];
};

type UserPreferencesActions = {
  updateUserPreferences: WorkplaceWellnessStore["updateUserPreferences"];
  setTheme: WorkplaceWellnessStore["setTheme"];
  setFontSize: WorkplaceWellnessStore["setFontSize"];
  toggleAnimations: WorkplaceWellnessStore["toggleAnimations"];
  toggleCompactMode: WorkplaceWellnessStore["toggleCompactMode"];
  updateNotificationSettings: WorkplaceWellnessStore["updateNotificationSettings"];
  updatePrivacySettings: WorkplaceWellnessStore["updatePrivacySettings"];
  updateAccessibilitySettings: WorkplaceWellnessStore["updateAccessibilitySettings"];
  validateSettings: WorkplaceWellnessStore["validateSettings"];
  resetPreferences: WorkplaceWellnessStore["resetPreferences"];
};

type ExportTemplateActions = {
  addExportTemplate: WorkplaceWellnessStore["addExportTemplate"];
  updateExportTemplate: WorkplaceWellnessStore["updateExportTemplate"];
  deleteExportTemplate: WorkplaceWellnessStore["deleteExportTemplate"];
  setActiveTemplate: WorkplaceWellnessStore["setActiveTemplate"];
  loadTemplate: WorkplaceWellnessStore["loadTemplate"];
  duplicateTemplate: WorkplaceWellnessStore["duplicateTemplate"];
};

type BatchExportActions = {
  createBatchExport: WorkplaceWellnessStore["createBatchExport"];
  updateBatchItemStatus: WorkplaceWellnessStore["updateBatchItemStatus"];
  cancelBatchExport: WorkplaceWellnessStore["cancelBatchExport"];
  retryFailedItems: WorkplaceWellnessStore["retryFailedItems"];
  clearBatchExport: WorkplaceWellnessStore["clearBatchExport"];
};

type ExportHistoryActions = {
  addExportHistory: WorkplaceWellnessStore["addExportHistory"];
  clearExportHistory: WorkplaceWellnessStore["clearExportHistory"];
  deleteExportHistory: WorkplaceWellnessStore["deleteExportHistory"];
};

type SystemSettingsActions = {
  updateSystemSettings: WorkplaceWellnessStore["updateSystemSettings"];
  resetSystemSettings: WorkplaceWellnessStore["resetSystemSettings"];
};

type RecommendationFeedbackActions = {
  addRecommendationFeedback: WorkplaceWellnessStore["addRecommendationFeedback"];
  clearIgnoredItem: WorkplaceWellnessStore["clearIgnoredItem"];
  clearAllIgnored: WorkplaceWellnessStore["clearAllIgnored"];
  getFeedbackHistory: WorkplaceWellnessStore["getFeedbackHistory"];
};

type TelemetryActions = {
  recordTelemetry: WorkplaceWellnessStore["recordTelemetry"];
  recordNavigation: WorkplaceWellnessStore["recordNavigation"];
};

// ===== 选择器Hooks =====
// 选择器Hooks - 基于HVsLYEp的状态结构
// 这些 hooks 在 SSR 时也会被调用，需要确保安全
export const useActiveTab = (): WorkplaceWellnessState["activeTab"] => {
  if (typeof window === "undefined") return "calendar";
  const store = useWorkplaceWellnessStore;
  return store(
    (state: WorkplaceWellnessStore) => state.activeTab,
  ) as WorkplaceWellnessState["activeTab"];
};
export const useCalendar = (): CalendarState => {
  if (typeof window === "undefined") return getInitialState().calendar;
  const store = useWorkplaceWellnessStore;
  return store(
    (state: WorkplaceWellnessStore) => state.calendar,
  ) as CalendarState;
};
export const useWorkImpact = (): WorkImpactData => {
  if (typeof window === "undefined") return getInitialState().workImpact;
  const store = useWorkplaceWellnessStore;
  return store(
    (state: WorkplaceWellnessStore) => state.workImpact,
  ) as WorkImpactData;
};
export const useNutrition = (): NutritionData => {
  if (typeof window === "undefined") return getInitialState().nutrition;
  const store = useWorkplaceWellnessStore;
  return store(
    (state: WorkplaceWellnessStore) => state.nutrition,
  ) as NutritionData;
};
export const useExport = (): ExportConfig => {
  if (typeof window === "undefined") return getInitialState().export;
  const store = useWorkplaceWellnessStore;
  return store((state: WorkplaceWellnessStore) => state.export) as ExportConfig;
};

// Day 11: 新增选择器Hooks
export const useUserPreferences = (): UserPreferences => {
  if (typeof window === "undefined") return getInitialState().userPreferences;
  const store = useWorkplaceWellnessStore;
  const preferences = store(
    (state: WorkplaceWellnessStore) => state.userPreferences,
  ) as UserPreferences;
  // 深度检查，确保返回的值结构完整
  if (
    !preferences ||
    typeof preferences !== "object" ||
    !preferences.ui ||
    typeof preferences.ui !== "object" ||
    preferences.ui === null ||
    !preferences.ui.theme ||
    typeof preferences.ui.theme !== "string" ||
    !preferences.notifications ||
    typeof preferences.notifications !== "object" ||
    !preferences.privacy ||
    typeof preferences.privacy !== "object" ||
    !preferences.accessibility ||
    typeof preferences.accessibility !== "object" ||
    !preferences.export ||
    typeof preferences.export !== "object"
  ) {
    return DEFAULT_USER_PREFERENCES;
  }
  return preferences as UserPreferences;
};
export const useExportTemplates = (): ExportTemplate[] => {
  if (typeof window === "undefined") return getInitialState().exportTemplates;
  const store = useWorkplaceWellnessStore;
  return store(
    (state: WorkplaceWellnessStore) => state.exportTemplates,
  ) as ExportTemplate[];
};
export const useActiveTemplate = (): ExportTemplate | null => {
  if (typeof window === "undefined") return getInitialState().activeTemplate;
  const store = useWorkplaceWellnessStore;
  return store(
    (state: WorkplaceWellnessStore) => state.activeTemplate,
  ) as ExportTemplate | null;
};
export const useBatchExportQueue = (): BatchExportQueue | null => {
  if (typeof window === "undefined") return getInitialState().batchExportQueue;
  const store = useWorkplaceWellnessStore;
  return store(
    (state: WorkplaceWellnessStore) => state.batchExportQueue,
  ) as BatchExportQueue | null;
};
export const useExportHistory = (): ExportHistory[] => {
  if (typeof window === "undefined") return getInitialState().exportHistory;
  const store = useWorkplaceWellnessStore;
  return store(
    (state: WorkplaceWellnessStore) => state.exportHistory,
  ) as ExportHistory[];
};
export const useSystemSettings = (): SystemSettings => {
  if (typeof window === "undefined") return getInitialState().systemSettings;
  const store = useWorkplaceWellnessStore;
  return store(
    (state: WorkplaceWellnessStore) => state.systemSettings,
  ) as SystemSettings;
};

// Actions Hooks - 使用独立的store调用避免无限循环
export const useWorkplaceWellnessActions = (): WorkplaceWellnessActions => {
  // SSR 安全检查
  if (typeof window === "undefined") {
    return {
      setActiveTab: (() => { }) as WorkplaceWellnessStore["setActiveTab"],
      updateCalendar: () => { },
      setCurrentDate: () => { },
      addPeriodRecord: () => { },
      updatePeriodRecord: () => { },
      deletePeriodRecord: () => { },
      updateWorkImpact: () => { },
      selectTemplate: () => { },
      updateNutrition: () => { },
      updateExport: () => { },
      setExporting: () => { },
      resetState: () => { },
      addAssessmentResult: () => { },
      getAssessmentHistory: () => ({
        records: [],
        lastAssessmentDate: null,
        totalAssessments: 0,
        premiumAssessments: 0,
      }),
      getAssessmentByDate: () => null,
      clearAssessmentHistory: () => { },
      migrateAssessmentsFromLocalStorage: () => { },
      addExportTemplate: () => { },
      updateExportTemplate: () => { },
      deleteExportTemplate: () => { },
      setActiveTemplate: () => { },
      createBatchExport: () => { },
      cancelBatchExport: () => { },
      clearBatchExport: () => { },
      addExportHistory: () => { },
      clearExportHistory: () => { },
      deleteExportHistory: () => { },
      updateUserPreferences: () => { },
      updateAccessibilitySettings: () => { },
      validateSettings: () => ({ isValid: true, errors: [], warnings: [] }),
      resetPreferences: () => { },
    } as unknown as WorkplaceWellnessActions;
  }

  const store = useWorkplaceWellnessStore;
  const setActiveTab = store(
    (state: WorkplaceWellnessStore) => state.setActiveTab,
  ) as WorkplaceWellnessStore["setActiveTab"];
  const updateCalendar = store(
    (state: WorkplaceWellnessStore) => state.updateCalendar,
  ) as WorkplaceWellnessStore["updateCalendar"];
  const setCurrentDate = store(
    (state: WorkplaceWellnessStore) => state.setCurrentDate,
  ) as WorkplaceWellnessStore["setCurrentDate"];
  const addPeriodRecord = store(
    (state: WorkplaceWellnessStore) => state.addPeriodRecord,
  ) as WorkplaceWellnessStore["addPeriodRecord"];
  const updatePeriodRecord = store(
    (state: WorkplaceWellnessStore) => state.updatePeriodRecord,
  ) as WorkplaceWellnessStore["updatePeriodRecord"];
  const deletePeriodRecord = store(
    (state: WorkplaceWellnessStore) => state.deletePeriodRecord,
  ) as WorkplaceWellnessStore["deletePeriodRecord"];
  const updateWorkImpact = store(
    (state: WorkplaceWellnessStore) => state.updateWorkImpact,
  ) as WorkplaceWellnessStore["updateWorkImpact"];
  const selectTemplate = store(
    (state: WorkplaceWellnessStore) => state.selectTemplate,
  ) as WorkplaceWellnessStore["selectTemplate"];
  const updateNutrition = store(
    (state: WorkplaceWellnessStore) => state.updateNutrition,
  ) as WorkplaceWellnessStore["updateNutrition"];
  const updateExport = store(
    (state: WorkplaceWellnessStore) => state.updateExport,
  ) as WorkplaceWellnessStore["updateExport"];
  const setExporting = store(
    (state: WorkplaceWellnessStore) => state.setExporting,
  ) as WorkplaceWellnessStore["setExporting"];
  const resetState = store(
    (state: WorkplaceWellnessStore) => state.resetState,
  ) as WorkplaceWellnessStore["resetState"];
  const addAssessmentResult = store(
    (state: WorkplaceWellnessStore) => state.addAssessmentResult,
  ) as WorkplaceWellnessStore["addAssessmentResult"];
  const getAssessmentHistory = store(
    (state: WorkplaceWellnessStore) => state.getAssessmentHistory,
  ) as WorkplaceWellnessStore["getAssessmentHistory"];
  const getAssessmentByDate = store(
    (state: WorkplaceWellnessStore) => state.getAssessmentByDate,
  ) as WorkplaceWellnessStore["getAssessmentByDate"];
  const clearAssessmentHistory = store(
    (state: WorkplaceWellnessStore) => state.clearAssessmentHistory,
  ) as WorkplaceWellnessStore["clearAssessmentHistory"];
  const migrateAssessmentsFromLocalStorage = store(
    (state: WorkplaceWellnessStore) => state.migrateAssessmentsFromLocalStorage,
  ) as WorkplaceWellnessStore["migrateAssessmentsFromLocalStorage"];
  const addExportTemplate = store(
    (state: WorkplaceWellnessStore) => state.addExportTemplate,
  ) as WorkplaceWellnessStore["addExportTemplate"];
  const updateExportTemplate = store(
    (state: WorkplaceWellnessStore) => state.updateExportTemplate,
  ) as WorkplaceWellnessStore["updateExportTemplate"];
  const deleteExportTemplate = store(
    (state: WorkplaceWellnessStore) => state.deleteExportTemplate,
  ) as WorkplaceWellnessStore["deleteExportTemplate"];
  const setActiveTemplate = store(
    (state: WorkplaceWellnessStore) => state.setActiveTemplate,
  ) as WorkplaceWellnessStore["setActiveTemplate"];
  const createBatchExport = store(
    (state: WorkplaceWellnessStore) => state.createBatchExport,
  ) as WorkplaceWellnessStore["createBatchExport"];
  const cancelBatchExport = store(
    (state: WorkplaceWellnessStore) => state.cancelBatchExport,
  ) as WorkplaceWellnessStore["cancelBatchExport"];
  const clearBatchExport = store(
    (state: WorkplaceWellnessStore) => state.clearBatchExport,
  ) as WorkplaceWellnessStore["clearBatchExport"];
  const addExportHistory = store(
    (state: WorkplaceWellnessStore) => state.addExportHistory,
  ) as WorkplaceWellnessStore["addExportHistory"];
  const clearExportHistory = store(
    (state: WorkplaceWellnessStore) => state.clearExportHistory,
  ) as WorkplaceWellnessStore["clearExportHistory"];
  const deleteExportHistory = store(
    (state: WorkplaceWellnessStore) => state.deleteExportHistory,
  ) as WorkplaceWellnessStore["deleteExportHistory"];
  const updateUserPreferences = store(
    (state: WorkplaceWellnessStore) => state.updateUserPreferences,
  ) as WorkplaceWellnessStore["updateUserPreferences"];
  const updateAccessibilitySettings = store(
    (state: WorkplaceWellnessStore) => state.updateAccessibilitySettings,
  ) as WorkplaceWellnessStore["updateAccessibilitySettings"];
  const validateSettings = store(
    (state: WorkplaceWellnessStore) => state.validateSettings,
  ) as WorkplaceWellnessStore["validateSettings"];
  const resetPreferences = store(
    (state: WorkplaceWellnessStore) => state.resetPreferences,
  ) as WorkplaceWellnessStore["resetPreferences"];

  return {
    setActiveTab,
    updateCalendar,
    setCurrentDate,
    addPeriodRecord,
    updatePeriodRecord,
    deletePeriodRecord,
    updateWorkImpact,
    selectTemplate,
    updateNutrition,
    updateExport,
    setExporting,
    resetState,
    addAssessmentResult,
    getAssessmentHistory,
    getAssessmentByDate,
    clearAssessmentHistory,
    migrateAssessmentsFromLocalStorage,
    addExportTemplate,
    updateExportTemplate,
    deleteExportTemplate,
    setActiveTemplate,
    createBatchExport,
    cancelBatchExport,
    clearBatchExport,
    addExportHistory,
    clearExportHistory,
    deleteExportHistory,
    updateUserPreferences,
    updateAccessibilitySettings,
    validateSettings,
    resetPreferences,
  };
};

// Day 11: 用户偏好设置Actions Hook
export const useUserPreferencesActions = (): UserPreferencesActions => {
  const store = useWorkplaceWellnessStore;
  const updateUserPreferences = store(
    (state: WorkplaceWellnessStore) => state.updateUserPreferences,
  ) as WorkplaceWellnessStore["updateUserPreferences"];
  const setTheme = store(
    (state: WorkplaceWellnessStore) => state.setTheme,
  ) as WorkplaceWellnessStore["setTheme"];
  const setFontSize = store(
    (state: WorkplaceWellnessStore) => state.setFontSize,
  ) as WorkplaceWellnessStore["setFontSize"];
  const toggleAnimations = store(
    (state: WorkplaceWellnessStore) => state.toggleAnimations,
  ) as WorkplaceWellnessStore["toggleAnimations"];
  const toggleCompactMode = store(
    (state: WorkplaceWellnessStore) => state.toggleCompactMode,
  ) as WorkplaceWellnessStore["toggleCompactMode"];
  const updateNotificationSettings = store(
    (state: WorkplaceWellnessStore) => state.updateNotificationSettings,
  ) as WorkplaceWellnessStore["updateNotificationSettings"];
  const updatePrivacySettings = store(
    (state: WorkplaceWellnessStore) => state.updatePrivacySettings,
  ) as WorkplaceWellnessStore["updatePrivacySettings"];
  const updateAccessibilitySettings = store(
    (state: WorkplaceWellnessStore) => state.updateAccessibilitySettings,
  ) as WorkplaceWellnessStore["updateAccessibilitySettings"];
  const validateSettings = store(
    (state: WorkplaceWellnessStore) => state.validateSettings,
  ) as WorkplaceWellnessStore["validateSettings"];
  const resetPreferences = store(
    (state: WorkplaceWellnessStore) => state.resetPreferences,
  ) as WorkplaceWellnessStore["resetPreferences"];

  return {
    updateUserPreferences,
    setTheme,
    setFontSize,
    toggleAnimations,
    toggleCompactMode,
    updateNotificationSettings,
    updatePrivacySettings,
    updateAccessibilitySettings,
    validateSettings,
    resetPreferences,
  };
};

// Day 11: 导出模板Actions Hook
export const useExportTemplateActions = (): ExportTemplateActions => {
  const store = useWorkplaceWellnessStore;
  const addExportTemplate = store(
    (state: WorkplaceWellnessStore) => state.addExportTemplate,
  ) as WorkplaceWellnessStore["addExportTemplate"];
  const updateExportTemplate = store(
    (state: WorkplaceWellnessStore) => state.updateExportTemplate,
  ) as WorkplaceWellnessStore["updateExportTemplate"];
  const deleteExportTemplate = store(
    (state: WorkplaceWellnessStore) => state.deleteExportTemplate,
  ) as WorkplaceWellnessStore["deleteExportTemplate"];
  const setActiveTemplate = store(
    (state: WorkplaceWellnessStore) => state.setActiveTemplate,
  ) as WorkplaceWellnessStore["setActiveTemplate"];
  const loadTemplate = store(
    (state: WorkplaceWellnessStore) => state.loadTemplate,
  ) as WorkplaceWellnessStore["loadTemplate"];
  const duplicateTemplate = store(
    (state: WorkplaceWellnessStore) => state.duplicateTemplate,
  ) as WorkplaceWellnessStore["duplicateTemplate"];

  return {
    addExportTemplate,
    updateExportTemplate,
    deleteExportTemplate,
    setActiveTemplate,
    loadTemplate,
    duplicateTemplate,
  };
};

// Day 11: 批量导出Actions Hook
export const useBatchExportActions = (): BatchExportActions => {
  const store = useWorkplaceWellnessStore;
  const createBatchExport = store(
    (state: WorkplaceWellnessStore) => state.createBatchExport,
  ) as WorkplaceWellnessStore["createBatchExport"];
  const updateBatchItemStatus = store(
    (state: WorkplaceWellnessStore) => state.updateBatchItemStatus,
  ) as WorkplaceWellnessStore["updateBatchItemStatus"];
  const cancelBatchExport = store(
    (state: WorkplaceWellnessStore) => state.cancelBatchExport,
  ) as WorkplaceWellnessStore["cancelBatchExport"];
  const retryFailedItems = store(
    (state: WorkplaceWellnessStore) => state.retryFailedItems,
  ) as WorkplaceWellnessStore["retryFailedItems"];
  const clearBatchExport = store(
    (state: WorkplaceWellnessStore) => state.clearBatchExport,
  ) as WorkplaceWellnessStore["clearBatchExport"];

  return {
    createBatchExport,
    updateBatchItemStatus,
    cancelBatchExport,
    retryFailedItems,
    clearBatchExport,
  };
};

// Day 11: 导出历史Actions Hook
export const useExportHistoryActions = (): ExportHistoryActions => {
  const store = useWorkplaceWellnessStore;
  const addExportHistory = store(
    (state: WorkplaceWellnessStore) => state.addExportHistory,
  ) as WorkplaceWellnessStore["addExportHistory"];
  const clearExportHistory = store(
    (state: WorkplaceWellnessStore) => state.clearExportHistory,
  ) as WorkplaceWellnessStore["clearExportHistory"];
  const deleteExportHistory = store(
    (state: WorkplaceWellnessStore) => state.deleteExportHistory,
  ) as WorkplaceWellnessStore["deleteExportHistory"];

  return {
    addExportHistory,
    clearExportHistory,
    deleteExportHistory,
  };
};

// Day 11: 系统设置Actions Hook
export const useSystemSettingsActions = (): SystemSettingsActions => {
  const store = useWorkplaceWellnessStore;
  const updateSystemSettings = store(
    (state: WorkplaceWellnessStore) => state.updateSystemSettings,
  ) as WorkplaceWellnessStore["updateSystemSettings"];
  const resetSystemSettings = store(
    (state: WorkplaceWellnessStore) => state.resetSystemSettings,
  ) as WorkplaceWellnessStore["resetSystemSettings"];

  return {
    updateSystemSettings,
    resetSystemSettings,
  };
};

// 推荐反馈 Actions Hook
export const useRecommendationFeedbackActions =
  (): RecommendationFeedbackActions => {
    const store = useWorkplaceWellnessStore;
    const addRecommendationFeedback = store(
      (state: WorkplaceWellnessStore) => state.addRecommendationFeedback,
    ) as WorkplaceWellnessStore["addRecommendationFeedback"];
    const clearIgnoredItem = store(
      (state: WorkplaceWellnessStore) => state.clearIgnoredItem,
    ) as WorkplaceWellnessStore["clearIgnoredItem"];
    const clearAllIgnored = store(
      (state: WorkplaceWellnessStore) => state.clearAllIgnored,
    ) as WorkplaceWellnessStore["clearAllIgnored"];
    const getFeedbackHistory = store(
      (state: WorkplaceWellnessStore) => state.getFeedbackHistory,
    ) as WorkplaceWellnessStore["getFeedbackHistory"];

    return {
      addRecommendationFeedback,
      clearIgnoredItem,
      clearAllIgnored,
      getFeedbackHistory,
    };
  };

export const useTelemetryActions = (): TelemetryActions => {
  if (typeof window === "undefined") {
    return {
      recordTelemetry: () => { },
      recordNavigation: () => { },
    };
  }

  const store = useWorkplaceWellnessStore;
  const recordTelemetry = store(
    (state: WorkplaceWellnessStore) => state.recordTelemetry,
  ) as WorkplaceWellnessStore["recordTelemetry"];
  const recordNavigation = store(
    (state: WorkplaceWellnessStore) => state.recordNavigation,
  ) as WorkplaceWellnessStore["recordNavigation"];

  return {
    recordTelemetry,
    recordNavigation,
  };
};
