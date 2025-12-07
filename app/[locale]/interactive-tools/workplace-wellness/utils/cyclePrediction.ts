/**
 * HVsLYEp职场健康助手 - 周期预测算法
 * 基于HVsLYEp的周期计算逻辑进行增强
 */

import { PeriodRecord, MenstrualPhase } from "../types";

export interface CycleAnalysis {
  averageCycleLength: number;
  averagePeriodLength: number;
  cycleRegularity: "regular" | "irregular" | "very-irregular";
  lastPeriodDate: string | null;
  nextPredictedPeriod: string | null;
  nextPredictedOvulation: string | null;
  currentPhase: MenstrualPhase | null;
  phaseProgress: number; // 0-100
  confidence: number; // 0-100
}

export interface CycleStatistics {
  totalCycles: number;
  cycleLengths: number[];
  periodLengths: number[];
  averagePainLevel: number;
  mostCommonFlow: "light" | "medium" | "heavy" | null;
  symptoms: string[];
}

export class CyclePredictor {
  private locale: string;

  constructor(locale: string) {
    this.locale = locale;
  }

  /**
   * 分析周期数据并生成预测
   */
  public analyzeCycle(periodData: PeriodRecord[]): CycleAnalysis {
    const periods = this.extractPeriods(periodData);

    if (periods.length === 0) {
      return this.getEmptyAnalysis();
    }

    const cycleLengths = this.calculateCycleLengths(periods);
    const periodLengths = this.calculatePeriodLengths(periods);

    const averageCycleLength = this.calculateAverage(cycleLengths);
    const averagePeriodLength = this.calculateAverage(periodLengths);
    const cycleRegularity = this.assessRegularity(cycleLengths);

    const lastPeriod = periods[periods.length - 1];
    const nextPredictedPeriod = this.predictNextPeriod(
      lastPeriod,
      averageCycleLength,
    );
    const nextPredictedOvulation =
      this.predictNextOvulation(nextPredictedPeriod);

    const currentPhase = this.determineCurrentPhase(
      lastPeriod,
      averageCycleLength,
    );
    const phaseProgress = this.calculatePhaseProgress(
      lastPeriod,
      averageCycleLength,
    );
    const confidence = this.calculateConfidence(cycleLengths, cycleRegularity);

    return {
      averageCycleLength,
      averagePeriodLength,
      cycleRegularity,
      lastPeriodDate: lastPeriod.startDate,
      nextPredictedPeriod,
      nextPredictedOvulation,
      currentPhase,
      phaseProgress,
      confidence,
    };
  }

  /**
   * 生成周期统计信息
   */
  public generateStatistics(periodData: PeriodRecord[]): CycleStatistics {
    const periods = this.extractPeriods(periodData);

    if (periods.length === 0) {
      return {
        totalCycles: 0,
        cycleLengths: [],
        periodLengths: [],
        averagePainLevel: 0,
        mostCommonFlow: null,
        symptoms: [],
      };
    }

    const cycleLengths = this.calculateCycleLengths(periods);
    const periodLengths = this.calculatePeriodLengths(periods);

    const painLevels = periodData
      .filter((d) => d.painLevel !== null)
      .map((d) => d.painLevel!);

    const flows = periodData.filter((d) => d.flow !== null).map((d) => d.flow!);

    const symptoms = periodData
      .filter((d) => d.notes && d.notes.trim())
      .map((d) => d.notes!)
      .filter((note, index, arr) => arr.indexOf(note) === index);

    return {
      totalCycles: periods.length,
      cycleLengths,
      periodLengths,
      averagePainLevel: this.calculateAverage(painLevels),
      mostCommonFlow: this.getMostCommon(flows),
      symptoms,
    };
  }

  /**
   * 预测未来几个月的周期
   */
  public predictFutureCycles(
    periodData: PeriodRecord[],
    months: number = 3,
  ): {
    date: string;
    type: "period" | "ovulation";
    confidence: number;
  }[] {
    const analysis = this.analyzeCycle(periodData);
    const predictions: {
      date: string;
      type: "period" | "ovulation";
      confidence: number;
    }[] = [];

    if (!analysis.nextPredictedPeriod) return predictions;

    const currentDate = new Date(analysis.nextPredictedPeriod);

    for (let month = 0; month < months; month++) {
      // 预测经期
      predictions.push({
        date: currentDate.toISOString().split("T")[0],
        type: "period",
        confidence: analysis.confidence,
      });

      // 预测排卵期
      const ovulationDate = new Date(currentDate);
      ovulationDate.setDate(ovulationDate.getDate() - 14); // 假设排卵期在经期前14天
      predictions.push({
        date: ovulationDate.toISOString().split("T")[0],
        type: "ovulation",
        confidence: analysis.confidence * 0.8, // 排卵期预测置信度较低
      });

      // 移动到下一个周期
      currentDate.setDate(currentDate.getDate() + analysis.averageCycleLength);
    }

    return predictions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }

  /**
   * 提取完整的经期记录
   */
  private extractPeriods(periodData: PeriodRecord[]): Array<{
    startDate: string;
    endDate: string;
    records: PeriodRecord[];
  }> {
    const periods: Array<{
      startDate: string;
      endDate: string;
      records: PeriodRecord[];
    }> = [];
    const periodRecords = periodData
      .filter((d) => d.type === "period")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let currentPeriod: PeriodRecord[] = [];
    let periodStart: string | null = null;

    for (let i = 0; i < periodRecords.length; i++) {
      const record = periodRecords[i];
      const recordDate = new Date(record.date);

      if (!periodStart) {
        periodStart = record.date;
        currentPeriod = [record];
      } else {
        const lastRecordDate = new Date(
          currentPeriod[currentPeriod.length - 1].date,
        );
        const daysDiff =
          (recordDate.getTime() - lastRecordDate.getTime()) /
          (1000 * 60 * 60 * 24);

        if (daysDiff <= 1) {
          // 连续日期，属于同一经期
          currentPeriod.push(record);
        } else {
          // 间隔超过1天，结束当前经期
          periods.push({
            startDate: periodStart,
            endDate: currentPeriod[currentPeriod.length - 1].date,
            records: currentPeriod,
          });

          // 开始新经期
          periodStart = record.date;
          currentPeriod = [record];
        }
      }
    }

    // 添加最后一个经期
    if (currentPeriod.length > 0 && periodStart) {
      periods.push({
        startDate: periodStart,
        endDate: currentPeriod[currentPeriod.length - 1].date,
        records: currentPeriod,
      });
    }

    return periods;
  }

  /**
   * 计算周期长度
   */
  private calculateCycleLengths(
    periods: Array<{
      startDate: string;
      endDate: string;
      records: PeriodRecord[];
    }>,
  ): number[] {
    const lengths: number[] = [];

    for (let i = 1; i < periods.length; i++) {
      const prevStart = new Date(periods[i - 1].startDate);
      const currentStart = new Date(periods[i].startDate);
      const length =
        (currentStart.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24);
      lengths.push(length);
    }

    return lengths;
  }

  /**
   * 计算经期长度
   */
  private calculatePeriodLengths(
    periods: Array<{
      startDate: string;
      endDate: string;
      records: PeriodRecord[];
    }>,
  ): number[] {
    return periods.map((period) => {
      const start = new Date(period.startDate);
      const end = new Date(period.endDate);
      return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;
    });
  }

  /**
   * 计算平均值
   */
  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }

  /**
   * 评估周期规律性
   */
  private assessRegularity(
    cycleLengths: number[],
  ): "regular" | "irregular" | "very-irregular" {
    if (cycleLengths.length < 3) return "irregular";

    const average = this.calculateAverage(cycleLengths);
    const variance =
      cycleLengths.reduce(
        (sum, length) => sum + Math.pow(length - average, 2),
        0,
      ) / cycleLengths.length;
    const standardDeviation = Math.sqrt(variance);

    if (standardDeviation <= 2) return "regular";
    if (standardDeviation <= 7) return "irregular";
    return "very-irregular";
  }

  /**
   * 预测下次经期
   */
  private predictNextPeriod(
    lastPeriod: { startDate: string; endDate: string; records: PeriodRecord[] },
    averageCycleLength: number,
  ): string | null {
    if (!lastPeriod) return null;

    const lastStart = new Date(lastPeriod.startDate);
    const nextStart = new Date(lastStart);
    nextStart.setDate(nextStart.getDate() + averageCycleLength);

    return nextStart.toISOString().split("T")[0];
  }

  /**
   * 预测下次排卵期
   */
  private predictNextOvulation(nextPeriod: string | null): string | null {
    if (!nextPeriod) return null;

    const periodDate = new Date(nextPeriod);
    const ovulationDate = new Date(periodDate);
    ovulationDate.setDate(ovulationDate.getDate() - 14);

    return ovulationDate.toISOString().split("T")[0];
  }

  /**
   * 确定当前阶段
   */
  private determineCurrentPhase(
    lastPeriod: { startDate: string; endDate: string; records: PeriodRecord[] },
    averageCycleLength: number,
  ): MenstrualPhase | null {
    if (!lastPeriod) return null;

    const lastStart = new Date(lastPeriod.startDate);
    const today = new Date();
    const daysSinceLastPeriod =
      (today.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceLastPeriod < 0) return "menstrual"; // Default to menstrual if date is in future (shouldn't happen but safe fallback)

    const cycleProgress =
      (daysSinceLastPeriod % averageCycleLength) / averageCycleLength;

    if (cycleProgress < 0.25) return "menstrual";
    if (cycleProgress < 0.5) return "follicular";
    if (cycleProgress < 0.75) return "ovulation";
    return "luteal";
  }

  /**
   * 计算阶段进度
   */
  private calculatePhaseProgress(
    lastPeriod: { startDate: string; endDate: string; records: PeriodRecord[] },
    averageCycleLength: number,
  ): number {
    if (!lastPeriod) return 0;

    const lastStart = new Date(lastPeriod.startDate);
    const today = new Date();
    const daysSinceLastPeriod =
      (today.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceLastPeriod < 0) return 0;

    const cycleProgress =
      (daysSinceLastPeriod % averageCycleLength) / averageCycleLength;
    return Math.round(cycleProgress * 100);
  }

  /**
   * 计算预测置信度
   */
  private calculateConfidence(
    cycleLengths: number[],
    regularity: "regular" | "irregular" | "very-irregular",
  ): number {
    if (cycleLengths.length === 0) return 0;
    if (cycleLengths.length < 3) return 30;

    const baseConfidence = Math.min(90, 50 + cycleLengths.length * 5);

    switch (regularity) {
      case "regular":
        return baseConfidence;
      case "irregular":
        return baseConfidence * 0.7;
      case "very-irregular":
        return baseConfidence * 0.4;
      default:
        return baseConfidence;
    }
  }

  /**
   * 获取最常见的值
   */
  private getMostCommon<T>(array: T[]): T | null {
    if (array.length === 0) return null;

    const counts = array.reduce(
      (acc, item) => {
        acc[item as string] = (acc[item as string] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b,
    ) as T;
  }

  /**
   * 获取空分析结果
   */
  private getEmptyAnalysis(): CycleAnalysis {
    return {
      averageCycleLength: 0,
      averagePeriodLength: 0,
      cycleRegularity: "irregular",
      lastPeriodDate: null,
      nextPredictedPeriod: null,
      nextPredictedOvulation: null,
      currentPhase: null,
      phaseProgress: 0,
      confidence: 0,
    };
  }
}
