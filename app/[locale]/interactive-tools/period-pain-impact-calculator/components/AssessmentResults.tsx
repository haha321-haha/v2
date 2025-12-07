"use client";

import React from "react";
import { AssessmentResult, Recommendation } from "../types";
import RecommendedContent from "./RecommendedContent";
import Breadcrumb from "@/components/Breadcrumb";
import { useTranslations } from "next-intl";

interface AssessmentResultsProps {
  result: AssessmentResult;
  locale: "en" | "zh";
  onReset: () => void;
}

export default function AssessmentResults({
  result,
  locale,
  onReset,
}: AssessmentResultsProps) {
  const t = useTranslations("periodPainImpactCalculator");
  const breadcrumbT = useTranslations("interactiveTools.breadcrumb");

  // 获取严重程度颜色
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "text-green-600 bg-green-100";
      case "moderate":
        return "text-yellow-600 bg-yellow-100";
      case "severe":
        return "text-orange-600 bg-orange-100";
      case "emergency":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // 获取严重程度文本
  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "mild":
        return t("results.severity.mild");
      case "moderate":
        return t("results.severity.moderate");
      case "severe":
        return t("results.severity.severe");
      case "emergency":
        return t("results.severity.emergency");
      default:
        return t("results.severity.unknown");
    }
  };

  // 获取建议优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // 获取优先级文本
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return t("results.priority.high");
      case "medium":
        return t("results.priority.medium");
      case "low":
        return t("results.priority.low");
      default:
        return t("results.priority.normal");
    }
  };

  // 获取类别文本
  const getCategoryText = (category: string) => {
    switch (category) {
      case "immediate":
        return t("results.category.immediate");
      case "lifestyle":
        return t("results.category.lifestyle");
      case "medical":
        return t("results.category.medical");
      case "dietary":
        return t("results.category.dietary");
      case "exercise":
        return t("results.category.exercise");
      case "selfcare":
        return t("results.category.selfcare");
      default:
        return t("results.category.general");
    }
  };

  return (
    <>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="w-full max-w-4xl mx-auto">
          {/* 面包屑导航 */}
          <Breadcrumb
            items={[
              {
                label: breadcrumbT("interactiveTools"),
                href: `/${locale}/interactive-tools`,
              },
              { label: t("breadcrumbCurrent") },
            ]}
          />

          <div className="px-4 py-8 space-y-8">
            {/* 结果摘要 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                {t("results.title")}
              </h2>

              {/* 严重程度指标 */}
              <div
                className={`text-center p-6 rounded-lg ${getSeverityColor(
                  result.severity,
                )}`}
              >
                <div className="text-lg font-medium mb-2">
                  {t("results.painSeverity")}
                </div>
                <div className="text-3xl font-bold mb-2">
                  {getSeverityText(result.severity)}
                </div>
                <div className="text-sm opacity-80">{result.summary}</div>
              </div>

              {/* 评分详情 */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">
                    {t("results.yourScore")}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.score}
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">
                    {t("results.maxScore")}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.maxScore}
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">
                    {t("results.percentage")}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.percentage}%
                  </div>
                </div>
              </div>

              {/* 结果消息 - 使用深紫色配色 */}
              <div className="mt-6 p-4 bg-purple-900/5 rounded-lg border border-purple-900/20">
                <div className="text-purple-900">{result.message}</div>
              </div>
            </div>

            {/* 建议部分 */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-xl font-bold mb-6 text-gray-900">
                  {t("results.personalizedRecommendations")}
                </h3>

                <div className="space-y-6">
                  {result.recommendations.map(
                    (recommendation: Recommendation) => (
                      <div
                        key={recommendation.id}
                        className="border rounded-lg p-6"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-lg font-medium text-gray-900">
                            {recommendation.title}
                          </h4>
                          <div className="flex space-x-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                                recommendation.priority,
                              )}`}
                            >
                              {getPriorityText(recommendation.priority)}
                            </span>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-purple-900/10 text-purple-900">
                              {getCategoryText(recommendation.category)}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">
                          {recommendation.description}
                        </p>

                        {recommendation.actionSteps &&
                          recommendation.actionSteps.length > 0 && (
                            <div className="mb-4">
                              <h5 className="font-medium text-gray-900 mb-2">
                                {t("results.actionSteps")}:
                              </h5>
                              <ol className="list-decimal list-inside space-y-1">
                                {recommendation.actionSteps.map(
                                  (step, index) => (
                                    <li key={index} className="text-gray-700">
                                      {step}
                                    </li>
                                  ),
                                )}
                              </ol>
                            </div>
                          )}

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            {t("results.implementationTimeframe")}:{" "}
                            {recommendation.timeframe}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* 紧急提示 */}
            {result.emergency && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 text-center">
                <div className="text-red-800 font-bold text-lg mb-4">
                  {t("results.emergency.title")}
                </div>
                <div className="text-red-700">
                  {t("results.emergency.description")}
                </div>
              </div>
            )}

            {/* 重置按钮 - 使用橙色强调色 */}
            <div className="text-center">
              <button
                onClick={onReset}
                className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-300"
              >
                {t("results.retakeAssessment")}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 推荐内容区域 */}
      <RecommendedContent locale={locale} severity={result.severity} />
    </>
  );
}
