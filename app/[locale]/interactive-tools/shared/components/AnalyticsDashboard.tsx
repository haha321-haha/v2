"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Award,
  Clock,
  Heart,
} from "lucide-react";

interface AnalyticsData {
  painLevels: Array<{
    date: string;
    pain: number;
    mood: number;
    activity: number;
  }>;
  cyclePatterns: Array<{
    cycle: number;
    duration: number;
    intensity: number;
    symptoms: string[];
  }>;
  treatmentEffectiveness: Array<{
    treatment: string;
    effectiveness: number;
    frequency: number;
    satisfaction: number;
  }>;
  trends: {
    painTrend: "improving" | "stable" | "worsening";
    moodTrend: "improving" | "stable" | "worsening";
    activityTrend: "improving" | "stable" | "worsening";
  };
  insights: Array<{
    type: "pattern" | "correlation" | "recommendation";
    title: string;
    description: string;
    confidence: number;
    actionable: boolean;
  }>;
}

interface AnalyticsDashboardProps {
  locale: string;
  userId?: string;
  timeRange?: "week" | "month" | "quarter" | "year";
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00"];

export default function AnalyticsDashboard({
  locale,
  userId,
  timeRange = "month",
}: AnalyticsDashboardProps) {
  const t = useTranslations("interactiveTools.analytics");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<
    "pain" | "mood" | "activity"
  >("pain");

  // 模拟数据生成（实际应用中会从API获取）
  useEffect(() => {
    const generateMockData = (): AnalyticsData => {
      const painLevels = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        pain: Math.random() * 10,
        mood: Math.random() * 10,
        activity: Math.random() * 10,
      }));

      const cyclePatterns = Array.from({ length: 6 }, (_, i) => ({
        cycle: i + 1,
        duration: 28 + Math.random() * 7 - 3.5,
        intensity: Math.random() * 10,
        symptoms: ["cramps", "bloating", "fatigue"].slice(
          0,
          Math.floor(Math.random() * 3) + 1,
        ),
      }));

      const treatmentEffectiveness = [
        {
          treatment: "热敷",
          effectiveness: 8.5,
          frequency: 15,
          satisfaction: 8.2,
        },
        {
          treatment: "布洛芬",
          effectiveness: 7.8,
          frequency: 8,
          satisfaction: 7.5,
        },
        {
          treatment: "瑜伽",
          effectiveness: 6.2,
          frequency: 12,
          satisfaction: 7.8,
        },
        {
          treatment: "按摩",
          effectiveness: 7.1,
          frequency: 6,
          satisfaction: 8.0,
        },
      ];

      return {
        painLevels,
        cyclePatterns,
        treatmentEffectiveness,
        trends: {
          painTrend: "improving",
          moodTrend: "stable",
          activityTrend: "improving",
        },
        insights: [
          {
            type: "pattern",
            title: "疼痛模式识别",
            description: "您的疼痛通常在月经开始前2天达到峰值",
            confidence: 0.85,
            actionable: true,
          },
          {
            type: "correlation",
            title: "活动与疼痛关联",
            description: "轻度运动与疼痛缓解呈正相关",
            confidence: 0.72,
            actionable: true,
          },
          {
            type: "recommendation",
            title: "个性化建议",
            description: "建议在疼痛高峰期前1天开始热敷治疗",
            confidence: 0.91,
            actionable: true,
          },
        ],
      };
    };

    setTimeout(() => {
      setData(generateMockData());
      setLoading(false);
    }, 1000);
  }, [timeRange, userId]);

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.painLevels.map((item) => ({
      date: new Date(item.date).toLocaleDateString(
        locale === "zh" ? "zh-CN" : "en-US",
        {
          month: "short",
          day: "numeric",
        },
      ),
      pain: item.pain,
      mood: item.mood,
      activity: item.activity,
    }));
  }, [data, locale]);

  const pieData = useMemo(() => {
    if (!data) return [];
    return data.treatmentEffectiveness.map((treatment, index) => ({
      name: treatment.treatment,
      value: treatment.effectiveness,
      color: COLORS[index % COLORS.length],
    }));
  }, [data]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t("noData")}
        </h3>
        <p className="text-gray-600">{t("noDataDescription")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
      {/* 标题和筛选器 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h2>
          <p className="text-gray-600">{t("description")}</p>
        </div>

        <div className="flex space-x-2 mt-4 sm:mt-0">
          {(["pain", "mood", "activity"] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedMetric === metric
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t(`metrics.${metric}`)}
            </button>
          ))}
        </div>
      </div>

      {/* 趋势概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(data.trends).map(([key, trend]) => {
          const icons = {
            painTrend: Heart,
            moodTrend: Activity,
            activityTrend: Target,
          };
          const Icon = icons[key as keyof typeof icons];
          const colors = {
            improving: "text-green-600",
            stable: "text-blue-600",
            worsening: "text-red-600",
          };

          return (
            <div
              key={key}
              className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 text-blue-600" />
                <div className={`flex items-center ${colors[trend]}`}>
                  {trend === "improving" && (
                    <TrendingUp className="w-5 h-5 mr-1" />
                  )}
                  {trend === "stable" && <Clock className="w-5 h-5 mr-1" />}
                  {trend === "worsening" && (
                    <TrendingDown className="w-5 h-5 mr-1" />
                  )}
                  <span className="text-sm font-medium">
                    {t(`trends.${trend}`)}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t(`trends.${key}`)}
              </h3>
              <p className="text-sm text-gray-600">{t("trends.basedOnData")}</p>
            </div>
          );
        })}
      </div>

      {/* 主要图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 时间序列图表 */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("charts.symptomTrends")}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 治疗方法效果 */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("charts.treatmentEffectiveness")}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({
                  name,
                  percent,
                }: {
                  name?: string;
                  percent?: number;
                }) => `${name ?? "项"} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 洞察和建议 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2" />
          {t("insights.title")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.insights.map((insight, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 border border-blue-100"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {Math.round(insight.confidence * 100)}%{" "}
                  {t("insights.confidence")}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                {insight.description}
              </p>
              {insight.actionable && (
                <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors">
                  {t("insights.viewRecommendation")}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
