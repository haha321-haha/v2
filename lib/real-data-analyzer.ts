/**
 * Real Data Analyzer - 真实数据分析器
 * 分析收集的用户数据
 */

import { getAllDataPoints } from "./real-data-collector";

export interface AnalysisResult {
  totalDataPoints: number;
  dataByType: Record<string, number>;
  timeRange: {
    start: number;
    end: number;
  };
  sessionsCount: number;
  averagePointsPerSession: number;
}

/**
 * 分析所有数据
 */
export function analyzeAllData(): AnalysisResult {
  const dataPoints = getAllDataPoints();

  if (dataPoints.length === 0) {
    return {
      totalDataPoints: 0,
      dataByType: {},
      timeRange: { start: 0, end: 0 },
      sessionsCount: 0,
      averagePointsPerSession: 0,
    };
  }

  // 按类型统计
  const dataByType: Record<string, number> = {};
  dataPoints.forEach((point) => {
    dataByType[point.type] = (dataByType[point.type] || 0) + 1;
  });

  // 时间范围
  const timestamps = dataPoints.map((p) => p.timestamp);
  const timeRange = {
    start: Math.min(...timestamps),
    end: Math.max(...timestamps),
  };

  // 会话统计
  const uniqueSessions = new Set(dataPoints.map((p) => p.sessionId));
  const sessionsCount = uniqueSessions.size;
  const averagePointsPerSession = dataPoints.length / sessionsCount;

  return {
    totalDataPoints: dataPoints.length,
    dataByType,
    timeRange,
    sessionsCount,
    averagePointsPerSession,
  };
}

/**
 * 分析特定类型的数据
 */
export interface TypeAnalysisResult {
  count: number;
  firstOccurrence: number;
  lastOccurrence: number;
  data: unknown[];
}

export function analyzeDataByType(type: string): TypeAnalysisResult | null {
  const dataPoints = getAllDataPoints().filter((p) => p.type === type);

  if (dataPoints.length === 0) return null;

  return {
    count: dataPoints.length,
    firstOccurrence: Math.min(...dataPoints.map((p) => p.timestamp)),
    lastOccurrence: Math.max(...dataPoints.map((p) => p.timestamp)),
    data: dataPoints.map((p) => p.data),
  };
}

/**
 * 导出 realDataAnalyzer 对象（兼容性）
 */
export const realDataAnalyzer = {
  analyzeAllData,
  analyzeDataByType,
};
