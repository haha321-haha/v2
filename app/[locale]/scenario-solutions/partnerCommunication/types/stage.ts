/**
 * 多阶段测试相关类型定义
 */

import { QuizStage, QuizStageStatus, ResultLevel } from "./quiz";

// 阶段状态类型
export interface StageState {
  id: QuizStage;
  status: QuizStageStatus;
  progress: number; // 0-100
  score: number;
  level: ResultLevel | null;
  isUnlocked: boolean;
  isCurrent: boolean;
}

// 阶段选择类型
export interface StageSelection {
  availableStages: QuizStage[];
  recommendedStage: QuizStage | null;
  lockedStages: QuizStage[];
  currentStage: QuizStage;
}

// 阶段解锁条件类型
export interface UnlockCondition {
  requiresPreviousStage: boolean;
  minScore?: number;
  minCompletionRate?: number;
  timeBased?: boolean;
  customCondition?: () => boolean;
}

// 阶段配置类型
export interface StageConfig {
  id: QuizStage;
  title: string;
  description: string;
  icon: string;
  color: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: number; // 分钟
  unlockCondition: UnlockCondition;
  prerequisites: QuizStage[];
}

// 阶段进度类型
export interface StageProgress {
  stage: QuizStage;
  currentQuestion: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number; // 毫秒
  timeRemaining?: number; // 毫秒
  isCompleted: boolean;
  isPaused: boolean;
}

// 阶段结果类型
export interface StageResult {
  stage: QuizStage;
  score: number;
  percentage: number;
  level: ResultLevel;
  timeSpent: number;
  completedAt: Date;
  accuracy: number; // 正确率
  speed: number; // 答题速度（题目/分钟）
}

// 阶段比较类型
export interface StageComparison {
  stage1: StageResult | null;
  stage2: StageResult | null;
  improvement: {
    scoreImprovement: number;
    levelImprovement: boolean;
    timeImprovement: number;
  };
  combinedLevel: ResultLevel;
}

// 阶段导航类型
export interface StageNavigation {
  current: QuizStage;
  previous: QuizStage | null;
  next: QuizStage | null;
  canGoBack: boolean;
  canGoForward: boolean;
  canSkip: boolean;
}

// 阶段统计类型
export interface StageStats {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  averageTime: number;
  completionRate: number;
  improvementRate: number;
}

// 阶段分析类型
export interface StageAnalysis {
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  nextStageRecommendations: string[];
  personalizedTips: string[];
}

// 阶段解锁事件类型
export interface StageUnlockEvent {
  stage: QuizStage;
  unlockedAt: Date;
  reason: "score_threshold" | "completion" | "time_based" | "manual";
  triggerData: {
    score?: number;
    completionRate?: number;
    timestamp?: Date;
    metadata?: Record<string, unknown>;
  };
}

// 阶段状态变化类型
export interface StageStateChange {
  stage: QuizStage;
  fromStatus: QuizStageStatus;
  toStatus: QuizStageStatus;
  changedAt: Date;
  reason: string;
}

// 阶段验证类型
export interface StageValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

// 阶段配置验证类型
export interface StageConfigValidation {
  config: StageConfig;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// 阶段依赖类型
export interface StageDependency {
  stage: QuizStage;
  dependsOn: QuizStage[];
  requiredFor: QuizStage[];
  optionalFor: QuizStage[];
}

// 阶段元数据类型
export interface StageMetadata {
  version: string;
  lastUpdated: Date;
  author: string;
  description: string;
  tags: string[];
  difficulty: number; // 1-5
  popularity: number; // 1-5
}
