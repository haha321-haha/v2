/**
 * HVsLYEp职场健康助手 - 周期统计图表组件
 * 基于HVsLYEp的数据结构创建可视化图表
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Activity,
  PieChart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import {
  useCalendar,
  useWorkplaceWellnessActions,
} from "../hooks/useWorkplaceWellnessStore";
import {
  CyclePredictor,
  CycleAnalysis,
  CycleStatistics,
} from "../utils/cyclePrediction";
import { CalendarState } from "../types";
import { logError } from "@/lib/debug-logger";

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

type ActiveTab = "overview" | "cycle-length" | "pain-level" | "flow-type";

interface TabConfig {
  id: ActiveTab;
  label: string;
  icon: LucideIcon;
}

export default function CycleStatisticsChart() {
  const locale = useLocale();
  const t = useTranslations("workplaceWellness");
  const calendar = useCalendar() as CalendarState;
  const { setActiveTab: setMainActiveTab } = useWorkplaceWellnessActions();
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [analysis, setAnalysis] = useState<CycleAnalysis | null>(null);
  const [statistics, setStatistics] = useState<CycleStatistics | null>(null);

  const tabs: TabConfig[] = useMemo(
    () => [
      { id: "overview", label: t("analysis.tabs.overview"), icon: BarChart3 },
      {
        id: "cycle-length",
        label: t("analysis.tabs.cycleLength"),
        icon: TrendingUp,
      },
      { id: "pain-level", label: t("analysis.tabs.painLevel"), icon: Activity },
      { id: "flow-type", label: t("analysis.tabs.flowType"), icon: PieChart },
    ],
    [t],
  );

  // 从 store 读取 periodData
  const periodData = useMemo(
    () => calendar.periodData || [],
    [calendar.periodData],
  );

  // Move useEffect before any early returns to comply with rules-of-hooks
  useEffect(() => {
    if (!periodData || periodData.length === 0) {
      setAnalysis(null);
      setStatistics(null);
      return;
    }

    const validRecords = periodData.filter(
      (record) => record && typeof record === "object" && record.date,
    );

    if (validRecords.length === 0) {
      setAnalysis(null);
      setStatistics(null);
      return;
    }

    try {
      const predictor = new CyclePredictor(locale);
      const cycleAnalysis = predictor.analyzeCycle(validRecords);
      const cycleStats = predictor.generateStatistics(validRecords);

      setAnalysis(cycleAnalysis);
      setStatistics(cycleStats);
    } catch (error) {
      logError("Error analyzing cycle data", error);
      setAnalysis(null);
      setStatistics(null);
    }
  }, [periodData, locale]);

  // 空数据检查
  if (periodData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
        <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-primary-500" />
          {t("charts.title")}
        </h4>
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">
            {t("charts.noDataTitle")}
          </p>
          <p className="text-gray-500 text-sm mb-6">
            {t("charts.noDataMessage")}
          </p>
          <button
            onClick={() => setMainActiveTab("calendar")}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            {t("calendar.addRecord")}
          </button>
        </div>
      </div>
    );
  }

  // 生成周期长度图表数据
  const generateCycleLengthChart = (): ChartData => {
    if (!statistics || statistics.cycleLengths.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: t("charts.cycleLength"),
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
          },
        ],
      };
    }

    const cycleLengths = statistics.cycleLengths;
    const ranges = [
      { min: 21, max: 25, label: "21-25" },
      { min: 26, max: 30, label: "26-30" },
      { min: 31, max: 35, label: "31-35" },
      { min: 36, max: 40, label: "36-40" },
      { min: 41, max: 45, label: "41-45" },
    ];

    const counts = ranges.map(
      (range) =>
        cycleLengths.filter(
          (length) => length >= range.min && length <= range.max,
        ).length,
    );

    return {
      labels: ranges.map((range) => `${range.label} ${t("charts.days")}`),
      datasets: [
        {
          label: t("charts.cycleLength"),
          data: counts,
          backgroundColor: [
            "#ff6b6b",
            "#4ecdc4",
            "#45b7d1",
            "#96ceb4",
            "#feca57",
          ],
          borderColor: ["#ff5252", "#26a69a", "#2196f3", "#66bb6a", "#ffa726"],
          borderWidth: 1,
        },
      ],
    };
  };

  // 生成疼痛等级图表数据
  const generatePainLevelChart = (): ChartData => {
    if (!statistics) {
      return {
        labels: [],
        datasets: [
          {
            label: t("charts.painLevel"),
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
          },
        ],
      };
    }

    const painLevels = periodData
      .filter((d) => d.painLevel !== null)
      .map((d) => d.painLevel!);

    const counts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
      (level) => painLevels.filter((pain) => pain === level).length,
    );

    return {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => `${level}`),
      datasets: [
        {
          label: t("charts.painLevel"),
          data: counts,
          backgroundColor: [
            "#e8f5e8",
            "#d4edda",
            "#c3e6cb",
            "#b8dfcc",
            "#a8d5ba",
            "#f8d7da",
            "#f5c6cb",
            "#f1b0b7",
            "#ed9ca3",
            "#e8888f",
          ],
          borderColor: [
            "#28a745",
            "#28a745",
            "#28a745",
            "#28a745",
            "#28a745",
            "#dc3545",
            "#dc3545",
            "#dc3545",
            "#dc3545",
            "#dc3545",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // 生成流量类型图表数据
  const generateFlowTypeChart = (): ChartData => {
    if (!statistics) {
      return {
        labels: [],
        datasets: [
          {
            label: t("charts.flowType"),
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
          },
        ],
      };
    }

    const flows = periodData.filter((d) => d.flow !== null).map((d) => d.flow!);

    const flowTypes = ["light", "medium", "heavy"] as const;
    const counts = flowTypes.map(
      (type) => flows.filter((flow) => flow === type).length,
    );

    return {
      labels: flowTypes.map((type) => t(`charts.flowTypes.${type}`)),
      datasets: [
        {
          label: t("charts.flowType"),
          data: counts,
          backgroundColor: ["#ffeb3b", "#ff9800", "#f44336"],
          borderColor: ["#fbc02d", "#f57c00", "#d32f2f"],
          borderWidth: 1,
        },
      ],
    };
  };

  // 渲染简单的条形图
  const renderBarChart = (data: ChartData) => {
    const maxValue = Math.max(...data.datasets[0].data, 1);

    return (
      <div className="space-y-3">
        {data.labels.map((label, index) => {
          const value = data.datasets[0].data[index];
          const percentage = (value / maxValue) * 100;

          return (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-20 text-sm text-gray-600">{label}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                <div
                  className="h-6 rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: data.datasets[0].backgroundColor[index],
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                  {value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 渲染概览卡片
  const renderOverviewCards = () => {
    if (!analysis || !statistics) return null;

    const cards = [
      {
        title: t("charts.totalCycles"),
        value: statistics.totalCycles,
        icon: Calendar,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        title: t("charts.averageCycleLength"),
        value: `${Math.round(analysis.averageCycleLength)} ${t("charts.days")}`,
        icon: TrendingUp,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        title: t("charts.averagePainLevel"),
        value: statistics.averagePainLevel.toFixed(1),
        icon: Activity,
        color: "text-red-600",
        bgColor: "bg-red-50",
      },
      {
        title: t("charts.cycleRegularity"),
        value: t(`charts.regularity.${analysis.cycleRegularity}`),
        icon: BarChart3,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => (
          <div key={index} className={`${card.bgColor} rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className={`text-lg font-semibold ${card.color}`}>
                  {card.value}
                </p>
              </div>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染预测信息
  const renderPredictionInfo = () => {
    if (!analysis) return null;

    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-purple-600" />
          {t("charts.predictions")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.nextPredictedPeriod && (
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">
                {t("charts.nextPeriod")}
              </p>
              <p className="font-semibold text-red-600">
                {new Date(analysis.nextPredictedPeriod).toLocaleDateString(
                  locale === "zh" ? "zh-CN" : "en-US",
                )}
              </p>
            </div>
          )}

          {analysis.nextPredictedOvulation && (
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">
                {t("charts.nextOvulation")}
              </p>
              <p className="font-semibold text-green-600">
                {new Date(analysis.nextPredictedOvulation).toLocaleDateString(
                  locale === "zh" ? "zh-CN" : "en-US",
                )}
              </p>
            </div>
          )}

          {analysis.currentPhase && (
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">
                {t("charts.currentPhase")}
              </p>
              <p className="font-semibold text-blue-600">
                {t(`nutrition.phases.${analysis.currentPhase}`)}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.phaseProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {analysis.phaseProgress}%
              </p>
            </div>
          )}
        </div>

        <div className="mt-3 text-sm text-gray-600">
          {t("charts.confidence")}: {analysis.confidence.toFixed(0)}%
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
      <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-primary-500" />
        {t("charts.title")}
      </h4>

      {/* 概览卡片 */}
      {renderOverviewCards()}

      {/* 预测信息 */}
      {renderPredictionInfo()}

      {/* 图表标签页 */}
      <div className="mb-4">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

      {/* 图表内容 */}
      <div className="min-h-[300px]">
        {activeTab === "overview" && (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t("charts.selectChart")}</p>
          </div>
        )}

        {activeTab === "cycle-length" && (
          <div>
            <h5 className="text-md font-medium text-gray-800 mb-4">
              {t("charts.cycleLengthDistribution")}
            </h5>
            {renderBarChart(generateCycleLengthChart())}
          </div>
        )}

        {activeTab === "pain-level" && (
          <div>
            <h5 className="text-md font-medium text-gray-800 mb-4">
              {t("charts.painLevelDistribution")}
            </h5>
            {renderBarChart(generatePainLevelChart())}
          </div>
        )}

        {activeTab === "flow-type" && (
          <div>
            <h5 className="text-md font-medium text-gray-800 mb-4">
              {t("charts.flowTypeDistribution")}
            </h5>
            {renderBarChart(generateFlowTypeChart())}
          </div>
        )}
      </div>
    </div>
  );
}
