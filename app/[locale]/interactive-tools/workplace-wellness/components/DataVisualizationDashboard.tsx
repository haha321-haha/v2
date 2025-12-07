/**
 * HVsLYEp职场健康助手 - 数据可视化仪表板
 * Day 9: 综合数据可视化组件
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Calendar,
  Target,
  Heart,
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

interface TrendRecord {
  month: string;
  cycleLength: number;
  painLevel: number;
  efficiency: number;
}

interface InsightCard {
  type: "positive" | "negative" | "neutral";
  title: string;
  description: string;
  icon: LucideIcon;
}

interface DashboardData {
  cycleAnalysis: CycleAnalysis;
  statistics: CycleStatistics;
  trends: TrendRecord[];
  insights: InsightCard[];
}

export default function DataVisualizationDashboard() {
  const locale = useLocale();
  const t = useTranslations("workplaceWellness");
  const calendar = useCalendar() as CalendarState;
  const [activeView, setActiveView] = useState<
    "overview" | "detailed" | "comparison"
  >("overview");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  // 从 store 读取 periodData
  const periodData = useMemo(
    () => calendar.periodData || [],
    [calendar.periodData],
  );

  // 辅助函数 - 必须在 generateDashboardData 之前定义
  const calculateCycleLength = (records: PeriodRecord[]): number => {
    if (records.length < 2) return 0;
    const sorted = [...records].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const first = new Date(sorted[0].date).getTime();
    const last = new Date(sorted[sorted.length - 1].date).getTime();
    return Math.round((last - first) / (1000 * 60 * 60 * 24));
  };

  // 生成趋势数据 - 必须在 generateDashboardData 之前定义
  const generateTrendData = useCallback(
    (data: PeriodRecord[]): TrendRecord[] => {
      const trends: TrendRecord[] = [];
      const monthlyData = new Map<string, PeriodRecord[]>();

      data.forEach((record) => {
        const month = new Date(record.date).toISOString().slice(0, 7);
        if (!monthlyData.has(month)) {
          monthlyData.set(month, []);
        }
        monthlyData.get(month)!.push(record);
      });

      monthlyData.forEach((records, month) => {
        const periodRecords = records.filter((r) => r.type === "period");
        if (periodRecords.length > 0) {
          const avgPain =
            periodRecords.reduce((sum, r) => sum + (r.painLevel || 0), 0) /
            periodRecords.length;
          const efficiency = Math.max(20, 100 - avgPain * 8);

          trends.push({
            month,
            cycleLength: calculateCycleLength(periodRecords),
            painLevel: avgPain,
            efficiency,
          });
        }
      });

      return trends.sort((a, b) => a.month.localeCompare(b.month));
    },
    [],
  );

  // 生成洞察 - 必须在 generateDashboardData 之前定义
  const generateInsights = useCallback(
    (analysis: CycleAnalysis, statistics: CycleStatistics): InsightCard[] => {
      const insights: InsightCard[] = [];

      if (analysis.cycleRegularity === "regular") {
        insights.push({
          type: "positive",
          title: t("insights.regularCycle"),
          description: t("insights.regularCycleDesc"),
          icon: CheckCircle,
        });
      } else if (analysis.cycleRegularity === "irregular") {
        insights.push({
          type: "negative",
          title: t("insights.irregularCycle"),
          description: t("insights.irregularCycleDesc"),
          icon: AlertTriangle,
        });
      }

      if (statistics.averagePainLevel > 7) {
        insights.push({
          type: "negative",
          title: t("insights.highPain"),
          description: t("insights.highPainDesc"),
          icon: AlertTriangle,
        });
      } else if (statistics.averagePainLevel < 3) {
        insights.push({
          type: "positive",
          title: t("insights.lowPain"),
          description: t("insights.lowPainDesc"),
          icon: CheckCircle,
        });
      }

      if (analysis.confidence > 80) {
        insights.push({
          type: "positive",
          title: t("insights.highAccuracy"),
          description: t("insights.highAccuracyDesc"),
          icon: CheckCircle,
        });
      }

      return insights;
    },
    [t],
  );

  const generateDashboardData = useCallback(async () => {
    setLoading(true);

    try {
      const predictor = new CyclePredictor(locale);
      const cycleAnalysis = predictor.analyzeCycle(periodData);
      const statistics = predictor.generateStatistics(periodData);

      // 生成趋势数据
      const trends = generateTrendData(periodData);

      // 生成洞察
      const insights = generateInsights(cycleAnalysis, statistics);

      setDashboardData({
        cycleAnalysis,
        statistics,
        trends,
        insights,
      });
    } catch (error) {
      logError(
        "Failed to generate dashboard data",
        error,
        "DataVisualizationDashboard",
      );
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  }, [locale, periodData, generateTrendData, generateInsights]);

  useEffect(() => {
    generateDashboardData();
  }, [generateDashboardData]);

  // 渲染概览视图
  const renderOverview = () => {
    if (!dashboardData) return null;

    const { cycleAnalysis, statistics, insights } = dashboardData;

    return (
      <div className="space-y-6">
        {/* 关键指标卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("analysis.avgCycleLength")}
                </p>
                <p className="text-xl font-bold text-blue-600">
                  {cycleAnalysis
                    ? Math.round(cycleAnalysis.averageCycleLength)
                    : 0}{" "}
                  {t("charts.days")}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("analysis.avgPainLevel")}
                </p>
                <p className="text-xl font-bold text-red-600">
                  {statistics ? statistics.averagePainLevel.toFixed(1) : "0.0"}
                </p>
              </div>
              <Activity className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("workAnalysis.avgEfficiency")}
                </p>
                <p className="text-xl font-bold text-green-600">
                  {dashboardData.trends.length > 0
                    ? Math.round(
                        dashboardData.trends.reduce(
                          (sum, t) => sum + t.efficiency,
                          0,
                        ) / dashboardData.trends.length,
                      )
                    : 0}
                  %
                </p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("analysis.confidence")}
                </p>
                <p className="text-xl font-bold text-purple-600">
                  {cycleAnalysis ? cycleAnalysis.confidence.toFixed(0) : 0}%
                </p>
              </div>
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* 洞察卡片 */}
        {insights.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-600" />
              {t("analysis.tabs.insights")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 ${
                    insight.type === "positive"
                      ? "bg-green-50 border border-green-200"
                      : insight.type === "negative"
                        ? "bg-red-50 border border-red-200"
                        : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <insight.icon
                      className={`w-6 h-6 mt-1 ${
                        insight.type === "positive"
                          ? "text-green-600"
                          : insight.type === "negative"
                            ? "text-red-600"
                            : "text-blue-600"
                      }`}
                    />
                    <div>
                      <h4
                        className={`font-semibold mb-1 ${
                          insight.type === "positive"
                            ? "text-green-800"
                            : insight.type === "negative"
                              ? "text-red-800"
                              : "text-blue-800"
                        }`}
                      >
                        {insight.title}
                      </h4>
                      <p className="text-sm text-gray-700">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 渲染详细视图
  const renderDetailed = () => {
    if (!dashboardData) return null;

    return (
      <div className="space-y-6">
        {/* 趋势图表 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            {t("analysis.tabs.trends")}
          </h3>

          <div className="space-y-4">
            {dashboardData.trends.map((trend, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
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
                      {trend.efficiency.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-600">
                      {t("workAnalysis.efficiency")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 渲染对比视图
  const renderComparison = () => {
    if (!dashboardData || dashboardData.trends.length < 2) {
      return (
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{t("analysis.noComparisonData")}</p>
        </div>
      );
    }

    const recent = dashboardData.trends.slice(-3);
    const previous = dashboardData.trends.slice(-6, -3);

    if (recent.length < 3 || previous.length < 3) {
      return (
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{t("analysis.noComparisonData")}</p>
        </div>
      );
    }

    const recentAvg =
      recent.reduce((sum, t) => sum + t.painLevel, 0) / recent.length;
    const previousAvg =
      previous.reduce((sum, t) => sum + t.painLevel, 0) / previous.length;
    const recentEfficiency =
      recent.reduce((sum, t) => sum + t.efficiency, 0) / recent.length;
    const previousEfficiency =
      previous.reduce((sum, t) => sum + t.efficiency, 0) / previous.length;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            {t("analysis.comparisonTitle")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-3">
                {t("analysis.avgPainLevel")}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {t("analysis.currentPeriod")}
                  </span>
                  <span className="font-semibold text-blue-600">
                    {recentAvg.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {t("analysis.previousPeriod")}
                  </span>
                  <span className="font-semibold text-gray-600">
                    {previousAvg.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {t("analysis.averageCycle")}
                  </span>
                  <span className="font-semibold text-green-600">
                    {dashboardData.cycleAnalysis
                      ? dashboardData.cycleAnalysis.averageCycleLength.toFixed(
                          1,
                        )
                      : "0.0"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-3">
                {t("workAnalysis.efficiency")}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {t("analysis.currentPeriod")}
                  </span>
                  <span className="font-semibold text-blue-600">
                    {recentEfficiency.toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {t("analysis.previousPeriod")}
                  </span>
                  <span className="font-semibold text-gray-600">
                    {previousEfficiency.toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {t("analysis.averageCycle")}
                  </span>
                  <span className="font-semibold text-green-600">
                    {dashboardData.trends.reduce(
                      (sum, t) => sum + t.efficiency,
                      0,
                    ) / dashboardData.trends.length}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-gray-600">{t("common.loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
      <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-primary-500" />
        {t("analysis.advancedTitle")}
      </h4>

      {/* 视图切换 */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            {
              id: "overview",
              label: t("analysis.tabs.overview"),
              icon: BarChart3,
            },
            {
              id: "detailed",
              label: t("analysis.tabs.trends"),
              icon: TrendingUp,
            },
            {
              id: "comparison",
              label: t("analysis.tabs.comparison"),
              icon: PieChart,
            },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() =>
                setActiveView(view.id as "overview" | "detailed" | "comparison")
              }
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === view.id
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <view.icon className="w-4 h-4 mr-1" />
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="min-h-[400px]">
        {activeView === "overview" && renderOverview()}
        {activeView === "detailed" && renderDetailed()}
        {activeView === "comparison" && renderComparison()}
      </div>
    </div>
  );
}
