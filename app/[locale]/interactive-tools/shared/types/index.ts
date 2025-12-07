// 共享类型定义
export interface PainEntry {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  painLevel: number; // 1-10
  duration?: number; // minutes
  location: string[];
  menstrualStatus: "period" | "pre" | "post" | "ovulation" | "other";
  symptoms: string[];
  remedies: string[];
  effectiveness?: number; // 1-5
  notes?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface PainEntryFormData {
  date: string;
  painLevel: number;
  duration?: number;
  location: string[];
  menstrualStatus: "period" | "pre" | "post" | "ovulation" | "other";
  symptoms: string[];
  remedies: string[];
  effectiveness?: number;
  notes?: string;
}

// 症状评估相关类型
export interface Option {
  value: string | number;
  label: string;
  icon?: string;
  description?: string;
  weight?: number; // 用于评分计算
}

export interface Question {
  id: string;
  type: "single" | "multi" | "scale" | "text" | "range" | "boolean";
  category:
    | "basic"
    | "pain"
    | "symptoms"
    | "lifestyle"
    | "medical"
    | "workplace"
    | "preference";
  weight: number; // 问题权重
  title: string;
  description?: string;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    minSelections?: number; // 多选最少选择数量
  };
  options?: Option[];
  conditional?: {
    dependsOn: string;
    values: (string | number)[];
  };
}

export interface AssessmentAnswer {
  questionId: string;
  value: string | number | string[] | boolean;
  timestamp: string;
}

export interface AssessmentSession {
  id: string;
  answers: AssessmentAnswer[];
  result?: AssessmentResult;
  startedAt: string;
  completedAt?: string;
  locale: string;
  mode?: string;
}

export interface AssessmentResult {
  sessionId: string;
  type:
    | "symptom"
    | "workplace"
    | "normal"
    | "mild"
    | "moderate"
    | "severe"
    | "emergency";
  severity: "mild" | "moderate" | "severe" | "emergency";
  score: number;
  maxScore: number;
  percentage: number;
  recommendations: Recommendation[];
  emergency?: boolean;
  message: string;
  summary: string;
  completedAt: string;
  locale: string;
  mode?: string;
  // 参考代码的结果数据
  referenceData?: {
    isSevere?: boolean;
    summary?: string[];
    recommendations?: {
      immediate?: string[];
      longTerm?: string[];
    };
    score?: number;
    profile?: string;
    suggestions?: string[];
  };
  // 保留原有字段以兼容性
  relatedArticles?: string[];
  nextSteps?: string[];
  createdAt?: string;
}

export interface Recommendation {
  id: string;
  category:
    | "immediate"
    | "longterm"
    | "workplace"
    | "lifestyle"
    | "medical"
    | "dietary"
    | "exercise"
    | "selfcare";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  timeframe: string;
  evidence?: string;
  actionSteps?: string[];
  resources?: {
    title: string;
    url: string;
    type: "article" | "video" | "tool" | "external";
  }[];
}

// 数据可视化相关类型
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  tension?: number;
  fill?: boolean;
}

export interface PainStatistics {
  totalEntries: number;
  averagePain: number;
  maxPain: number;
  minPain: number;
  mostCommonSymptoms: string[];
  mostEffectiveRemedies: string[];
  painFrequency: Record<string, number>;
  trendDirection: "improving" | "worsening" | "stable";
}

// 错误处理类型
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// 本地存储相关类型
export interface StorageData<T> {
  data: T;
  version: string;
  timestamp: string;
  checksum?: string;
}

// 导出相关类型
export interface ExportOptions {
  format: "json" | "csv" | "pdf";
  dateRange?: {
    start: string;
    end: string;
  };
  includeCharts?: boolean;
  includeStatistics?: boolean;
}

// 通知类型
export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: "primary" | "secondary";
}

// 参考代码相关的类型定义
export interface SymptomAssessmentResult {
  isSevere: boolean;
  summary: string[];
  recommendations: {
    immediate: string[];
    longTerm: string[];
  };
}

export interface WorkplaceAssessmentResult {
  score: number;
  profile: string;
  suggestions: string[];
}

export interface AssessmentMode {
  id: "simplified" | "detailed" | "medical";
  name: string;
  description: string;
  questionCount: number;
  estimatedTime: string;
}

// 评估配置
export interface AssessmentConfig {
  modes: AssessmentMode[];
  defaultMode: "simplified" | "detailed" | "medical";
  maxQuestionsPerMode: number;
  timeoutMinutes: number;
}

// 用户偏好设置
export interface UserPreferences {
  language: "en" | "zh";
  theme: "light" | "dark" | "auto";
  notifications: {
    reminders: boolean;
    insights: boolean;
    updates: boolean;
  };
  privacy: {
    analytics: boolean;
    crashReports: boolean;
  };
  display: {
    chartType: "line" | "bar" | "area";
    dateFormat: "YYYY-MM-DD" | "DD/MM/YYYY" | "MM/DD/YYYY";
    timeFormat: "24h" | "12h";
  };
}

export * from "./assessment";
export * from "./recommendation";

export interface MenstrualPainAcupoint {
  name: string;
  description: string;
}
