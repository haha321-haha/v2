/**
 * A/B Test Real Data Bridge - A/B 测试与真实数据桥接
 * 连接 A/B 测试和真实数据收集
 */

import { getABTestVariant, trackABTestEvent } from "./ab-test-tracking";
import { collectDataPoint } from "./real-data-collector";

/**
 * 收集带 A/B 测试信息的数据
 */
export function collectWithABTest(
  testName: string,
  dataType: string,
  data: unknown,
): boolean {
  const variant = getABTestVariant(testName);

  const enrichedData = {
    ...(typeof data === "object" && data !== null ? data : {}),
    abTest: {
      testName,
      variant,
    },
  };

  // 同时记录到两个系统
  trackABTestEvent(testName, dataType, data);
  return collectDataPoint(dataType, enrichedData);
}

/**
 * 分析 A/B 测试的真实数据
 */
export interface ABTestAnalysisResult {
  testName: string;
  message: string;
}

export function analyzeABTestData(testName: string): ABTestAnalysisResult {
  // 这里可以实现更复杂的分析逻辑
  return {
    testName,
    message: "Analysis not implemented yet",
  };
}

/**
 * 导出 realDataABTestBridge 对象（兼容性）
 */
export const realDataABTestBridge = {
  collectWithABTest,
  analyzeABTestData,
};
