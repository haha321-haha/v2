/**
 * HVsLYEp职场健康助手 - 工作影响分析组件
 * Day 9: 工作影响分析功能
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Briefcase,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Clock,
  Target,
  Users,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useCalendar } from "../hooks/useWorkplaceWellnessStore";
import { PeriodRecord, WorkAdjustment, CalendarState } from "../types";

interface WorkImpactData {
  date: string;
  painLevel: number;
  workEfficiency: number;
  adjustment: WorkAdjustment | null;
  productivity: number;
  stressLevel: number;
  mood: number;
}

interface WorkPattern {
  phase: string;
  avgEfficiency: number;
  avgPain: number;
  commonAdjustments: WorkAdjustment[];
  productivityTrend: "up" | "down" | "stable";
}

interface ProductivityInsight {
  title: string;
  description: string;
  impact: "positive" | "negative" | "neutral";
  recommendation: string;
  icon: LucideIcon;
}

type WorkTabId = "overview" | "patterns" | "productivity" | "insights";

interface WorkTab {
  id: WorkTabId;
  label: string;
  icon: LucideIcon;
}

export default function WorkImpactAnalysis() {
  const locale = useLocale();
  const t = useTranslations("workplaceWellness");
  const calendar = useCalendar() as CalendarState;
  const [activeTab, setActiveTab] = useState<WorkTabId>("overview");
  const [workData, setWorkData] = useState<WorkImpactData[]>([]);
  const [patterns, setPatterns] = useState<WorkPattern[]>([]);
  const [insights, setInsights] = useState<ProductivityInsight[]>([]);

  // 从 store 读取 periodData
  const periodData = useMemo(
    () => calendar.periodData || [],
    [calendar.periodData],
  );

  const tabs: WorkTab[] = [
    {
      id: "overview",
      label: t("workAnalysis.tabs.overview"),
      icon: BarChart3,
    },
    {
      id: "patterns",
      label: t("workAnalysis.tabs.patterns"),
      icon: PieChart,
    },
    {
      id: "productivity",
      label: t("workAnalysis.tabs.productivity"),
      icon: Target,
    },
    {
      id: "insights",
      label: t("workAnalysis.tabs.insights"),
      icon: Users,
    },
  ];

  // 分析工作影响数据
  const analyzeWorkImpact = useCallback(() => {
    const workImpacts: WorkImpactData[] = [];

    periodData.forEach((record) => {
      if (record.painLevel !== null) {
        // 模拟工作影响数据（实际应用中应该从用户输入中获取）
        const workEfficiency = calculateWorkEfficiency(record.painLevel);
        const productivity = calculateProductivity(
          record.painLevel,
          workEfficiency,
        );
        const stressLevel = calculateStressLevel(record.painLevel);
        const mood = calculateMood(record.painLevel);

        workImpacts.push({
          date: record.date,
          painLevel: record.painLevel,
          workEfficiency: workEfficiency,
          adjustment: getWorkAdjustment(record.painLevel),
          productivity: productivity,
          stressLevel: stressLevel,
          mood: mood,
        });
      }
    });

    setWorkData(
      workImpacts.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    );
  }, [periodData]);

  // 生成工作模式
  const generateWorkPatterns = useCallback(() => {
    const patterns: WorkPattern[] = [];

    // 分析不同阶段的工作影响
    const phases = ["menstrual", "follicular", "ovulation", "luteal"];

    phases.forEach((phase) => {
      const phaseData = workData.filter((data) => {
        const record = periodData.find((r) => r.date === data.date);
        return record && getMenstrualPhase(record) === phase;
      });

      if (phaseData.length > 0) {
        const avgEfficiency =
          phaseData.reduce((sum, d) => sum + d.workEfficiency, 0) /
          phaseData.length;
        const avgPain =
          phaseData.reduce((sum, d) => sum + d.painLevel, 0) / phaseData.length;
        const commonAdjustments = getCommonAdjustments(phaseData);
        const productivityTrend = calculateProductivityTrend(phaseData);

        patterns.push({
          phase,
          avgEfficiency,
          avgPain,
          commonAdjustments,
          productivityTrend,
        });
      }
    });

    setPatterns(patterns);
  }, [periodData, workData]);

  // 生成洞察
  const generateInsights = useCallback(() => {
    const insights: ProductivityInsight[] = [];

    const avgEfficiency =
      workData.reduce((sum, d) => sum + d.workEfficiency, 0) / workData.length;
    const avgPain =
      workData.reduce((sum, d) => sum + d.painLevel, 0) / workData.length;

    // 效率洞察
    if (avgEfficiency > 80) {
      insights.push({
        title: t("workInsights.highEfficiency"),
        description: t("workInsights.highEfficiencyDesc"),
        impact: "positive",
        recommendation: t("workInsights.maintainRoutine"),
        icon: CheckCircle,
      });
    } else if (avgEfficiency < 60) {
      insights.push({
        title: t("workInsights.lowEfficiency"),
        description: t("workInsights.lowEfficiencyDesc"),
        impact: "negative",
        recommendation: t("workInsights.improveWorkflow"),
        icon: AlertTriangle,
      });
    }

    // 疼痛影响洞察
    if (avgPain > 7) {
      insights.push({
        title: t("workInsights.highPainImpact"),
        description: t("workInsights.highPainImpactDesc"),
        impact: "negative",
        recommendation: t("workInsights.painManagement"),
        icon: AlertTriangle,
      });
    }

    // 调整建议洞察
    const adjustmentFrequency =
      workData.filter((d) => d.adjustment !== null).length / workData.length;
    if (adjustmentFrequency > 0.3) {
      insights.push({
        title: t("workInsights.frequentAdjustments"),
        description: t("workInsights.frequentAdjustmentsDesc"),
        impact: "neutral",
        recommendation: t("workInsights.planAhead"),
        icon: Target,
      });
    }

    setInsights(insights);
  }, [workData, t]);

  useEffect(() => {
    analyzeWorkImpact();
    generateWorkPatterns();
    generateInsights();
  }, [
    periodData,
    locale,
    analyzeWorkImpact,
    generateWorkPatterns,
    generateInsights,
  ]);

  // 辅助函数
  const calculateWorkEfficiency = (painLevel: number): number => {
    // 疼痛等级越高，工作效率越低
    return Math.max(20, 100 - painLevel * 8);
  };

  const calculateProductivity = (
    painLevel: number,
    efficiency: number,
  ): number => {
    // 综合计算生产力
    return efficiency * 0.7 + (10 - painLevel) * 3;
  };

  const calculateStressLevel = (painLevel: number): number => {
    // 疼痛等级与压力水平相关
    return Math.min(10, painLevel + Math.random() * 2);
  };

  const calculateMood = (painLevel: number): number => {
    // 疼痛等级影响情绪
    return Math.max(1, 10 - painLevel - Math.random() * 2);
  };

  const getWorkAdjustment = (painLevel: number): WorkAdjustment | null => {
    if (painLevel > 8) return "leave";
    if (painLevel > 6) return "workFromHome";
    if (painLevel > 4) return "postponeMeeting";
    if (painLevel > 3) return "reduceTasks";
    return null;
  };

  const getMenstrualPhase = (record: PeriodRecord): string => {
    // 简化的阶段判断
    if (record.type === "period") return "menstrual";
    if (record.type === "ovulation") return "ovulation";
    return "luteal";
  };

  const getCommonAdjustments = (data: WorkImpactData[]): WorkAdjustment[] => {
    const adjustments = data
      .map((d) => d.adjustment)
      .filter(Boolean) as WorkAdjustment[];
    const counts = adjustments.reduce(
      (acc, adj) => {
        acc[adj] = (acc[adj] || 0) + 1;
        return acc;
      },
      {} as { [key: string]: number },
    );

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([adj]) => adj as WorkAdjustment);
  };

  const calculateProductivityTrend = (
    data: WorkImpactData[],
  ): "up" | "down" | "stable" => {
    if (data.length < 3) return "stable";

    const recent = data.slice(-3);
    const previous = data.slice(-6, -3);

    if (recent.length < 3 || previous.length < 3) return "stable";

    const recentAvg =
      recent.reduce((sum, d) => sum + d.productivity, 0) / recent.length;
    const previousAvg =
      previous.reduce((sum, d) => sum + d.productivity, 0) / previous.length;

    if (recentAvg > previousAvg + 5) return "up";
    if (recentAvg < previousAvg - 5) return "down";
    return "stable";
  };

  // 渲染工作影响概览
  const renderWorkOverview = () => {
    if (workData.length === 0) {
      return (
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{t("workAnalysis.noData")}</p>
        </div>
      );
    }

    const avgEfficiency =
      workData.reduce((sum, d) => sum + d.workEfficiency, 0) / workData.length;
    const avgPain =
      workData.reduce((sum, d) => sum + d.painLevel, 0) / workData.length;
    const avgProductivity =
      workData.reduce((sum, d) => sum + d.productivity, 0) / workData.length;
    const adjustmentRate =
      (workData.filter((d) => d.adjustment !== null).length / workData.length) *
      100;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("workAnalysis.avgEfficiency")}
                </p>
                <p className="text-lg font-semibold text-blue-600">
                  {avgEfficiency.toFixed(1)}%
                </p>
              </div>
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("workAnalysis.avgPain")}
                </p>
                <p className="text-lg font-semibold text-red-600">
                  {avgPain.toFixed(1)}
                </p>
              </div>
              <Activity className="w-6 h-6 text-red-600" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("workAnalysis.avgProductivity")}
                </p>
                <p className="text-lg font-semibold text-green-600">
                  {avgProductivity.toFixed(1)}
                </p>
              </div>
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("workAnalysis.adjustmentRate")}
                </p>
                <p className="text-lg font-semibold text-purple-600">
                  {adjustmentRate.toFixed(1)}%
                </p>
              </div>
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="font-medium text-gray-800 mb-3">
            {t("workAnalysis.recentTrends")}
          </h5>
          <div className="space-y-2">
            {workData.slice(-5).map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {new Date(data.date).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-blue-600">
                    {data.workEfficiency.toFixed(0)}%
                  </span>
                  <span className="text-sm text-red-600">
                    {data.painLevel.toFixed(1)}
                  </span>
                  <span className="text-sm text-green-600">
                    {data.productivity.toFixed(0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 渲染工作模式
  const renderWorkPatterns = () => {
    return (
      <div className="space-y-4">
        {patterns.map((pattern, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800">
                {t(`nutrition.phases.${pattern.phase}`)}
              </h4>
              <div className="flex items-center space-x-2">
                {pattern.productivityTrend === "up" && (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                )}
                {pattern.productivityTrend === "down" && (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                {pattern.productivityTrend === "stable" && (
                  <Activity className="w-4 h-4 text-blue-500" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  {t("workAnalysis.efficiency")}
                </h5>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pattern.avgEfficiency}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {pattern.avgEfficiency.toFixed(0)}%
                  </span>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  {t("workAnalysis.painLevel")}
                </h5>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(pattern.avgPain / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {pattern.avgPain.toFixed(1)}
                  </span>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  {t("workAnalysis.commonAdjustments")}
                </h5>
                <div className="flex flex-wrap gap-1">
                  {pattern.commonAdjustments
                    .slice(0, 2)
                    .map((adj, adjIndex) => (
                      <span
                        key={adjIndex}
                        className="px-2 py-1 bg-white rounded text-xs text-gray-700"
                      >
                        {t(`workImpact.adjustments.${adj}`)}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染生产力分析
  const renderProductivityAnalysis = () => {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-600" />
            {t("workAnalysis.productivityTitle")}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-700 mb-3">
                {t("workAnalysis.efficiencyVsPain")}
              </h5>
              <div className="space-y-2">
                {workData.slice(-7).map((data, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">
                      {new Date(data.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${data.workEfficiency}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {data.workEfficiency.toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-600 h-2 rounded-full"
                            style={{ width: `${(data.painLevel / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {data.painLevel.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-700 mb-3">
                {t("workAnalysis.productivityTrend")}
              </h5>
              <div className="space-y-2">
                {workData.slice(-7).map((data, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">
                      {new Date(data.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(data.productivity / 100) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {data.productivity.toFixed(0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染洞察
  const renderInsights = () => {
    return (
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`rounded-lg p-4 ${
              insight.impact === "positive"
                ? "bg-green-50 border border-green-200"
                : insight.impact === "negative"
                  ? "bg-red-50 border border-red-200"
                  : "bg-blue-50 border border-blue-200"
            }`}
          >
            <div className="flex items-start space-x-3">
              <insight.icon
                className={`w-6 h-6 mt-1 ${
                  insight.impact === "positive"
                    ? "text-green-600"
                    : insight.impact === "negative"
                      ? "text-red-600"
                      : "text-blue-600"
                }`}
              />
              <div>
                <h4
                  className={`font-semibold mb-1 ${
                    insight.impact === "positive"
                      ? "text-green-800"
                      : insight.impact === "negative"
                        ? "text-red-800"
                        : "text-blue-800"
                  }`}
                >
                  {insight.title}
                </h4>
                <p className="text-sm text-gray-700 mb-2">
                  {insight.description}
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {t("workAnalysis.recommendation")}: {insight.recommendation}
                </p>
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
        <Briefcase className="w-5 h-5 mr-2 text-primary-500" />
        {t("workAnalysis.title")}
      </h4>

      {/* 标签页导航 */}
      <div className="mb-6">
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

      {/* 内容区域 */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && renderWorkOverview()}
        {activeTab === "patterns" && renderWorkPatterns()}
        {activeTab === "productivity" && renderProductivityAnalysis()}
        {activeTab === "insights" && renderInsights()}
      </div>
    </div>
  );
}
