/**
 * HVsLYEp职场健康助手 - 高级周期分析组件
 * Day 9: 数据分析功能增强
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Activity,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useCalendar } from "../hooks/useWorkplaceWellnessStore";
import {
  CyclePredictor,
  CycleAnalysis,
  CycleStatistics,
} from "../utils/cyclePrediction";
import { PeriodRecord, CalendarState } from "../types";
import { logError } from "@/lib/debug-logger";

type FlowType = "light" | "medium" | "heavy";

interface TrendData {
  month: string;
  cycleLength: number;
  painLevel: number;
  flowType: FlowType;
}

interface ComparisonData {
  current: number;
  previous: number;
  average: number;
  trend: "up" | "down" | "stable";
}

type AdvancedTab = "overview" | "trends" | "comparison" | "insights";

export default function AdvancedCycleAnalysis() {
  const locale = useLocale();
  const t = useTranslations("workplaceWellness");
  const calendar = useCalendar() as CalendarState;
  const [activeTab, setActiveTab] = useState<AdvancedTab>("overview");
  const [analysis, setAnalysis] = useState<CycleAnalysis | null>(null);
  const [statistics, setStatistics] = useState<CycleStatistics | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(
    null,
  );

  // 从 store 读取 periodData - 确保类型安全
  const periodData = useMemo(
    () =>
      calendar && "periodData" in calendar ? calendar.periodData || [] : [],
    [calendar],
  );

  // 生成趋势数据
  const generateTrendData = useCallback((data: PeriodRecord[]) => {
    const trends: TrendData[] = [];
    const monthlyData = new Map<string, PeriodRecord[]>();

    // 按月份分组数据
    data.forEach((record) => {
      const month = new Date(record.date).toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData.has(month)) {
        monthlyData.set(month, []);
      }
      monthlyData.get(month)!.push(record);
    });

    // 计算每月趋势
    monthlyData.forEach((records, month) => {
      const periodRecords = records.filter((r) => r.type === "period");
      if (periodRecords.length > 0) {
        const avgPain =
          periodRecords.reduce((sum, r) => sum + (r.painLevel || 0), 0) /
          periodRecords.length;
        const mostCommonFlow = getMostCommonFlow(periodRecords);

        trends.push({
          month,
          cycleLength: calculateCycleLength(periodRecords),
          painLevel: avgPain,
          flowType: mostCommonFlow,
        });
      }
    });

    setTrendData(trends.sort((a, b) => a.month.localeCompare(b.month)));
  }, []);

  // 生成对比数据
  const generateComparisonData = useCallback(
    (data: PeriodRecord[], analysis: CycleAnalysis) => {
      const recentCycles = data.filter((r) => r.type === "period").slice(-6);
      const previousCycles = data
        .filter((r) => r.type === "period")
        .slice(-12, -6);

      if (recentCycles.length >= 3 && previousCycles.length >= 3) {
        const currentAvg =
          recentCycles.reduce((sum, r) => sum + (r.painLevel || 0), 0) /
          recentCycles.length;
        const previousAvg =
          previousCycles.reduce((sum, r) => sum + (r.painLevel || 0), 0) /
          previousCycles.length;

        let trend: "up" | "down" | "stable" = "stable";
        if (currentAvg > previousAvg + 0.5) trend = "up";
        else if (currentAvg < previousAvg - 0.5) trend = "down";

        setComparisonData({
          current: currentAvg,
          previous: previousAvg,
          average: analysis.averageCycleLength,
          trend,
        });
      }
    },
    [],
  );

  useEffect(() => {
    try {
      const predictor = new CyclePredictor(locale);
      const cycleAnalysis = predictor.analyzeCycle(periodData);
      const cycleStats = predictor.generateStatistics(periodData);

      setAnalysis(cycleAnalysis);
      setStatistics(cycleStats);

      generateTrendData(periodData);
      generateComparisonData(periodData, cycleAnalysis);
    } catch (error) {
      logError(
        "Failed to generate advanced cycle analysis",
        error,
        "AdvancedCycleAnalysis",
      );
    }
  }, [periodData, locale, generateTrendData, generateComparisonData]);

  // 辅助函数
  const getMostCommonFlow = (
    records: PeriodRecord[],
  ): "light" | "medium" | "heavy" => {
    const flows = records.map((r) => r.flow).filter(Boolean);
    const counts = { light: 0, medium: 0, heavy: 0 };
    flows.forEach((flow) => counts[flow!]++);
    return Object.entries(counts).reduce((a, b) =>
      counts[a[0] as keyof typeof counts] > counts[b[0] as keyof typeof counts]
        ? a
        : b,
    )[0] as "light" | "medium" | "heavy";
  };

  const calculateCycleLength = (records: PeriodRecord[]): number => {
    if (records.length < 2) return 0;
    const sorted = records.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const first = new Date(sorted[0].date);
    const last = new Date(sorted[sorted.length - 1].date);
    return Math.round(
      (last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24),
    );
  };

  // 渲染趋势图表
  const renderTrendChart = () => {
    if (trendData.length === 0) {
      return (
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{t("analysis.noTrendData")}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {trendData.map((trend, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-800">
                {new Date(trend.month + "-01").toLocaleDateString(
                  locale === "zh" ? "zh-CN" : "en-US",
                  { year: "numeric", month: "long" },
                )}
              </h4>
              <span className="text-sm text-gray-600">
                {trend.cycleLength} {t("charts.days")}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {trend.cycleLength}
                </div>
                <div className="text-xs text-gray-600">
                  {t("analysis.cycleLength")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600">
                  {trend.painLevel.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">
                  {t("analysis.avgPain")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {t(`export.flowTypes.${trend.flowType}`)}
                </div>
                <div className="text-xs text-gray-600">
                  {t("analysis.commonFlow")}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染对比分析
  const renderComparisonAnalysis = () => {
    if (!comparisonData) {
      return (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{t("analysis.noComparisonData")}</p>
        </div>
      );
    }

    const getTrendIcon = () => {
      switch (comparisonData.trend) {
        case "up":
          return <TrendingUp className="w-5 h-5 text-red-500" />;
        case "down":
          return <TrendingUp className="w-5 h-5 text-green-500 rotate-180" />;
        default:
          return <Activity className="w-5 h-5 text-blue-500" />;
      }
    };

    const getTrendText = () => {
      switch (comparisonData.trend) {
        case "up":
          return t("analysis.trendUp");
        case "down":
          return t("analysis.trendDown");
        default:
          return t("analysis.trendStable");
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-600" />
            {t("analysis.comparisonTitle")}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  {t("analysis.currentPeriod")}
                </span>
                {getTrendIcon()}
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {comparisonData.current.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">{getTrendText()}</div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">
                {t("analysis.previousPeriod")}
              </div>
              <div className="text-2xl font-bold text-gray-600">
                {comparisonData.previous.toFixed(1)}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">
                {t("analysis.averageCycle")}
              </div>
              <div className="text-2xl font-bold text-green-600">
                {comparisonData.average.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染智能洞察
  const renderInsights = () => {
    if (!analysis || !statistics) return null;

    const insights = [];

    // 周期规律性洞察
    if (analysis.cycleRegularity === "regular") {
      insights.push({
        type: "success",
        icon: CheckCircle,
        title: t("insights.regularCycle"),
        description: t("insights.regularCycleDesc"),
        color: "text-green-600",
        bgColor: "bg-green-50",
      });
    } else if (analysis.cycleRegularity === "irregular") {
      insights.push({
        type: "warning",
        icon: AlertTriangle,
        title: t("insights.irregularCycle"),
        description: t("insights.irregularCycleDesc"),
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
      });
    }

    // 疼痛水平洞察
    if (statistics.averagePainLevel > 7) {
      insights.push({
        type: "warning",
        icon: AlertTriangle,
        title: t("insights.highPain"),
        description: t("insights.highPainDesc"),
        color: "text-red-600",
        bgColor: "bg-red-50",
      });
    } else if (statistics.averagePainLevel < 3) {
      insights.push({
        type: "success",
        icon: CheckCircle,
        title: t("insights.lowPain"),
        description: t("insights.lowPainDesc"),
        color: "text-green-600",
        bgColor: "bg-green-50",
      });
    }

    // 预测准确性洞察
    if (analysis.confidence > 80) {
      insights.push({
        type: "info",
        icon: Info,
        title: t("insights.highAccuracy"),
        description: t("insights.highAccuracyDesc"),
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      });
    }

    return (
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className={`${insight.bgColor} rounded-lg p-4`}>
            <div className="flex items-start space-x-3">
              <insight.icon className={`w-6 h-6 ${insight.color} mt-1`} />
              <div>
                <h4 className={`font-semibold ${insight.color} mb-1`}>
                  {insight.title}
                </h4>
                <p className="text-sm text-gray-700">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
      <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-primary-500" />
        {t("analysis.advancedTitle")}
      </h4>

      {/* 标签页导航 */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            {
              id: "overview",
              label: t("analysis.tabs.overview"),
              icon: BarChart3,
            },
            {
              id: "trends",
              label: t("analysis.tabs.trends"),
              icon: TrendingUp,
            },
            {
              id: "comparison",
              label: t("analysis.tabs.comparison"),
              icon: Target,
            },
            {
              id: "insights",
              label: t("analysis.tabs.insights"),
              icon: Info,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as AdvancedTab)}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-1" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && analysis && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {t("analysis.avgCycleLength")}
                    </p>
                    <p className="text-lg font-semibold text-blue-600">
                      {Math.round(analysis.averageCycleLength)}{" "}
                      {t("charts.days")}
                    </p>
                  </div>
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {t("analysis.avgPeriodLength")}
                    </p>
                    <p className="text-lg font-semibold text-green-600">
                      {Math.round(analysis.averagePeriodLength)}{" "}
                      {t("charts.days")}
                    </p>
                  </div>
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {t("analysis.avgPainLevel")}
                    </p>
                    <p className="text-lg font-semibold text-red-600">
                      {statistics?.averagePainLevel.toFixed(1)}
                    </p>
                  </div>
                  <Activity className="w-6 h-6 text-red-600" />
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {t("analysis.confidence")}
                    </p>
                    <p className="text-lg font-semibold text-purple-600">
                      {analysis.confidence.toFixed(0)}%
                    </p>
                  </div>
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            {renderInsights()}
          </div>
        )}

        {activeTab === "trends" && renderTrendChart()}
        {activeTab === "comparison" && renderComparisonAnalysis()}
        {activeTab === "insights" && renderInsights()}
      </div>
    </div>
  );
}
