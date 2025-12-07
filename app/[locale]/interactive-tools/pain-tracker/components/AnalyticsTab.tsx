"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function AnalyticsTab() {
  const t = useTranslations("interactiveToolsPage.painTracker.analytics");
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "quarter" | "year"
  >("month");

  // Mock analytics data - in real implementation, this would come from analytics engine
  const mockAnalytics = {
    averagePainLevel: 5.2,
    totalRecords: 24,
    painTrend: [
      { date: "2024-01-01", level: 4 },
      { date: "2024-01-02", level: 6 },
      { date: "2024-01-03", level: 5 },
      { date: "2024-01-04", level: 7 },
      { date: "2024-01-05", level: 3 },
      { date: "2024-01-06", level: 4 },
      { date: "2024-01-07", level: 5 },
    ],
    painDistribution: {
      mild: 8,
      moderate: 12,
      severe: 4,
    },
    commonLocations: [
      {
        location: t("locations.lowerAbdomen"),
        count: 15,
        percentage: 62.5,
      },
      {
        location: t("locations.lowerBack"),
        count: 6,
        percentage: 25,
      },
      {
        location: t("locations.thighs"),
        count: 3,
        percentage: 12.5,
      },
    ],
    commonTypes: [
      {
        type: t("types.cramping"),
        count: 12,
        percentage: 50,
      },
      {
        type: t("types.dullPain"),
        count: 8,
        percentage: 33.3,
      },
      {
        type: t("types.sharpPain"),
        count: 4,
        percentage: 16.7,
      },
    ],
    insights: [
      {
        type: "pattern",
        title: t("insights.pattern.title"),
        description: t("insights.pattern.description"),
        severity: "medium",
      },
      {
        type: "recommendation",
        title: t("insights.recommendation.title"),
        description: t("insights.recommendation.description"),
        severity: "low",
      },
    ],
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "high":
        return t("priority.high");
      case "medium":
        return t("priority.medium");
      case "low":
        return t("priority.low");
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
          {t("title")}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </header>

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {t("period.title")}
          </h3>
          <div className="flex space-x-2">
            {[
              { key: "week", label: t("period.week") },
              { key: "month", label: t("period.month") },
              { key: "quarter", label: t("period.quarter") },
              { key: "year", label: t("period.year") },
            ].map((period) => (
              <button
                key={period.key}
                onClick={() =>
                  setSelectedPeriod(
                    period.key as "week" | "month" | "quarter" | "year",
                  )
                }
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedPeriod === period.key
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {mockAnalytics.averagePainLevel}
          </div>
          <div className="text-sm text-gray-600">
            {t("metrics.averagePainLevel")}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {mockAnalytics.totalRecords}
          </div>
          <div className="text-sm text-gray-600">
            {t("metrics.totalRecords")}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {mockAnalytics.painTrend.length}
          </div>
          <div className="text-sm text-gray-600">
            {t("metrics.daysAnalyzed")}
          </div>
        </div>
      </div>

      {/* Pain Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t("distribution.title")}
        </h3>

        <div className="space-y-4">
          {Object.entries(mockAnalytics.painDistribution).map(
            ([level, count]) => {
              const percentage = (count / mockAnalytics.totalRecords) * 100;
              const levelLabel =
                level === "mild"
                  ? t("distribution.mild")
                  : level === "moderate"
                    ? t("distribution.moderate")
                    : t("distribution.severe");

              const levelColor =
                level === "mild"
                  ? "bg-green-500"
                  : level === "moderate"
                    ? "bg-yellow-500"
                    : "bg-red-500";

              return (
                <div key={level} className="flex items-center space-x-4">
                  <div className="w-20 text-sm font-medium text-gray-700">
                    {levelLabel}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${levelColor}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-16 text-sm text-gray-600 text-right">
                    {count} ({percentage.toFixed(1)}%)
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Common Locations and Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Common Locations */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t("locations.title")}
          </h3>

          <div className="space-y-3">
            {mockAnalytics.commonLocations.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-600">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.location}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {item.count} ({item.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Types */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t("types.title")}
          </h3>

          <div className="space-y-3">
            {mockAnalytics.commonTypes.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-600">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.type}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {item.count} ({item.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t("insights.title")}
        </h3>

        <div className="space-y-4">
          {mockAnalytics.insights.map((insight, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">
                  {insight.title}
                </h4>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                    insight.severity,
                  )}`}
                >
                  {getSeverityLabel(insight.severity)}
                </span>
              </div>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <section
        className="bg-white rounded-lg shadow-sm p-4 sm:p-6"
        aria-labelledby="chart-heading"
      >
        <h2
          id="chart-heading"
          className="text-base sm:text-lg font-medium text-gray-900 mb-4"
        >
          {t("chart.title")}
        </h2>

        <div
          className="h-64 sm:h-80 bg-gray-50 rounded-lg flex items-center justify-center"
          role="img"
          aria-labelledby="chart-description"
        >
          <div className="text-center max-w-sm mx-auto p-4">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-2">
              {t("chart.placeholder")}
            </h3>
            <p
              id="chart-description"
              className="text-xs sm:text-sm text-gray-500"
            >
              {t("chart.description")}
            </p>
          </div>
        </div>

        {/* Alternative text description for screen readers */}
        <div className="sr-only">{t("chart.ariaDescription")}</div>
      </section>
    </div>
  );
}
