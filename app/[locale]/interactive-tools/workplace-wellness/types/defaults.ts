/**
 * HVsLYEp职场健康助手 - Day 11 默认值定义
 * 基于HVsLYEp的默认值设计，确保类型安全
 */

import {
  UserPreferences,
  UIPreferences,
  NotificationSettings,
  PrivacySettings,
  AccessibilitySettings,
  SystemSettings,
  ExportTemplate,
  Theme,
  FontSize,
  DateFormat,
  TimeFormat,
  ExtendedExportFormat,
  NotificationType,
  NotificationChannel,
} from "./index";

// 默认界面偏好设置
export const DEFAULT_UI_PREFERENCES: UIPreferences = {
  theme: "auto" as Theme,
  fontSize: "medium" as FontSize,
  animations: true,
  compactMode: false,
  dateFormat: "YYYY-MM-DD" as DateFormat,
  timeFormat: "24h" as TimeFormat,
  chartType: "line",
  sidebarCollapsed: false,
  showTooltips: true,
  showProgressBars: true,
};

// 默认通知设置
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  types: {
    reminder: true,
    insight: false,
    update: true,
    alert: true,
  } as Record<NotificationType, boolean>,
  channels: {
    browser: true,
    email: false,
    sms: false,
    push: false,
  } as Record<NotificationChannel, boolean>,
  reminderTime: "09:00",
  reminderDays: [1, 2, 3, 4, 5], // 周一到周五
  quietHours: {
    enabled: true,
    start: "22:00",
    end: "08:00",
  },
  frequency: "daily",
};

// 默认隐私设置
export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  dataCollection: true,
  analytics: false,
  personalization: true,
  shareProgress: false,
  anonymousMode: false,
  exportPassword: false,
  dataRetention: 365, // 1年
  autoDelete: false,
};

// 默认无障碍设置
export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: true,
  focusIndicators: true,
  textScaling: 1.0,
};

// 默认用户偏好设置
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  ui: DEFAULT_UI_PREFERENCES,
  notifications: DEFAULT_NOTIFICATION_SETTINGS,
  privacy: DEFAULT_PRIVACY_SETTINGS,
  accessibility: DEFAULT_ACCESSIBILITY_SETTINGS,
  export: {
    defaultFormat: "pdf" as ExtendedExportFormat,
    defaultTemplate: undefined,
    autoSave: true,
    includeCharts: true,
    compression: false,
  },
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
};

// 默认系统设置
export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  performance: {
    enableLazyLoading: true,
    enableCodeSplitting: true,
    enableCaching: true,
    maxCacheSize: 100, // 100MB
  },
  storage: {
    enableLocalStorage: true,
    enableSessionStorage: true,
    maxStorageSize: 50, // 50MB
    autoCleanup: true,
    cleanupInterval: 24, // 24小时
  },
  sync: {
    enableAutoSync: false,
    syncInterval: 60, // 60分钟
    enableOfflineMode: true,
    conflictResolution: "client",
  },
};

// 默认导出模板
export const DEFAULT_EXPORT_TEMPLATES: ExportTemplate[] = [
  {
    id: "period-basic",
    name: "经期基础报告",
    description: "包含基本经期数据的PDF报告",
    exportType: "period",
    format: "pdf",
    fields: ["date", "type", "painLevel", "flow", "notes"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: true,
  },
  {
    id: "nutrition-comprehensive",
    name: "营养全面报告",
    description: "包含营养建议和体质的详细报告",
    exportType: "nutrition",
    format: "pdf",
    fields: ["name", "benefits", "phase", "holisticNature", "nutrients"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: true,
  },
  {
    id: "all-data-csv",
    name: "全部数据CSV",
    description: "所有数据的CSV格式导出，适合数据分析",
    exportType: "all",
    format: "csv",
    fields: ["*"], // 所有字段
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: true,
  },
];

// 主题配置
export const THEME_CONFIG = {
  light: {
    name: "浅色主题",
    description: "适合日间使用的明亮主题",
    className: "theme-light",
  },
  dark: {
    name: "深色主题",
    description: "适合夜间使用的深色主题",
    className: "theme-dark",
  },
  auto: {
    name: "自动主题",
    description: "根据系统设置自动切换",
    className: "theme-auto",
  },
  system: {
    name: "系统主题",
    description: "跟随系统主题设置",
    className: "theme-system",
  },
} as const;

// 字体大小配置
export const FONT_SIZE_CONFIG = {
  small: {
    name: "小字体",
    description: "紧凑的字体大小",
    multiplier: 0.875,
  },
  medium: {
    name: "中等字体",
    description: "标准的字体大小",
    multiplier: 1.0,
  },
  large: {
    name: "大字体",
    description: "放大的字体大小",
    multiplier: 1.125,
  },
} as const;

// 导出格式配置
export const EXPORT_FORMAT_CONFIG = {
  json: {
    name: "JSON格式",
    description: "结构化数据格式，适合程序处理",
    extension: ".json",
    mimeType: "application/json",
  },
  csv: {
    name: "CSV格式",
    description: "表格数据格式，适合Excel打开",
    extension: ".csv",
    mimeType: "text/csv",
  },
  pdf: {
    name: "PDF格式",
    description: "便携式文档格式，适合打印和分享",
    extension: ".pdf",
    mimeType: "application/pdf",
  },
  xlsx: {
    name: "Excel格式",
    description: "Excel电子表格格式",
    extension: ".xlsx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  docx: {
    name: "Word格式",
    description: "Word文档格式",
    extension: ".docx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  xml: {
    name: "XML格式",
    description: "可扩展标记语言格式",
    extension: ".xml",
    mimeType: "application/xml",
  },
} as const;

// 通知类型配置
export const NOTIFICATION_TYPE_CONFIG = {
  reminder: {
    name: "提醒通知",
    description: "经期提醒和健康建议",
    icon: "bell",
    color: "blue",
  },
  insight: {
    name: "洞察通知",
    description: "数据分析和健康洞察",
    icon: "lightbulb",
    color: "yellow",
  },
  update: {
    name: "更新通知",
    description: "应用更新和功能通知",
    icon: "info",
    color: "green",
  },
  alert: {
    name: "警告通知",
    description: "重要警告和异常情况",
    icon: "alert-triangle",
    color: "red",
  },
} as const;

// 验证规则
export const VALIDATION_RULES = {
  reminderTime: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  quietHoursTime: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  reminderDays: (days: number[]) => days.every((day) => day >= 0 && day <= 6),
  textScaling: (scale: number) => scale >= 0.8 && scale <= 2.0,
  dataRetention: (days: number) => days >= 30 && days <= 3650, // 30天到10年
  maxCacheSize: (size: number) => size >= 10 && size <= 1000, // 10MB到1GB
  maxStorageSize: (size: number) => size >= 5 && size <= 500, // 5MB到500MB
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  INVALID_TIME_FORMAT: "时间格式无效，请使用HH:MM格式",
  INVALID_DAYS: "提醒天数无效，请选择0-6之间的数字",
  INVALID_SCALING: "文本缩放比例无效，请选择0.8-2.0之间的数值",
  INVALID_RETENTION: "数据保留天数无效，请选择30-3650天",
  INVALID_CACHE_SIZE: "缓存大小无效，请选择10-1000MB",
  INVALID_STORAGE_SIZE: "存储大小无效，请选择5-500MB",
  TEMPLATE_NOT_FOUND: "导出模板不存在",
  EXPORT_FAILED: "导出失败，请重试",
  INVALID_PREFERENCES: "偏好设置无效",
} as const;
