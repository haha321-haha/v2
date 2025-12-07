/**
 * HVsLYEp职场健康助手 - TypeScript类型定义
 * 基于HVsLYEp现有结构设计，不重复造轮子
 */

import type { AssessmentAnalyticsRecord } from "../../shared/types";
import type { RecommendationFeedbackAction } from "./recommendation";

// 基础类型定义

// 月经阶段类型
export type MenstrualPhase =
  | "menstrual"
  | "follicular"
  | "ovulation"
  | "luteal";

// 体质类型（基于整体健康理论）
export type HolisticHealthConstitution =
  | "qi_deficiency"
  | "yang_deficiency"
  | "yin_deficiency"
  | "blood_deficiency"
  | "balanced";

// 经期类型
export type PeriodType = "period" | "predicted" | "ovulation";

// 流量类型
export type FlowType = "light" | "medium" | "heavy";

// 疼痛程度类型
export type PainLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// 工作调整类型
export type WorkAdjustment =
  | "leave"
  | "workFromHome"
  | "postponeMeeting"
  | "reduceTasks";

// 请假模板严重程度
export type SeverityLevel = "mild" | "moderate" | "severe";

// 导出格式类型
export type ExportFormat = "json" | "csv" | "pdf";

// 导出类型
export type ExportType = "period" | "nutrition" | "all";

// Day 11: 扩展导出格式类型
export type ExtendedExportFormat = ExportFormat | "xlsx" | "docx" | "xml";

// 主题类型
export type Theme = "light" | "dark" | "auto" | "system";

// 字体大小类型
export type FontSize = "small" | "medium" | "large";

// 日期格式类型
export type DateFormat = "YYYY-MM-DD" | "DD/MM/YYYY" | "MM/DD/YYYY";

// 时间格式类型
export type TimeFormat = "24h" | "12h";

// 通知类型
export type NotificationType = "reminder" | "insight" | "update" | "alert";

// 通知渠道类型
export type NotificationChannel = "browser" | "email" | "sms" | "push";

// 食物性质类型（基于整体健康理论）
export type HolisticNature = "warm" | "cool" | "neutral";

// 多语言文本接口
export interface LocalizedText {
  zh: string;
  en: string;
}

// 经期记录接口
export interface PeriodRecord {
  date: string;
  type: PeriodType;
  painLevel: PainLevel | null;
  flow: FlowType | null;
  notes?: string;
}

// 工作影响数据接口
export interface WorkImpactData {
  painLevel: PainLevel;
  efficiency: number;
  selectedTemplateId: number | null;
}

// 营养数据接口
export interface NutritionData {
  selectedPhase: MenstrualPhase;
  constitutionType: HolisticHealthConstitution;
  searchTerm: string;
}

// 营养建议接口
export interface NutritionRecommendation {
  name: string;
  benefits: string[];
  phase: MenstrualPhase;
  holisticNature: HolisticNature;
  nutrients: string[];
}

// 请假模板接口
export interface LeaveTemplate {
  id: number;
  title: string;
  severity: SeverityLevel;
  subject: string;
  content: string;
}

// 导出配置接口
export interface ExportConfig {
  exportType: ExportType;
  format: ExportFormat;
  isExporting: boolean;
}

// 日历状态接口
export interface CalendarState {
  currentDate: Date;
  selectedDate: Date | null;
  showAddForm: boolean;
  periodData: PeriodRecord[];
}

// 应用状态接口 - 基于HVsLYEp的appState结构
// 推荐反馈接口
export interface RecommendationFeedback {
  recommendationId: string;
  action: "clicked" | "dismissed" | "saved" | "rated";
  rating?: 1 | 2 | 3 | 4 | 5;
  timestamp: string;
}

// 推荐反馈历史接口
export interface RecommendationFeedbackHistory {
  feedbacks: RecommendationFeedback[];
  ignoredItems: string[]; // 用户忽略的推荐ID
  savedItems: string[]; // 用户收藏的推荐ID
  itemRatings: Record<string, number>; // 推荐ID -> 平均评分
}

// 评估记录接口
export interface AssessmentRecord {
  id: string;
  date: string; // YYYY-MM-DD format
  answers: number[];
  stressScore: number;
  stressLevel: string;
  primaryPainPoint: "work" | "emotion" | "pain" | "default";
  isPremium: boolean;
  timestamp: number;
  completedAt: string; // ISO timestamp
}

// 评估历史接口
export interface AssessmentHistory {
  records: AssessmentRecord[];
  lastAssessmentDate: string | null;
  totalAssessments: number;
  premiumAssessments: number;
}

export interface WorkplaceWellnessState {
  activeTab:
  | "calendar"
  | "focus-calm"
  | "nutrition"
  | "energy"
  | "export"
  | "settings"
  | "work-impact"
  | "analysis"
  | "assessment"
  | "recommendations"
  | "tracking"
  | "analytics";
  calendar: CalendarState;
  workImpact: WorkImpactData;
  nutrition: NutritionData;
  export: ExportConfig;

  // Day 11: 扩展状态
  userPreferences: UserPreferences;
  exportTemplates: ExportTemplate[];
  activeTemplate: ExportTemplate | null;
  batchExportQueue: BatchExportQueue | null;
  exportHistory: ExportHistory[];
  systemSettings: SystemSettings;

  // 推荐反馈
  recommendationFeedback: RecommendationFeedbackHistory;
  telemetryLog: AssessmentAnalyticsRecord[];
  navigationActions: RecommendationFeedbackAction[];

  // Phase 2: 评估历史数据
  assessmentHistory: AssessmentHistory;
}

// 翻译函数类型
export type TranslationFunction = (key: string) => string;

// 状态更新函数类型
export type UpdateStateFunction = (
  updates: Partial<WorkplaceWellnessState>,
) => void;

// 组件Props接口
export interface WorkplaceWellnessProps {
  onStateChange?: (state: WorkplaceWellnessState) => void;
}

// 日历组件Props
export interface CalendarProps {
  state: CalendarState;
  periodData: PeriodRecord[];
  t: TranslationFunction;
  updateState: UpdateStateFunction;
}

// 工作影响组件Props
export interface WorkImpactProps {
  state: WorkImpactData;
  templates: LeaveTemplate[];
  t: TranslationFunction;
  updateState: UpdateStateFunction;
}

// 营养建议组件Props
export interface NutritionProps {
  state: NutritionData;
  nutritionData: NutritionRecommendation[];
  t: TranslationFunction;
  updateState: UpdateStateFunction;
}

// 数据导出组件Props
export interface DataExportProps {
  state: ExportConfig;
  periodData: PeriodRecord[];
  nutritionData: NutritionRecommendation[];
  t: TranslationFunction;
  updateState: UpdateStateFunction;
}

// 导航组件Props
export interface NavigationProps {
  activeTab: string;
  t: TranslationFunction;
  onTabChange: (tab: string) => void;
}

// 头部组件Props
export interface HeaderProps {
  t: TranslationFunction;
}

// 错误类型
export type WorkplaceWellnessError =
  | "DATA_LOAD_ERROR"
  | "EXPORT_ERROR"
  | "VALIDATION_ERROR"
  | "NETWORK_ERROR";

// 错误信息接口
export interface ErrorInfo {
  type: WorkplaceWellnessError;
  message: string;
  details?: string;
}

// 配置接口
export interface WorkplaceWellnessConfig {
  enableLocalStorage: boolean;
  enableAnalytics: boolean;
  maxPainLevel: number;
  minEfficiency: number;
  maxEfficiency: number;
}

// ================================
// Day 11: 高级功能类型定义
// ================================

// 导出模板接口
export interface ExportTemplate {
  id: string;
  name: string;
  description?: string;
  exportType: ExportType;
  format: ExtendedExportFormat;
  fields: string[]; // 要导出的字段
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: Record<string, unknown>; // 自定义过滤条件
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
}

// 批量导出项接口
export interface BatchExportItem {
  id: string;
  userId?: string;
  userName?: string;
  exportType: ExportType;
  templateId?: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number; // 0-100
  error?: string;
  createdAt: string;
  completedAt?: string;
}

// 批量导出队列接口
export interface BatchExportQueue {
  id: string;
  name: string;
  items: BatchExportItem[];
  status: "idle" | "running" | "completed" | "failed" | "cancelled";
  totalItems: number;
  completedItems: number;
  failedItems: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

// 自定义导出配置接口
export interface CustomExportConfig {
  exportType: ExportType;
  format: ExtendedExportFormat;
  fields: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: Record<string, unknown>;
  includeMetadata: boolean;
  includeCharts: boolean;
  password?: string;
  compression?: boolean;
}

// 通知设置接口
export interface NotificationSettings {
  enabled: boolean;
  types: {
    [K in NotificationType]: boolean;
  };
  channels: {
    [K in NotificationChannel]: boolean;
  };
  reminderTime: string; // HH:MM格式
  reminderDays: number[]; // 0-6，0为周日
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM格式
    end: string; // HH:MM格式
  };
  frequency: "immediate" | "daily" | "weekly";
}

// 界面偏好设置接口
export interface UIPreferences {
  theme: Theme;
  fontSize: FontSize;
  animations: boolean;
  compactMode: boolean;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  chartType: "line" | "bar" | "area" | "pie";
  sidebarCollapsed: boolean;
  showTooltips: boolean;
  showProgressBars: boolean;
}

// 隐私设置接口
export interface PrivacySettings {
  dataCollection: boolean;
  analytics: boolean;
  personalization: boolean;
  shareProgress: boolean;
  anonymousMode: boolean;
  exportPassword: boolean;
  dataRetention: number; // 天数
  autoDelete: boolean;
}

// 无障碍设置接口
export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  textScaling: number; // 1.0 - 2.0
}

// 统一用户偏好设置接口
export interface UserPreferences {
  // 界面偏好
  ui: UIPreferences;

  // 通知设置
  notifications: NotificationSettings;

  // 隐私设置
  privacy: PrivacySettings;

  // 无障碍设置
  accessibility: AccessibilitySettings;

  // 导出偏好
  export: {
    defaultFormat: ExtendedExportFormat;
    defaultTemplate?: string;
    autoSave: boolean;
    includeCharts: boolean;
    compression: boolean;
  };

  // 语言偏好

  // 元数据
  version: string;
  lastUpdated: string;
}

// 偏好设置变更接口
export interface PreferenceChange {
  category: keyof UserPreferences;
  key: string;
  value: unknown;
  timestamp: string;
}

// 设置验证结果接口
export interface SettingsValidationResult {
  isValid: boolean;
  errors: {
    category: keyof UserPreferences;
    key: string;
    message: string;
  }[];
  warnings: {
    category: keyof UserPreferences;
    key: string;
    message: string;
  }[];
}

// 导出历史记录接口
export interface ExportHistory {
  id: string;
  exportType: ExportType;
  format: ExtendedExportFormat;
  templateId?: string;
  fileName: string;
  fileSize: number;
  recordCount: number;
  status: "success" | "failed" | "cancelled";
  error?: string;
  createdAt: string;
  downloadUrl?: string;
  expiresAt?: string;
}

// 系统设置接口
export interface SystemSettings {
  // 性能设置
  performance: {
    enableLazyLoading: boolean;
    enableCodeSplitting: boolean;
    enableCaching: boolean;
    maxCacheSize: number; // MB
  };

  // 存储设置
  storage: {
    enableLocalStorage: boolean;
    enableSessionStorage: boolean;
    maxStorageSize: number; // MB
    autoCleanup: boolean;
    cleanupInterval: number; // 小时
  };

  // 同步设置
  sync: {
    enableAutoSync: boolean;
    syncInterval: number; // 分钟
    enableOfflineMode: boolean;
    conflictResolution: "server" | "client" | "manual";
  };
}

// 所有类型已通过export type声明导出，无需重复导出
