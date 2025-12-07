// 评估系统类型定义

export interface Option {
  value: string | number;
  label: string;
  icon?: string;
  description?: string;
  weight?: number; // 用于评分计算
}

export interface Question {
  id: string;
  type: "single" | "multiple" | "scale" | "text" | "range" | "boolean";
  title: string;
  description?: string;
  options?: Option[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
  conditional?: {
    dependsOn: string;
    values: (string | number)[];
  };
  category: "basic" | "pain" | "symptoms" | "lifestyle" | "medical";
  weight: number; // 问题权重
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
}

export interface AssessmentResult {
  sessionId: string;
  type: "normal" | "mild" | "moderate" | "severe" | "emergency";
  severity: "mild" | "moderate" | "severe" | "emergency";
  score: number;
  maxScore: number;
  percentage: number;
  recommendations: Recommendation[];
  emergency?: boolean;
  message: string;
  summary: string;
  relatedArticles: string[];
  nextSteps: string[];
  createdAt: string;
}

export interface Recommendation {
  id: string;
  category:
    | "immediate"
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
    type: "article" | "tool" | "video" | "external";
  }[];
}

// 工具相关的类型
export interface PainImpactCalculatorHookReturn {
  // Current session
  currentSession: AssessmentSession | null;
  currentQuestionIndex: number;
  currentQuestion: Question | null;
  isComplete: boolean;

  // Progress
  progress: number;
  totalQuestions: number;

  // Actions
  startAssessment: (locale: string) => void;
  answerQuestion: (answer: AssessmentAnswer) => void;
  goToQuestion: (index: number) => void;
  goToPreviousQuestion: () => void;
  goToNextQuestion: () => void;
  completeAssessment: (
    t?: (key: string, params?: Record<string, unknown>) => string,
  ) => AssessmentResult | null;
  resetAssessment: () => void;

  // Results
  result: AssessmentResult | null;

  // State
  isLoading: boolean;
  error: string | null;
}
