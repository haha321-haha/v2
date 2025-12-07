/**
 * HVsLYEp职场健康助手 - 症状统计组件
 * Day 9: 症状统计功能
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  TrendingUp,
  CheckCircle,
  BarChart3,
  PieChart,
  Heart,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useCalendar } from "../hooks/useWorkplaceWellnessStore";
import { PeriodRecord, CalendarState } from "../types";

interface SymptomData {
  name: string;
  frequency: number;
  severity: number;
  trend: "up" | "down" | "stable";
  lastOccurrence: string;
  relatedPhases: string[];
}

interface SymptomPattern {
  symptom: string;
  pattern: string;
  frequency: number;
  severity: number;
  recommendations: string[];
}

type PeriodRecordWithSymptoms = PeriodRecord & {
  symptoms?: string[];
};

type SymptomTab = "overview" | "patterns" | "trends" | "recommendations";

interface TabConfig {
  id: SymptomTab;
  label: string;
  icon: LucideIcon;
}

export default function SymptomStatistics() {
  const locale = useLocale();
  const t = useTranslations("workplaceWellness");
  const calendar = useCalendar() as CalendarState;
  const [activeTab, setActiveTab] = useState<SymptomTab>("overview");
  const [symptomData, setSymptomData] = useState<SymptomData[]>([]);
  const [patterns, setPatterns] = useState<SymptomPattern[]>([]);

  // 从 store 读取 periodData
  const periodData = useMemo(
    () => calendar.periodData || [],
    [calendar.periodData],
  );

  // 分析症状数据 - moved before useEffect
  const analyzeSymptoms = useCallback(() => {
    const symptoms: Record<string, SymptomData> = {};
    const symptomRecords = periodData as PeriodRecordWithSymptoms[];

    // 模拟症状数据（实际应用中应该从用户输入中获取）
    const commonSymptoms = [
      "cramps",
      "bloating",
      "headache",
      "fatigue",
      "mood_swings",
      "breast_tenderness",
      "back_pain",
      "nausea",
      "insomnia",
      "anxiety",
    ];

    commonSymptoms.forEach((symptom) => {
      const occurrences = symptomRecords.filter(
        (record) => record.symptoms?.includes(symptom),
      );

      if (occurrences.length > 0) {
        const severity =
          occurrences.reduce(
            (sum, record) => sum + (record.painLevel || 0),
            0,
          ) / occurrences.length;

        symptoms[symptom] = {
          name: symptom,
          frequency: occurrences.length,
          severity: severity,
          trend: calculateTrend(occurrences),
          lastOccurrence: occurrences[occurrences.length - 1]?.date || "",
          relatedPhases: getRelatedPhases(occurrences),
        };
      }
    });

    setSymptomData(
      Object.values(symptoms).sort((a, b) => b.frequency - a.frequency),
    );
  }, [periodData]);

  // 分析症状组合
  const analyzeSymptomCombinations = useCallback(() => {
    // 模拟症状组合分析
    return [
      {
        name: "cramps_bloating",
        pattern: t("patterns.crampsBloating"),
        frequency: 8,
        severity: 6.5,
      },
      {
        name: "headache_fatigue",
        pattern: t("patterns.headacheFatigue"),
        frequency: 6,
        severity: 5.2,
      },
      {
        name: "mood_swings_anxiety",
        pattern: t("patterns.moodAnxiety"),
        frequency: 5,
        severity: 4.8,
      },
    ];
  }, [t]);

  // 生成建议
  const generateRecommendations = useCallback(
    (symptom: string): string[] => {
      const recommendations: { [key: string]: string[] } = {
        cramps_bloating: [
          t("recommendations.warmCompress"),
          t("recommendations.gentleExercise"),
          t("recommendations.hydration"),
        ],
        headache_fatigue: [
          t("recommendations.rest"),
          t("recommendations.caffeineReduction"),
          t("recommendations.stressManagement"),
        ],
        mood_swings_anxiety: [
          t("recommendations.mindfulness"),
          t("recommendations.socialSupport"),
          t("recommendations.sleepHygiene"),
        ],
      };

      return recommendations[symptom] || [t("recommendations.generalCare")];
    },
    [t],
  );

  // 生成症状模式
  const generatePatterns = useCallback(() => {
    const patterns: SymptomPattern[] = [];

    // 分析症状组合模式
    const symptomCombinations = analyzeSymptomCombinations();

    symptomCombinations.forEach((combination) => {
      patterns.push({
        symptom: combination.name,
        pattern: combination.pattern,
        frequency: combination.frequency,
        severity: combination.severity,
        recommendations: generateRecommendations(combination.name),
      });
    });

    setPatterns(patterns);
  }, [analyzeSymptomCombinations, generateRecommendations]);

  useEffect(() => {
    analyzeSymptoms();
    generatePatterns();
  }, [periodData, locale, analyzeSymptoms, generatePatterns]);

  // 计算趋势
  const calculateTrend = (
    occurrences: PeriodRecord[],
  ): "up" | "down" | "stable" => {
    if (occurrences.length < 3) return "stable";

    const recent = occurrences.slice(-3);
    const previous = occurrences.slice(-6, -3);

    if (recent.length < 3 || previous.length < 3) return "stable";

    const recentAvg =
      recent.reduce((sum, r) => sum + (r.painLevel || 0), 0) / recent.length;
    const previousAvg =
      previous.reduce((sum, r) => sum + (r.painLevel || 0), 0) /
      previous.length;

    if (recentAvg > previousAvg + 0.5) return "up";
    if (recentAvg < previousAvg - 0.5) return "down";
    return "stable";
  };

  // 获取相关阶段
  const getRelatedPhases = (occurrences: PeriodRecord[]): string[] => {
    const phases = new Set<string>();
    occurrences.forEach((record) => {
      if (record.type === "period") phases.add("menstrual");
      else if (record.type === "ovulation") phases.add("ovulation");
      else phases.add("luteal");
    });
    return Array.from(phases);
  };

  // 渲染症状概览
  const renderSymptomOverview = () => {
    if (symptomData.length === 0) {
      return (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{t("symptoms.noData")}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {symptomData.map((symptom, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    {t(`symptoms.${symptom.name}`)}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t("symptoms.frequency")}: {symptom.frequency}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-2">
                  {symptom.trend === "up" && (
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  )}
                  {symptom.trend === "down" && (
                    <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />
                  )}
                  {symptom.trend === "stable" && (
                    <Activity className="w-4 h-4 text-blue-500" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {symptom.severity.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {t("symptoms.lastOccurrence")}:{" "}
                  {new Date(symptom.lastOccurrence).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(symptom.severity / 10) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">
                {t("symptoms.severity")}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染症状模式
  const renderSymptomPatterns = () => {
    return (
      <div className="space-y-4">
        {patterns.map((pattern, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800">{pattern.pattern}</h4>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {pattern.frequency} {t("patterns.occurrences")}
                </span>
                <span className="text-sm font-medium text-purple-600">
                  {pattern.severity.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  {t("patterns.frequency")}
                </h5>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(pattern.frequency / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {pattern.frequency}
                  </span>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  {t("patterns.severity")}
                </h5>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-pink-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(pattern.severity / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {pattern.severity.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染建议
  const renderRecommendations = () => {
    return (
      <div className="space-y-4">
        {patterns.map((pattern, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <h4 className="font-semibold text-gray-800 mb-3">
              {pattern.pattern}
            </h4>
            <div className="space-y-2">
              {pattern.recommendations.map((recommendation, recIndex) => (
                <div key={recIndex} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <p className="text-sm text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
      <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-primary-500" />
        {t("symptoms.title")}
      </h4>

      {/* 标签页导航 */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {(
            [
              {
                id: "overview",
                label: t("symptoms.tabs.overview"),
                icon: BarChart3,
              },
              {
                id: "patterns",
                label: t("symptoms.tabs.patterns"),
                icon: PieChart,
              },
              {
                id: "trends",
                label: t("symptoms.tabs.trends"),
                icon: TrendingUp,
              },
              {
                id: "recommendations",
                label: t("symptoms.tabs.recommendations"),
                icon: Heart,
              },
            ] as TabConfig[]
          ).map((tab) => (
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
        {activeTab === "overview" && renderSymptomOverview()}
        {activeTab === "patterns" && renderSymptomPatterns()}
        {activeTab === "trends" && (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t("symptoms.trendsComingSoon")}</p>
          </div>
        )}
        {activeTab === "recommendations" && renderRecommendations()}
      </div>
    </div>
  );
}
