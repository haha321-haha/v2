/**
 * 推荐系统相关类型定义
 */

import { MenstrualPhase, PeriodRecord } from "./index";

// 推荐类型
export type RecommendationType =
  | "article"
  | "tool"
  | "scenario"
  | "tip"
  | "action";

// 推荐类别
export type RecommendationCategory =
  | "pain-relief"
  | "tracking"
  | "medical"
  | "work-adjustment"
  | "nutrition"
  | "natural-therapy"
  | "assessment"
  | "scenario"
  | "mental-health"
  | "emergency";

// 难度等级
export type DifficultyLevel = "easy" | "medium" | "hard";

// 推荐项接口
export interface RecommendationItem {
  id: string;
  type: RecommendationType;
  category: RecommendationCategory;
  title: string; // i18n 键
  description: string; // i18n 键
  priority: number; // 0-100
  relevance: number; // 0-100，由引擎计算
  score: number; // 综合分数，由引擎计算
  reason: string; // 推荐理由，由引擎生成
  href?: string; // 链接地址
  icon?: string; // lucide-react 图标名称
  image?: string; // 图片地址
  metadata?: {
    readTime?: number; // 阅读时间（分钟）
    difficulty?: DifficultyLevel;
    tags?: string[];
  };
  conditions: RecommendationConditions;
}

// 推荐触发条件
export interface RecommendationConditions {
  minPainLevel?: number; // 最低疼痛等级 (1-10)
  maxPainLevel?: number; // 最高疼痛等级 (1-10)
  minEfficiency?: number; // 最低工作效率 (0-100)
  maxEfficiency?: number; // 最高工作效率 (0-100)
  requiredPhases?: MenstrualPhase[]; // 所需周期阶段
  requiredSymptoms?: string[]; // 所需症状
}

// 推荐结果接口
export interface RecommendationResult {
  recommendations: RecommendationItem[];
  insights: {
    painPattern: "increasing" | "decreasing" | "stable" | "irregular";
    efficiencyPattern: "improving" | "declining" | "stable";
    cycleHealth: "healthy" | "irregular" | "needs_attention";
  };
  summary: {
    totalRecommendations: number;
    highPriorityCount: number;
    categories: string[];
  };
}

export type RecommendationFeedbackAction =
  | "clicked"
  | "saved"
  | "dismissed"
  | "rated";

// 用户数据快照接口
export interface UserDataSnapshot {
  periodData: {
    records: PeriodRecord[];
    averageCycleLength: number;
    averagePeriodLength: number;
    averagePainLevel: number;
    painTrend: "increasing" | "decreasing" | "stable" | "irregular";
    cycleRegularity: "regular" | "irregular";
    currentPhase: MenstrualPhase | null;
  };
  workImpact: {
    currentPainLevel: number;
    currentEfficiency: number;
    averagePainLevel: number;
    averageEfficiency: number;
    painTrend: "increasing" | "decreasing" | "stable" | "irregular";
    efficiencyTrend: "improving" | "declining" | "stable";
  };
  nutrition: {
    selectedPhase: MenstrualPhase;
    constitutionType: string;
  };
  metadata: {
    dataQuality: "excellent" | "good" | "fair" | "poor";
    dataCompleteness: number; // 0-100
    lastUpdate: Date;
  };
}

// 数据质量评估指标
export interface DataQualityMetrics {
  periodDataQuality: {
    recordCount: number;
    consistency: number; // 记录规律性 (0-100)
    completeness: number; // 字段完整度 (0-100)
    minRecordsForAnalysis: number; // 至少需要的记录数
  };
  workImpactQuality: {
    recordFrequency: number;
    accuracyScore: number;
    minRecordsForAnalysis: number;
  };
  overallQuality: "excellent" | "good" | "fair" | "poor";
  dataCompleteness: number; // 0-100
}

// 异常检测结果
export interface AnomalyDetection {
  isAnomaly: boolean;
  type: "pain_spike" | "efficiency_drop" | "cycle_irregularity";
  severity: "mild" | "moderate" | "severe";
  suggestion: string;
}
