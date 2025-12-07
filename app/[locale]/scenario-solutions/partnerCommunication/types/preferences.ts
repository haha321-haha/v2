/**
 * 用户偏好设置相关类型定义
 */

import { QuizStage } from "./quiz";

// 用户偏好类型
export interface UserPreferences {
  // 测试偏好
  testPreferences: {
    preferredStage: QuizStage | "auto";
    autoAdvance: boolean;
    showExplanations: boolean;
    timeLimit: boolean;
    soundEffects: boolean;
  };

  // 通知偏好
  notificationPreferences: {
    enabled: boolean;
    reminderTime: string; // HH:MM格式
    reminderDays: number[]; // 0-6，0为周日
    pushNotifications: boolean;
    emailNotifications: boolean;
  };

  // 界面偏好
  uiPreferences: {
    theme: "light" | "dark" | "auto";
    language: "zh" | "en";
    fontSize: "small" | "medium" | "large";
    animations: boolean;
    compactMode: boolean;
  };

  // 学习偏好
  learningPreferences: {
    difficulty: "easy" | "medium" | "hard";
    learningStyle: "visual" | "auditory" | "kinesthetic" | "mixed";
    studyTime: number; // 分钟
    breakInterval: number; // 分钟
    reviewFrequency: "daily" | "weekly" | "monthly";
  };

  // 隐私偏好
  privacyPreferences: {
    dataCollection: boolean;
    analytics: boolean;
    personalization: boolean;
    shareProgress: boolean;
    anonymousMode: boolean;
  };
}

// 偏好设置变更类型
export interface PreferenceChange {
  category: keyof UserPreferences;
  key: string;
  oldValue: unknown;
  newValue: unknown;
  changedAt: Date;
}

// 偏好设置验证类型
export interface PreferenceValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

// 偏好设置导入/导出类型
export interface PreferenceData {
  preferences: UserPreferences;
  version: string;
  exportedAt: Date;
  deviceInfo: {
    platform: string;
    browser: string;
    version: string;
  };
}

// 偏好设置模板类型
export interface PreferenceTemplate {
  id: string;
  name: string;
  description: string;
  preferences: Partial<UserPreferences>;
  category: "beginner" | "intermediate" | "advanced" | "custom";
  isDefault: boolean;
}

// 偏好设置建议类型
export interface PreferenceSuggestion {
  category: keyof UserPreferences;
  key: string;
  currentValue: unknown;
  suggestedValue: unknown;
  reason: string;
  impact: "low" | "medium" | "high";
  confidence: number; // 0-1
}

// 偏好设置分析类型
export interface PreferenceAnalysis {
  usagePatterns: {
    mostUsedFeatures: string[];
    leastUsedFeatures: string[];
    averageSessionTime: number;
    preferredTimeOfDay: string;
  };

  recommendations: PreferenceSuggestion[];

  optimization: {
    performanceImprovements: string[];
    accessibilityImprovements: string[];
    userExperienceImprovements: string[];
  };
}

// 偏好设置同步类型
export interface PreferenceSync {
  lastSync: Date;
  syncStatus: "success" | "failed" | "pending";
  conflicts: PreferenceConflict[];
  resolution: "manual" | "automatic" | "none";
}

// 偏好设置冲突类型
export interface PreferenceConflict {
  key: string;
  localValue: unknown;
  remoteValue: unknown;
  conflictType: "value" | "structure" | "version";
  resolution: "local" | "remote" | "merge" | "manual";
}

// 偏好设置历史类型
export interface PreferenceHistory {
  changes: PreferenceChange[];
  totalChanges: number;
  lastChange: Date;
  mostChangedCategory: keyof UserPreferences;
  changeFrequency: "low" | "medium" | "high";
}

// 偏好设置统计类型
export interface PreferenceStats {
  totalUsers: number;
  commonPreferences: Partial<UserPreferences>;
  rarePreferences: Partial<UserPreferences>;
  averageCustomization: number; // 0-1
  satisfactionScore: number; // 1-5
}
