/**
 * 个性化推荐组件
 * 主推荐系统组件，整合所有推荐功能
 */

"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  useCalendar,
  useWorkImpact,
  useNutrition,
  useRecommendationFeedbackActions,
} from "../hooks/useWorkplaceWellnessStore";
import {
  generateRecommendations,
  generateColdStartRecommendations,
} from "../utils/recommendationEngine";
import {
  RecommendationCategory,
  RecommendationFeedbackAction,
  RecommendationItem,
  RecommendationResult,
  RecommendationType,
} from "../types/recommendation";
import RecommendationCard from "./RecommendationCard";
import RecommendationSection from "./RecommendationSection";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  RefreshCw,
  Filter,
  CheckCircle,
  Info,
  TestTube,
} from "lucide-react";
import { CalendarState } from "../types";
import { RecommendationErrorBoundary } from "./RecommendationErrorBoundary";
import RecommendationSystemTest from "./RecommendationSystemTest";

type FilterType = RecommendationType | "all";
type FilterCategory = RecommendationCategory | "all";
type SortBy = "relevance" | "priority" | "time";

const formatErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error ?? "Unknown error");

const buildSummary = (
  items: RecommendationItem[],
): RecommendationResult["summary"] => ({
  totalRecommendations: items.length,
  highPriorityCount: items.filter((item) => item.priority >= 80).length,
  categories: [...new Set(items.map((item) => item.category))],
});

export default function PersonalizedRecommendations() {
  const t = useTranslations("workplaceWellness.recommendations");
  const locale = useLocale();
  const calendar = useCalendar() as CalendarState;
  const workImpact = useWorkImpact();
  const nutrition = useNutrition();
  const { getFeedbackHistory } = useRecommendationFeedbackActions();

  const [recommendations, setRecommendations] =
    useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [sortBy, setSortBy] = useState<SortBy>("relevance");
  const [showTestPanel, setShowTestPanel] = useState(false);

  // 获取反馈历史
  const feedbackHistory = getFeedbackHistory();

  // 生成推荐 - 使用 useCallback 优化
  const generateRecommendationsData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const periodData = calendar.periodData || [];

      // 检查数据是否足够
      if (periodData.length < 3) {
        // 冷启动：数据不足，使用通用推荐
        const coldStartItems =
          generateColdStartRecommendations(feedbackHistory);
        setRecommendations({
          recommendations: coldStartItems,
          insights: {
            painPattern: "stable",
            efficiencyPattern: "stable",
            cycleHealth: "healthy",
          },
          summary: {
            totalRecommendations: coldStartItems.length,
            highPriorityCount: coldStartItems.filter((r) => r.priority >= 80)
              .length,
            categories: [...new Set(coldStartItems.map((r) => r.category))],
          },
        });
      } else {
        // 正常推荐生成
        const result = generateRecommendations(
          periodData,
          workImpact,
          nutrition,
          feedbackHistory,
        );
        setRecommendations(result);
      }
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [calendar.periodData, workImpact, nutrition, feedbackHistory]);

  // 生成推荐
  useEffect(() => {
    generateRecommendationsData();
  }, [generateRecommendationsData]);

  // 过滤和排序推荐
  const filteredRecommendations = useMemo(() => {
    if (!recommendations) return [];

    let filtered = [...recommendations.recommendations];

    // 按类型过滤
    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    // 按分类过滤
    if (filterCategory !== "all") {
      filtered = filtered.filter((item) => item.category === filterCategory);
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          return b.priority - a.priority;
        case "relevance":
          return b.score - a.score;
        case "time":
          // 这里可以根据时间排序，暂时按分数
          return b.score - a.score;
        default:
          return 0;
      }
    });

    return filtered;
  }, [recommendations, filterType, filterCategory, sortBy]);

  // 按类型分组
  const recommendationsByType = useMemo(() => {
    const grouped: Partial<Record<RecommendationType, RecommendationItem[]>> =
      {};
    filteredRecommendations.forEach((item) => {
      grouped[item.type] = grouped[item.type] || [];
      grouped[item.type]!.push(item);
    });
    return grouped;
  }, [filteredRecommendations]);

  // 处理反馈 - 使用 useCallback 优化
  const handleFeedback = useCallback(
    (itemId: string, action: RecommendationFeedbackAction) => {
      if (action === "dismissed") {
        setRecommendations((prev) => {
          if (!prev) return prev;
          const remaining = prev.recommendations.filter(
            (item) => item.id !== itemId,
          );
          return {
            ...prev,
            recommendations: remaining,
            summary: buildSummary(remaining),
          };
        });
      }
    },
    [],
  );

  // 加载状态
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">{t("loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
            <p className="text-gray-600">{error}</p>
            <button
              onClick={generateRecommendationsData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t("actions.refresh")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 空状态
  if (!recommendations || filteredRecommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-8">
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("empty.title")}
          </h3>
          <p className="text-gray-600 mb-4">{t("empty.description")}</p>
          <button
            onClick={generateRecommendationsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("empty.action")}
          </button>
        </div>
      </div>
    );
  }

  const typeEntries = Object.entries(recommendationsByType) as [
    RecommendationType,
    RecommendationItem[],
  ][];

  return (
    <RecommendationErrorBoundary>
      <div className="space-y-6">
        {/* 测试面板（仅开发环境） */}
        {process.env.NODE_ENV === "development" && showTestPanel && (
          <RecommendationSystemTest />
        )}
        {/* 标题和操作栏 */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {t("title")}
              </h1>
              <p className="text-gray-600 text-sm">{t("subtitle")}</p>
            </div>
            <div className="flex items-center gap-2">
              {process.env.NODE_ENV === "development" && (
                <button
                  onClick={() => setShowTestPanel(!showTestPanel)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="测试推荐系统"
                >
                  <TestTube className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <button
                onClick={generateRecommendationsData}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title={t("actions.refresh")}
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* 数据洞察 */}
          {recommendations.insights && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">
                    {t("insights.painPattern.title")}
                  </span>
                  {recommendations.insights.painPattern === "increasing" ? (
                    <TrendingUp className="w-4 h-4 text-red-600" />
                  ) : recommendations.insights.painPattern === "decreasing" ? (
                    <TrendingDown className="w-4 h-4 text-green-600" />
                  ) : (
                    <Activity className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <p className="text-sm text-blue-700">
                  {t(
                    `insights.painPattern.${recommendations.insights.painPattern}`,
                  )}
                </p>
              </div>

              <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-900">
                    {t("insights.efficiencyPattern.title")}
                  </span>
                  {recommendations.insights.efficiencyPattern ===
                  "improving" ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : recommendations.insights.efficiencyPattern ===
                    "declining" ? (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  ) : (
                    <Activity className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <p className="text-sm text-green-700">
                  {t(
                    `insights.efficiencyPattern.${recommendations.insights.efficiencyPattern}`,
                  )}
                </p>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-900">
                    {t("insights.cycleHealth.title")}
                  </span>
                  {recommendations.insights.cycleHealth === "healthy" ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
                <p className="text-sm text-purple-700">
                  {t(
                    `insights.cycleHealth.${recommendations.insights.cycleHealth}`,
                  )}
                </p>
              </div>
            </div>
          )}

          {/* 筛选和排序 */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {t("filters.title")}:
              </span>
            </div>

            {/* 类型筛选 */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t("filters.showAll")}</option>
              <option value="article">{t("types.article")}</option>
              <option value="tool">{t("types.tool")}</option>
              <option value="scenario">{t("types.scenario")}</option>
              <option value="tip">{t("types.tip")}</option>
              <option value="action">{t("types.action")}</option>
            </select>

            {/* 分类筛选 */}
            <select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value as FilterCategory)
              }
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t("categories.all")}</option>
              <option value="pain-relief">{t("categories.pain-relief")}</option>
              <option value="tracking">{t("categories.tracking")}</option>
              <option value="medical">{t("categories.medical")}</option>
              <option value="work-adjustment">
                {t("categories.work-adjustment")}
              </option>
              <option value="nutrition">{t("categories.nutrition")}</option>
              <option value="natural-therapy">
                {t("categories.natural-therapy")}
              </option>
              <option value="assessment">{t("categories.assessment")}</option>
              <option value="scenario">{t("categories.scenario")}</option>
              <option value="mental-health">
                {t("categories.mental-health")}
              </option>
              <option value="emergency">{t("categories.emergency")}</option>
            </select>

            {/* 排序 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevance">{t("filters.sortByRelevance")}</option>
              <option value="priority">{t("filters.sortByPriority")}</option>
              <option value="time">{t("filters.sortByTime")}</option>
            </select>
          </div>

          {/* 统计摘要 */}
          {recommendations.summary && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>
                  {t("summary.totalRecommendations", {
                    count: filteredRecommendations.length,
                  })}
                </span>
                {recommendations.summary.highPriorityCount > 0 && (
                  <span>
                    {t("summary.highPriorityCount", {
                      count: recommendations.summary.highPriorityCount,
                    })}
                  </span>
                )}
                <span>
                  {t("summary.categoriesCount", {
                    count: recommendations.summary.categories.length,
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 数据质量提示 */}
        {calendar.periodData && calendar.periodData.length < 3 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-700">
                  {t("empty.insufficientData")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 推荐列表 - 按类型分组 */}
        <div className="space-y-6">
          {typeEntries.map(([type, items]) => (
            <RecommendationSection
              key={type}
              title={t(`types.${type}`)}
              items={items}
              feedbackHistory={feedbackHistory}
              locale={locale}
              defaultExpanded={true}
              maxItems={5}
              onFeedback={handleFeedback}
            />
          ))}
        </div>

        {/* 如果没有分组，显示所有推荐 */}
        {Object.keys(recommendationsByType).length === 0 && (
          <div className="space-y-4">
            {filteredRecommendations.map((item) => (
              <RecommendationCard
                key={item.id}
                item={item}
                feedbackHistory={feedbackHistory}
                locale={locale}
                onFeedback={handleFeedback}
              />
            ))}
          </div>
        )}
      </div>
    </RecommendationErrorBoundary>
  );
}
