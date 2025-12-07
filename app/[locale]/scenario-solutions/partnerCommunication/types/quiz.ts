/**
 * 伴侣理解测试相关类型定义
 */

// 测试阶段类型
export type QuizStage = "stage1" | "stage2" | "stage3" | "stage4";
export type QuizStageStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "locked";
export type ResultLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type StageType = "quiz" | "training" | "guidance";

// 基础题目类型
export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswer: number | number[]; // 支持单选和多选
  explanation: string;
  isMultipleChoice?: boolean; // 是否为多选题
}

export interface QuizOption {
  id: number;
  text: string;
  score: number;
}

export interface QuizAnswer {
  questionId: string;
  selectedOption: number | number[]; // 支持单选和多选
  isCorrect: boolean;
  score: number;
  answeredAt: Date;
}

// 测试结果类型
export interface QuizResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  level: ResultLevel;
  title: string;
  feedback: string;
  recommendations: string[];
  completedAt: Date;
  timeSpent: number; // 毫秒
  stage?: QuizStage; // 添加stage信息
}

// 阶段进度类型
export interface StageProgress {
  status: QuizStageStatus;
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  result: QuizResult | null;
  completedAt: Date | null;
  timeSpent: number; // 毫秒
  startTime: Date | null;
}

// 综合结果类型
export interface OverallResult {
  stage1Score: number;
  stage2Score: number | null;
  combinedLevel: ResultLevel | null;
  recommendations: string[];
  completedAt: Date | null;
  combinedScore: number;
}

// 测试状态类型
export interface QuizState {
  currentStage: QuizStage;
  stageProgress: Record<QuizStage, StageProgress>;
  overallResult: OverallResult | null;
}

// 测试进度类型
export interface QuizProgress {
  current: number;
  total: number;
  percentage: number;
  stage: QuizStage;
}

// 测试配置类型
export interface QuizStageConfig {
  id: QuizStage;
  title: string;
  description: string;
  instructions: string;
  totalQuestions: number;
  timeLimit?: number; // 可选的时间限制（分钟）
  difficulty: "easy" | "medium" | "hard";
  unlockCondition?: {
    requiresPreviousStage: boolean;
    minScore?: number;
  };
  scoring: {
    maxScorePerQuestion: number;
    levelThresholds: {
      beginner: number;
      intermediate: number;
      advanced: number;
      expert: number;
    };
  };
}

// 结果配置类型
export interface ResultConfig {
  title: string;
  description: string;
  recommendations: string[];
  color: string;
  icon: string;
  nextSteps: string[];
}

// 测试统计类型
export interface QuizStats {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  completionRate: number;
  averageTimeSpent: number;
  lastAttempt: Date | null;
}

// 测试历史类型
export interface QuizHistory {
  id: string;
  stage: QuizStage;
  result: QuizResult;
  completedAt: Date;
  timeSpent: number;
}

// 测试分析类型
export interface QuizAnalysis {
  strengths: string[];
  weaknesses: string[];
  improvementAreas: string[];
  personalizedTips: string[];
  nextRecommendations: string[];
}
