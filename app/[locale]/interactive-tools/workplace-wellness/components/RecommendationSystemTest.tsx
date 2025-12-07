/**
 * 推荐系统测试组件
 * 用于在浏览器中测试推荐系统功能
 */

"use client";

import React, { useState } from "react";

// 错误处理工具函数
const formatErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error ?? "Unknown error");
import {
  generateRecommendations,
  generateColdStartRecommendations,
} from "../utils/recommendationEngine";
import {
  createTestPeriodData,
  createTestWorkImpactData,
  createTestNutritionData,
  validateRecommendationResult,
} from "../utils/recommendationTestUtils";
import { RecommendationFeedbackHistory } from "../types";
import { CheckCircle, X, AlertTriangle, Clock, BarChart3 } from "lucide-react";
import {
  analyzeRecommendationQuality,
  validateRecommendationReasonableness,
} from "../utils/recommendationQualityAnalyzer";
import { analyzeFeedback } from "../utils/feedbackAnalyzer";
import { generateOptimizationReport } from "../utils/recommendationOptimizer";
import { createUserDataSnapshot } from "../utils/dataAnalyzer";

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: string;
  duration?: number;
}

export default function RecommendationSystemTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<{
    total: number;
    passed: number;
    failed: number;
  } | null>(null);
  const [optimizationReport, setOptimizationReport] = useState<string | null>(
    null,
  );
  const [showOptimization, setShowOptimization] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    const results: TestResult[] = [];

    const feedbackHistory: RecommendationFeedbackHistory = {
      feedbacks: [],
      ignoredItems: [],
      savedItems: [],
      itemRatings: {},
    };

    // 测试1: 正常数据推荐生成
    try {
      const start = performance.now();
      const periodData = createTestPeriodData(10);
      const workImpact = createTestWorkImpactData();
      const nutrition = createTestNutritionData();

      const result = generateRecommendations(
        periodData,
        workImpact,
        nutrition,
        feedbackHistory,
      );

      const duration = performance.now() - start;
      const validation = validateRecommendationResult(result);

      results.push({
        name: "正常数据推荐生成",
        passed: validation.valid,
        message: validation.valid
          ? `成功生成 ${result.recommendations.length} 个推荐`
          : "验证失败",
        details: validation.errors.join(", ") || undefined,
        duration,
      });
    } catch (error) {
      results.push({
        name: "正常数据推荐生成",
        passed: false,
        message: "测试失败",
        details: formatErrorMessage(error),
      });
    }

    // 测试2: 冷启动（数据不足）
    try {
      const start = performance.now();
      const periodData = createTestPeriodData(2);
      const workImpact = createTestWorkImpactData();
      const nutrition = createTestNutritionData();

      const result = generateRecommendations(
        periodData,
        workImpact,
        nutrition,
        feedbackHistory,
      );

      const duration = performance.now() - start;
      const validation = validateRecommendationResult(result);

      results.push({
        name: "冷启动推荐生成",
        passed: validation.valid && result.recommendations.length > 0,
        message: `生成 ${result.recommendations.length} 个推荐`,
        details: validation.errors.join(", ") || undefined,
        duration,
      });
    } catch (error) {
      results.push({
        name: "冷启动推荐生成",
        passed: false,
        message: "测试失败",
        details: formatErrorMessage(error),
      });
    }

    // 测试3: 高疼痛等级推荐
    try {
      const start = performance.now();
      const periodData = createTestPeriodData(10);
      const workImpact = createTestWorkImpactData();
      workImpact.painLevel = 8;
      const nutrition = createTestNutritionData();

      const result = generateRecommendations(
        periodData,
        workImpact,
        nutrition,
        feedbackHistory,
      );

      const duration = performance.now() - start;
      const painReliefCount = result.recommendations.filter(
        (r) => r.category === "pain-relief" || r.category === "medical",
      ).length;

      results.push({
        name: "高疼痛等级推荐",
        passed: painReliefCount > 0,
        message: `推荐了 ${painReliefCount} 个疼痛缓解/医疗相关推荐`,
        details: painReliefCount === 0 ? "应该推荐疼痛缓解内容" : undefined,
        duration,
      });
    } catch (error) {
      results.push({
        name: "高疼痛等级推荐",
        passed: false,
        message: "测试失败",
        details: formatErrorMessage(error),
      });
    }

    // 测试4: 低效率推荐
    try {
      const start = performance.now();
      const periodData = createTestPeriodData(10);
      const workImpact = createTestWorkImpactData();
      workImpact.efficiency = 50;
      const nutrition = createTestNutritionData();

      const result = generateRecommendations(
        periodData,
        workImpact,
        nutrition,
        feedbackHistory,
      );

      const duration = performance.now() - start;
      const workAdjustmentCount = result.recommendations.filter(
        (r) => r.category === "work-adjustment",
      ).length;

      results.push({
        name: "低效率推荐",
        passed: workAdjustmentCount > 0,
        message: `推荐了 ${workAdjustmentCount} 个工作调整相关推荐`,
        details: workAdjustmentCount === 0 ? "应该推荐工作调整内容" : undefined,
        duration,
      });
    } catch (error) {
      results.push({
        name: "低效率推荐",
        passed: false,
        message: "测试失败",
        details: formatErrorMessage(error),
      });
    }

    // 测试5: 性能测试
    try {
      const iterations = 5;
      const times: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        generateRecommendations(
          createTestPeriodData(10),
          createTestWorkImpactData(),
          createTestNutritionData(),
          feedbackHistory,
        );
        times.push(performance.now() - start);
      }

      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const maxTime = Math.max(...times);

      results.push({
        name: "性能测试",
        passed: avgTime < 500,
        message: `平均生成时间: ${avgTime.toFixed(2)}ms`,
        details:
          avgTime >= 500
            ? "性能需要优化（目标: <500ms）"
            : `最快: ${Math.min(...times).toFixed(
                2,
              )}ms, 最慢: ${maxTime.toFixed(2)}ms`,
        duration: avgTime,
      });
    } catch (error) {
      results.push({
        name: "性能测试",
        passed: false,
        message: "测试失败",
        details: formatErrorMessage(error),
      });
    }

    // 测试6: 推荐多样性
    try {
      const start = performance.now();
      const periodData = createTestPeriodData(10);
      const workImpact = createTestWorkImpactData();
      const nutrition = createTestNutritionData();

      const result = generateRecommendations(
        periodData,
        workImpact,
        nutrition,
        feedbackHistory,
      );

      const duration = performance.now() - start;
      const categories = new Set(result.recommendations.map((r) => r.category));
      const types = new Set(result.recommendations.map((r) => r.type));

      results.push({
        name: "推荐多样性",
        passed: categories.size >= 3 && types.size >= 2,
        message: `${categories.size} 个分类, ${types.size} 种类型`,
        details:
          categories.size < 3 || types.size < 2
            ? "推荐多样性不足"
            : "推荐具有良好的多样性",
        duration,
      });
    } catch (error) {
      results.push({
        name: "推荐多样性",
        passed: false,
        message: "测试失败",
        details: formatErrorMessage(error),
      });
    }

    // 测试7: 空数据测试
    try {
      const start = performance.now();
      const result = generateRecommendations(
        [],
        createTestWorkImpactData(),
        createTestNutritionData(),
        feedbackHistory,
      );

      const duration = performance.now() - start;

      results.push({
        name: "空数据测试",
        passed: result.recommendations.length > 0,
        message: `生成 ${result.recommendations.length} 个推荐`,
        details:
          result.recommendations.length === 0
            ? "应该返回冷启动推荐"
            : "冷启动处理正常",
        duration,
      });
    } catch (error) {
      results.push({
        name: "空数据测试",
        passed: false,
        message: "测试失败",
        details: formatErrorMessage(error),
      });
    }

    // 测试8: 冷启动推荐
    try {
      const start = performance.now();
      const items = generateColdStartRecommendations(feedbackHistory);
      const duration = performance.now() - start;

      results.push({
        name: "冷启动推荐",
        passed: items.length > 0,
        message: `生成 ${items.length} 个通用推荐`,
        details: items.length === 0 ? "应该返回通用推荐" : undefined,
        duration,
      });
    } catch (error) {
      results.push({
        name: "冷启动推荐",
        passed: false,
        message: "测试失败",
        details: formatErrorMessage(error),
      });
    }

    // 测试9: 推荐质量分析
    try {
      const start = performance.now();
      const periodData = createTestPeriodData(10);
      const workImpact = createTestWorkImpactData();
      const nutrition = createTestNutritionData();

      const result = generateRecommendations(
        periodData,
        workImpact,
        nutrition,
        feedbackHistory,
      );

      const userData = createUserDataSnapshot(
        periodData,
        workImpact,
        nutrition,
      );
      const qualityAnalysis = analyzeRecommendationQuality(result, userData);
      const reasonableness = validateRecommendationReasonableness(
        result,
        userData,
      );

      const duration = performance.now() - start;

      results.push({
        name: "推荐质量分析",
        passed: qualityAnalysis.metrics.overall >= 60 && reasonableness.valid,
        message: `综合质量: ${qualityAnalysis.metrics.overall}/100`,
        details:
          reasonableness.issues.length > 0
            ? reasonableness.issues.join(", ")
            : `相关性: ${qualityAnalysis.metrics.relevance}, 多样性: ${qualityAnalysis.metrics.diversity}`,
        duration,
      });
    } catch (error) {
      results.push({
        name: "推荐质量分析",
        passed: false,
        message: "测试失败",
        details: formatErrorMessage(error),
      });
    }

    // 测试10: 用户反馈分析
    try {
      const start = performance.now();
      const feedbackAnalysis = analyzeFeedback(feedbackHistory);
      const duration = performance.now() - start;

      results.push({
        name: "用户反馈分析",
        passed: true,
        message: `总反馈: ${feedbackAnalysis.totalFeedback}, 点击率: ${feedbackAnalysis.clickRate}%`,
        details:
          feedbackAnalysis.insights.length > 0
            ? feedbackAnalysis.insights[0]
            : "暂无反馈数据",
        duration,
      });
    } catch (error) {
      results.push({
        name: "用户反馈分析",
        passed: false,
        message: "测试失败",
        details: formatErrorMessage(error),
      });
    }

    setTestResults(results);
    setSummary({
      total: results.length,
      passed: results.filter((r) => r.passed).length,
      failed: results.filter((r) => !r.passed).length,
    });

    // 生成优化报告
    try {
      const periodData = createTestPeriodData(10);
      const workImpact = createTestWorkImpactData();
      const nutrition = createTestNutritionData();
      const result = generateRecommendations(
        periodData,
        workImpact,
        nutrition,
        feedbackHistory,
      );
      const userData = createUserDataSnapshot(
        periodData,
        workImpact,
        nutrition,
      );
      const report = generateOptimizationReport(
        result,
        userData,
        feedbackHistory,
      );
      setOptimizationReport(report);
    } catch (error) {
      setOptimizationReport(formatErrorMessage(error));
    }

    setIsRunning(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">推荐系统测试</h2>
          <p className="text-sm text-gray-600">测试推荐系统的各项功能和性能</p>
        </div>
        <div className="flex items-center gap-2">
          {optimizationReport && (
            <button
              onClick={() => setShowOptimization(!showOptimization)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              优化建议
            </button>
          )}
          <button
            onClick={runTests}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? "测试中..." : "运行测试"}
          </button>
        </div>
      </div>

      {summary && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-sm text-gray-600">总测试数</div>
              <div className="text-2xl font-bold text-gray-900">
                {summary.total}
              </div>
            </div>
            <div>
              <div className="text-sm text-green-600">通过</div>
              <div className="text-2xl font-bold text-green-600">
                {summary.passed}
              </div>
            </div>
            <div>
              <div className="text-sm text-red-600">失败</div>
              <div className="text-2xl font-bold text-red-600">
                {summary.failed}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">通过率</div>
              <div className="text-2xl font-bold text-gray-900">
                {((summary.passed / summary.total) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {testResults.length > 0 && (
        <div className="space-y-3">
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                result.passed
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {result.passed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium text-gray-900">
                      {result.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 ml-7">{result.message}</p>
                  {result.details && (
                    <p className="text-xs text-gray-600 mt-1 ml-7">
                      {result.details}
                    </p>
                  )}
                </div>
                {result.duration !== undefined && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {result.duration.toFixed(2)}ms
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isRunning && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">正在运行测试...</p>
        </div>
      )}

      {!isRunning && testResults.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>点击&quot;运行测试&quot;按钮开始测试</p>
        </div>
      )}

      {/* 优化建议面板 */}
      {optimizationReport && showOptimization && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              优化建议
            </h3>
            <button
              onClick={() => setShowOptimization(false)}
              className="p-1 rounded-md hover:bg-blue-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-white p-4 rounded border border-blue-100 max-h-96 overflow-y-auto">
            {optimizationReport}
          </pre>
        </div>
      )}
    </div>
  );
}
