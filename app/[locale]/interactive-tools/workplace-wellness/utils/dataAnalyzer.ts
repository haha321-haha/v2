/**
 * 数据分析器
 *
 * 负责分析用户数据，评估数据质量，检测异常，生成数据洞察
 */

import {
  UserDataSnapshot,
  DataQualityMetrics,
  AnomalyDetection,
} from "../types/recommendation";
import {
  PeriodRecord,
  MenstrualPhase,
  WorkImpactData,
  NutritionData,
} from "../types";

// 数据质量阈值配置
const DATA_QUALITY_THRESHOLDS = {
  // 数据完整性阈值
  LOW_THRESHOLD: 30, // 低于30%使用通用推荐
  MEDIUM_THRESHOLD: 60, // 30-60%使用混合推荐
  HIGH_THRESHOLD: 80, // 高于80%使用完全个性化推荐

  // 最小记录数要求
  MIN_PERIOD_RECORDS: 3, // 至少3个周期记录
  MIN_WORK_IMPACT_RECORDS: 7, // 至少7天工作影响记录

  // 数据质量评分权重
  WEIGHTS: {
    recordCount: 0.4,
    consistency: 0.3,
    completeness: 0.3,
  },
};

/**
 * 评估数据质量
 */
export function assessDataQuality(
  periodData: PeriodRecord[],
  workImpactRecords: WorkImpactData[] = [],
): DataQualityMetrics {
  // 评估经期数据质量
  const periodQuality = assessPeriodDataQuality(periodData);

  // 评估工作影响数据质量
  const workImpactQuality = assessWorkImpactQuality(workImpactRecords);

  // 计算整体质量
  const overallCompleteness =
    (periodQuality.completeness + workImpactQuality.accuracyScore) / 2;

  let overallQuality: "excellent" | "good" | "fair" | "poor";
  if (overallCompleteness >= 80) {
    overallQuality = "excellent";
  } else if (overallCompleteness >= 60) {
    overallQuality = "good";
  } else if (overallCompleteness >= 30) {
    overallQuality = "fair";
  } else {
    overallQuality = "poor";
  }

  return {
    periodDataQuality: periodQuality,
    workImpactQuality,
    overallQuality,
    dataCompleteness: overallCompleteness,
  };
}

/**
 * 评估经期数据质量
 */
function assessPeriodDataQuality(
  records: PeriodRecord[],
): DataQualityMetrics["periodDataQuality"] {
  const recordCount = records.length;

  // 计算一致性（周期规律性）
  const consistency = calculateCycleConsistency(records);

  // 计算完整度（字段填充率）
  const completeness = calculateCompleteness(records);

  return {
    recordCount,
    consistency,
    completeness,
    minRecordsForAnalysis: DATA_QUALITY_THRESHOLDS.MIN_PERIOD_RECORDS,
  };
}

/**
 * 评估工作影响数据质量
 */
function assessWorkImpactQuality(
  records: WorkImpactData[],
): DataQualityMetrics["workImpactQuality"] {
  const recordFrequency = records.length;

  // 计算准确度（基于记录频率和完整性）
  const accuracyScore = Math.min(100, (recordFrequency / 30) * 100); // 假设30天为满分

  return {
    recordFrequency,
    accuracyScore,
    minRecordsForAnalysis: DATA_QUALITY_THRESHOLDS.MIN_WORK_IMPACT_RECORDS,
  };
}

/**
 * 计算周期一致性
 */
function calculateCycleConsistency(records: PeriodRecord[]): number {
  if (records.length < 2) return 0;

  // 提取周期长度
  const cycleLengths: number[] = [];
  let lastPeriodDate: Date | null = null;

  for (const record of records.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )) {
    if (record.type === "period") {
      if (lastPeriodDate) {
        const daysDiff = Math.floor(
          (new Date(record.date).getTime() - lastPeriodDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        if (daysDiff > 0 && daysDiff < 60) {
          // 合理的周期范围
          cycleLengths.push(daysDiff);
        }
      }
      lastPeriodDate = new Date(record.date);
    }
  }

  if (cycleLengths.length < 2) return 50; // 数据不足，给中等分数

  // 计算标准差
  const mean = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
  const variance =
    cycleLengths.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    cycleLengths.length;
  const stdDev = Math.sqrt(variance);

  // 标准差越小，一致性越高
  const consistencyScore = Math.max(0, 100 - (stdDev / mean) * 100);

  return Math.min(100, consistencyScore);
}

/**
 * 计算数据完整度
 */
function calculateCompleteness(records: PeriodRecord[]): number {
  if (records.length === 0) return 0;

  let totalFields = 0;
  let filledFields = 0;

  for (const record of records) {
    totalFields += 3; // date, type, painLevel, flow, notes (至少3个必填)
    if (record.date) filledFields++;
    if (record.type) filledFields++;
    if (record.painLevel !== null && record.painLevel !== undefined)
      filledFields++;
    if (record.flow) filledFields++;
    if (record.notes) filledFields++;
  }

  return totalFields > 0 ? (filledFields / totalFields) * 100 : 0;
}

/**
 * 检测异常数据
 */
export function detectAnomalies(
  currentValue: number,
  historicalData: number[],
): AnomalyDetection | null {
  if (historicalData.length < 3) return null; // 数据不足，无法检测

  const mean = calculateMean(historicalData);
  const stdDev = calculateStdDev(historicalData);

  if (stdDev === 0) return null; // 无变化，不视为异常

  // 3σ原则：超过3倍标准差视为异常
  const deviation = Math.abs(currentValue - mean);
  if (deviation > 3 * stdDev) {
    return {
      isAnomaly: true,
      type: "pain_spike",
      severity: deviation > 4 * stdDev ? "severe" : "moderate",
      suggestion: "数据异常，建议医疗咨询",
    };
  }

  return null;
}

/**
 * 计算平均值
 */
function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * 计算标准差
 */
function calculateStdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = calculateMean(values);
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    values.length;
  return Math.sqrt(variance);
}

/**
 * 分析疼痛趋势
 */
export function analyzePainTrend(
  records: PeriodRecord[],
): "increasing" | "decreasing" | "stable" | "irregular" {
  if (records.length < 3) return "stable";

  const painLevels = records
    .filter((r) => r.painLevel !== null && r.painLevel !== undefined)
    .map((r) => r.painLevel as number)
    .sort((a, b) => a - b);

  if (painLevels.length < 3) return "stable";

  // 将数据分为三部分
  const third = Math.floor(painLevels.length / 3);
  const firstThird = painLevels.slice(0, third);
  const lastThird = painLevels.slice(-third);

  const firstAvg = calculateMean(firstThird);
  const lastAvg = calculateMean(lastThird);

  const diff = lastAvg - firstAvg;
  const threshold = 1.5; // 疼痛等级变化阈值

  if (diff > threshold) {
    return "increasing";
  } else if (diff < -threshold) {
    return "decreasing";
  } else {
    // 检查是否不规律（波动大）
    const stdDev = calculateStdDev(painLevels);
    if (stdDev > 2) {
      return "irregular";
    }
    return "stable";
  }
}

/**
 * 分析效率趋势
 */
export function analyzeEfficiencyTrend(
  efficiencyValues: number[],
): "improving" | "declining" | "stable" {
  if (efficiencyValues.length < 3) return "stable";

  const third = Math.floor(efficiencyValues.length / 3);
  const firstThird = efficiencyValues.slice(0, third);
  const lastThird = efficiencyValues.slice(-third);

  const firstAvg = calculateMean(firstThird);
  const lastAvg = calculateMean(lastThird);

  const diff = lastAvg - firstAvg;
  const threshold = 5; // 效率变化阈值（5%）

  if (diff > threshold) {
    return "improving";
  } else if (diff < -threshold) {
    return "declining";
  } else {
    return "stable";
  }
}

/**
 * 分析周期规律性
 */
export function analyzeCycleRegularity(
  records: PeriodRecord[],
): "regular" | "irregular" {
  const consistency = calculateCycleConsistency(records);
  return consistency >= 70 ? "regular" : "irregular";
}

/**
 * 计算平均周期长度
 */
export function calculateAverageCycleLength(records: PeriodRecord[]): number {
  if (records.length < 2) return 28; // 默认28天

  const cycleLengths: number[] = [];
  let lastPeriodDate: Date | null = null;

  for (const record of records.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )) {
    if (record.type === "period") {
      if (lastPeriodDate) {
        const daysDiff = Math.floor(
          (new Date(record.date).getTime() - lastPeriodDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        if (daysDiff > 0 && daysDiff < 60) {
          cycleLengths.push(daysDiff);
        }
      }
      lastPeriodDate = new Date(record.date);
    }
  }

  if (cycleLengths.length === 0) return 28;

  return Math.round(calculateMean(cycleLengths));
}

/**
 * 计算平均经期长度
 */
export function calculateAveragePeriodLength(records: PeriodRecord[]): number {
  if (records.length === 0) return 5; // 默认5天

  const periodLengths: number[] = [];
  let periodStart: Date | null = null;
  let periodEnd: Date | null = null;

  for (const record of records.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )) {
    if (record.type === "period") {
      if (!periodStart) {
        periodStart = new Date(record.date);
      }
      periodEnd = new Date(record.date);
    } else if (periodStart && periodEnd) {
      const daysDiff =
        Math.floor(
          (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24),
        ) + 1;
      if (daysDiff > 0 && daysDiff < 15) {
        periodLengths.push(daysDiff);
      }
      periodStart = null;
      periodEnd = null;
    }
  }

  if (periodLengths.length === 0) return 5;

  return Math.round(calculateMean(periodLengths));
}

/**
 * 计算平均疼痛等级
 */
export function calculateAveragePainLevel(records: PeriodRecord[]): number {
  const painLevels = records
    .filter((r) => r.painLevel !== null && r.painLevel !== undefined)
    .map((r) => r.painLevel as number);

  if (painLevels.length === 0) return 0;

  return Math.round(calculateMean(painLevels) * 10) / 10; // 保留一位小数
}

/**
 * 判断当前周期阶段
 */
export function determineCurrentPhase(
  records: PeriodRecord[],
  averageCycleLength: number,
): MenstrualPhase | null {
  if (records.length === 0) return null;

  // 找到最近的经期开始日期
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const lastPeriod = sortedRecords.find((r) => r.type === "period");
  if (!lastPeriod) return null;

  const daysSinceLastPeriod = Math.floor(
    (Date.now() - new Date(lastPeriod.date).getTime()) / (1000 * 60 * 60 * 24),
  );

  // 根据周期长度和天数判断阶段
  const cycleDay = daysSinceLastPeriod % averageCycleLength;

  if (cycleDay <= 5) {
    return "menstrual";
  } else if (cycleDay <= 13) {
    return "follicular";
  } else if (cycleDay <= 16) {
    return "ovulation";
  } else {
    return "luteal";
  }
}

/**
 * 创建用户数据快照
 */
export function createUserDataSnapshot(
  periodData: PeriodRecord[],
  workImpactData: WorkImpactData,
  nutritionData: NutritionData | null = null,
): UserDataSnapshot {
  // 计算统计数据
  const averageCycleLength = calculateAverageCycleLength(periodData);
  const averagePeriodLength = calculateAveragePeriodLength(periodData);
  const averagePainLevel = calculateAveragePainLevel(periodData);
  const painTrend = analyzePainTrend(periodData);
  const cycleRegularity = analyzeCycleRegularity(periodData);
  const currentPhase = determineCurrentPhase(periodData, averageCycleLength);

  // 评估数据质量
  const qualityMetrics = assessDataQuality(periodData, [workImpactData]);

  // 提取工作影响数据
  const currentPainLevel = workImpactData?.painLevel || 0;
  const currentEfficiency = workImpactData?.efficiency || 100;
  const efficiencyValues: number[] = []; // 这里需要从历史记录中提取
  const efficiencyTrend =
    efficiencyValues.length >= 3
      ? analyzeEfficiencyTrend(efficiencyValues)
      : "stable";

  return {
    periodData: {
      records: periodData,
      averageCycleLength,
      averagePeriodLength,
      averagePainLevel,
      painTrend,
      cycleRegularity,
      currentPhase,
    },
    workImpact: {
      currentPainLevel,
      currentEfficiency,
      averagePainLevel,
      averageEfficiency: currentEfficiency, // 简化处理
      painTrend,
      efficiencyTrend,
    },
    nutrition: {
      selectedPhase: nutritionData?.selectedPhase || "menstrual",
      constitutionType: nutritionData?.constitutionType || "balanced",
    },
    metadata: {
      dataQuality: qualityMetrics.overallQuality,
      dataCompleteness: qualityMetrics.dataCompleteness,
      lastUpdate: new Date(),
    },
  };
}
