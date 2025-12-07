/**
 * 通用类型定义
 * 用于替换项目中的 any 类型
 */

// 基础类型
export type ID = string | number;

// 用户相关类型
export interface User {
  id: ID;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// 疼痛追踪相关类型
export interface PainRecord {
  id: ID;
  userId: ID;
  date: string;
  painLevel: number; // 1-10
  symptoms: string[];
  notes?: string;
  createdAt: Date;
}

export interface PainLevel {
  value: number;
  label: string;
  description: string;
}

// 周期追踪相关类型
export interface CycleRecord {
  id: ID;
  userId: ID;
  startDate: string;
  endDate?: string;
  symptoms: string[];
  flow: "light" | "medium" | "heavy";
  notes?: string;
}

// 评估相关类型
export interface AssessmentQuestion {
  id: ID;
  question: string;
  type: "single" | "multiple" | "scale" | "text";
  options?: string[];
  required: boolean;
}

export interface AssessmentAnswer {
  questionId: ID;
  answer: string | string[] | number;
}

export interface AssessmentResult {
  id: ID;
  userId: ID;
  answers: AssessmentAnswer[];
  score: number;
  recommendations: string[];
  createdAt: Date;
}

// 文章相关类型
export interface Article {
  id: ID;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  seoDescription: string;
  seoDescriptionZh: string;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
}

// 工具相关类型
export interface ToolConfig {
  id: ID;
  name: string;
  description: string;
  type: "tracker" | "assessment" | "calculator";
  settings: Record<string, unknown>;
}

// 导出相关类型
export interface ExportData {
  type: "pain" | "cycle" | "assessment";
  data: PainRecord[] | CycleRecord[] | AssessmentResult[];
  format: "csv" | "json" | "pdf";
  dateRange: {
    start: string;
    end: string;
  };
}

// 分析相关类型
export interface AnalyticsData {
  period: string;
  painLevels: number[];
  symptoms: Record<string, number>;
  trends: {
    average: number;
    trend: "increasing" | "decreasing" | "stable";
  };
}

// 错误处理类型
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// 表单相关类型
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "number"
    | "select"
    | "textarea"
    | "checkbox"
    | "radio";
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// 本地化相关类型
export interface LocaleConfig {
  code: string;
  name: string;
  flag: string;
  rtl: boolean;
}

// 存储相关类型
export interface StorageData {
  key: string;
  value: unknown;
  expires?: number;
}

// 事件相关类型
export interface AppEvent {
  type: string;
  payload: Record<string, unknown>;
  timestamp: Date;
}

// 配置相关类型
export interface AppConfig {
  apiUrl: string;
  version: string;
  features: Record<string, boolean>;
  limits: {
    maxRecords: number;
    maxFileSize: number;
  };
}

// 响应相关类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: AppError;
  message?: string;
}

// 分页相关类型
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 工具函数类型
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;
export type Validator<T = unknown> = (value: T) => boolean | string;
export type Transformer<T = unknown, R = unknown> = (value: T) => R;
