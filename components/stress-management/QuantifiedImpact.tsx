"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { TrendingUp, AlertTriangle, Heart, Brain, Zap } from "lucide-react";

export default function QuantifiedImpact() {
  const t = useTranslations("stressManagement");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const impactMetrics = [
    {
      id: "anxiety",
      icon: Brain,
      title: t("quantifiedImpact.metrics.anxiety.title"),
      lowStress: { value: 3.2, max: 10 },
      highStress: { value: 5.3, max: 10 },
      increase: 67,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
    },
    {
      id: "depression",
      icon: Heart,
      title: t("quantifiedImpact.metrics.depression.title"),
      lowStress: { value: 2.8, max: 10 },
      highStress: { value: 4.3, max: 10 },
      increase: 54,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-800",
    },
    {
      id: "irritability",
      icon: Zap,
      title: t("quantifiedImpact.metrics.irritability.title"),
      lowStress: { value: 3.5, max: 10 },
      highStress: { value: 6.1, max: 10 },
      increase: 73,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-800",
    },
  ];

  const menstrualImpact = [
    {
      category: t("quantifiedImpact.menstrualImpact.cycleLength.title"),
      lowStress: t("quantifiedImpact.menstrualImpact.cycleLength.lowStress"),
      highStress: t("quantifiedImpact.menstrualImpact.cycleLength.highStress"),
      icon: TrendingUp,
    },
    {
      category: t("quantifiedImpact.menstrualImpact.painIntensity.title"),
      lowStress: t("quantifiedImpact.menstrualImpact.painIntensity.lowStress"),
      highStress: t(
        "quantifiedImpact.menstrualImpact.painIntensity.highStress",
      ),
      icon: AlertTriangle,
    },
    {
      category: t("quantifiedImpact.menstrualImpact.flowChanges.title"),
      lowStress: t("quantifiedImpact.menstrualImpact.flowChanges.lowStress"),
      highStress: t("quantifiedImpact.menstrualImpact.flowChanges.highStress"),
      icon: Heart,
    },
  ];

  const ProgressBar = ({
    value,
    max,
    color,
    showValue = true,
  }: {
    value: number;
    max: number;
    color: string;
    showValue?: boolean;
  }) => {
    const percentage = (value / max) * 100;

    return (
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`bg-gradient-to-r ${color} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showValue && (
          <div className="text-right text-sm font-medium mt-1">
            {value}/{max}
          </div>
        )}
      </div>
    );
  };

  const getIntensityLevel = (increase: number) => {
    if (increase >= 70)
      return { level: "high", emoji: "🔴🔴🔴", color: "text-red-600" };
    if (increase >= 50)
      return { level: "medium", emoji: "🔴🔴", color: "text-orange-600" };
    return { level: "low", emoji: "🔴", color: "text-yellow-600" };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {t("quantifiedImpact.title")}
        </h3>
        <p className="text-gray-600">{t("quantifiedImpact.subtitle")}</p>
      </div>

      {/* Emotional Impact Visualization */}
      <div className="mb-8">
        <h4 className="text-lg font-bold text-gray-800 mb-6">
          {t("quantifiedImpact.emotionalImpact.title")}
        </h4>

        <div className="space-y-6">
          {impactMetrics.map((metric) => {
            const intensity = getIntensityLevel(metric.increase);

            return (
              <div
                key={metric.id}
                className={`${
                  metric.bgColor
                } rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
                  selectedMetric === metric.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() =>
                  setSelectedMetric(
                    selectedMetric === metric.id ? null : metric.id,
                  )
                }
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 bg-gradient-to-r ${metric.color} rounded-full flex items-center justify-center`}
                    >
                      <metric.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h5 className={`font-bold ${metric.textColor}`}>
                        {metric.title}
                      </h5>
                      <p className={`text-sm ${metric.textColor} opacity-80`}>
                        {t("quantifiedImpact.emotionalImpact.subtitle")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${intensity.color}`}>
                      +{metric.increase}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {intensity.emoji}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`text-sm font-medium ${metric.textColor}`}
                      >
                        {t("quantifiedImpact.emotionalImpact.lowStress")}:
                      </span>
                      <span className={`text-sm ${metric.textColor}`}>
                        {metric.lowStress.value}/10
                      </span>
                    </div>
                    <ProgressBar
                      value={metric.lowStress.value}
                      max={metric.lowStress.max}
                      color="from-gray-400 to-gray-500"
                      showValue={false}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`text-sm font-medium ${metric.textColor}`}
                      >
                        {t("quantifiedImpact.emotionalImpact.highStress")}:
                      </span>
                      <span className={`text-sm ${metric.textColor}`}>
                        {metric.highStress.value}/10
                      </span>
                    </div>
                    <ProgressBar
                      value={metric.highStress.value}
                      max={metric.highStress.max}
                      color={metric.color}
                      showValue={false}
                    />
                  </div>
                </div>

                {selectedMetric === metric.id && (
                  <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                    <div className="bg-white rounded-lg p-4">
                      <h6 className="font-semibold text-gray-800 mb-2">
                        {t("quantifiedImpact.emotionalImpact.details.title")}
                      </h6>
                      <p className="text-gray-600 text-sm">
                        {t(
                          `quantifiedImpact.emotionalImpact.details.${metric.id}`,
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Menstrual Impact */}
      <div className="mb-8">
        <h4 className="text-lg font-bold text-gray-800 mb-6">
          {t("quantifiedImpact.menstrualImpact.title")}
        </h4>

        <div className="grid md:grid-cols-3 gap-6">
          {menstrualImpact.map((impact, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <impact.icon className="w-5 h-5 text-white" />
                </div>
                <h5 className="font-bold text-purple-800">{impact.category}</h5>
              </div>

              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-sm font-medium text-green-700 mb-1">
                    {t("quantifiedImpact.menstrualImpact.lowStress")}:
                  </div>
                  <div className="text-sm text-green-600">
                    {impact.lowStress}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3">
                  <div className="text-sm font-medium text-red-700 mb-1">
                    {t("quantifiedImpact.menstrualImpact.highStress")}:
                  </div>
                  <div className="text-sm text-red-600">
                    {impact.highStress}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
        <h4 className="font-bold text-indigo-800 mb-4">
          {t("quantifiedImpact.keyInsights.title")}
        </h4>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h5 className="font-semibold text-indigo-800 mb-1">
                  {t("quantifiedImpact.keyInsights.insight1.title")}
                </h5>
                <p className="text-indigo-700 text-sm">
                  {t("quantifiedImpact.keyInsights.insight1.description")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h5 className="font-semibold text-indigo-800 mb-1">
                  {t("quantifiedImpact.keyInsights.insight2.title")}
                </h5>
                <p className="text-indigo-700 text-sm">
                  {t("quantifiedImpact.keyInsights.insight2.description")}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <h5 className="font-semibold text-purple-800 mb-1">
                  {t("quantifiedImpact.keyInsights.insight3.title")}
                </h5>
                <p className="text-purple-700 text-sm">
                  {t("quantifiedImpact.keyInsights.insight3.description")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <div>
                <h5 className="font-semibold text-purple-800 mb-1">
                  {t("quantifiedImpact.keyInsights.insight4.title")}
                </h5>
                <p className="text-purple-700 text-sm">
                  {t("quantifiedImpact.keyInsights.insight4.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-semibold text-blue-800 mb-2">
            {t("quantifiedImpact.actionItems.immediate.title")}
          </h5>
          <p className="text-blue-700 text-sm">
            {t("quantifiedImpact.actionItems.immediate.description")}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h5 className="font-semibold text-green-800 mb-2">
            {t("quantifiedImpact.actionItems.longterm.title")}
          </h5>
          <p className="text-green-700 text-sm">
            {t("quantifiedImpact.actionItems.longterm.description")}
          </p>
        </div>
      </div>
    </div>
  );
}
