"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Brain,
  Heart,
  Zap,
  AlertTriangle,
  Clock,
} from "lucide-react";

export default function NeuroendocrineCascade() {
  const t = useTranslations("stressManagement");
  const [isExpanded, setIsExpanded] = useState(false);

  const cascadeSteps = [
    {
      id: 1,
      icon: Brain,
      title: t("neuroendocrine.steps.step1.title"),
      description: t("neuroendocrine.steps.step1.description"),
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      icon: Zap,
      title: t("neuroendocrine.steps.step2.title"),
      description: t("neuroendocrine.steps.step2.description"),
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      id: 3,
      icon: Heart,
      title: t("neuroendocrine.steps.step3.title"),
      description: t("neuroendocrine.steps.step3.description"),
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      id: 4,
      icon: AlertTriangle,
      title: t("neuroendocrine.steps.step4.title"),
      description: t("neuroendocrine.steps.step4.description"),
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {t("neuroendocrine.title")}
          </h3>
          <p className="text-gray-600">{t("neuroendocrine.subtitle")}</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-5 h-5" />
              {t("hideDetails")}
            </>
          ) : (
            <>
              <ChevronDown className="w-5 h-5" />
              {t("showDetails")}
            </>
          )}
        </button>
      </div>

      {/* Cascade Visualization */}
      <div className="relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {cascadeSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              {/* Step Card */}
              <div
                className={`${step.bgColor} rounded-xl p-4 shadow-md min-w-[200px]`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center`}
                  >
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{step.title}</h4>
                    <span className="text-sm text-gray-500">
                      {t("neuroendocrine.stepLabel")} {step.id}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>

              {/* Arrow */}
              {index < cascadeSteps.length - 1 && (
                <div className="hidden md:block mx-4">
                  <div
                    className={`w-8 h-8 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center`}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Arrows */}
        <div className="md:hidden flex flex-col items-center gap-2 mt-4">
          {cascadeSteps.slice(0, -1).map((step, index) => (
            <div
              key={`mobile-arrow-${index}`}
              className={`w-6 h-6 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center`}
            >
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-8 border-t pt-6">
          <h4 className="text-lg font-bold text-gray-800 mb-6">
            {t("neuroendocrine.detailedExplanation")}
          </h4>

          {/* Scientific Background */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 mb-6">
            <h5 className="font-bold text-indigo-800 mb-3">
              {t("neuroendocrine.scientificBackground.title")}
            </h5>
            <p className="text-indigo-700 text-sm mb-4">
              {t("neuroendocrine.scientificBackground.description")}
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3">
                <div className="text-lg font-bold text-indigo-600 mb-1">
                  {t("neuroendocrine.scientificBackground.fact1.number")}
                </div>
                <div className="text-xs text-indigo-700">
                  {t("neuroendocrine.scientificBackground.fact1.description")}
                </div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-lg font-bold text-indigo-600 mb-1">
                  {t("neuroendocrine.scientificBackground.fact2.number")}
                </div>
                <div className="text-xs text-indigo-700">
                  {t("neuroendocrine.scientificBackground.fact2.description")}
                </div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-lg font-bold text-indigo-600 mb-1">
                  {t("neuroendocrine.scientificBackground.fact3.number")}
                </div>
                <div className="text-xs text-indigo-700">
                  {t("neuroendocrine.scientificBackground.fact3.description")}
                </div>
              </div>
            </div>
          </div>

          {/* Acute vs Chronic Comparison */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h5 className="font-bold text-blue-800">
                  {t("neuroendocrine.acute.title")}
                </h5>
              </div>
              <p className="text-blue-700 text-sm mb-4">
                {t("neuroendocrine.acute.description")}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600 font-medium">
                    {t("neuroendocrine.acute.duration")}:
                  </span>
                  <span className="text-blue-700">
                    {t("neuroendocrine.acute.durationValue")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600 font-medium">
                    {t("neuroendocrine.acute.recovery")}:
                  </span>
                  <span className="text-blue-700">
                    {t("neuroendocrine.acute.recoveryValue")}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-400">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <h5 className="font-bold text-red-800">
                  {t("neuroendocrine.chronic.title")}
                </h5>
              </div>
              <p className="text-red-700 text-sm mb-4">
                {t("neuroendocrine.chronic.description")}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-red-600 font-medium">
                    {t("neuroendocrine.chronic.duration")}:
                  </span>
                  <span className="text-red-700">
                    {t("neuroendocrine.chronic.durationValue")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-600 font-medium">
                    {t("neuroendocrine.chronic.recovery")}:
                  </span>
                  <span className="text-red-700">
                    {t("neuroendocrine.chronic.recoveryValue")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insight with Action Items */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
            <h5 className="font-bold text-purple-800 mb-3">
              {t("neuroendocrine.keyInsight")}
            </h5>
            <p className="text-purple-700 text-sm mb-4">
              {t("neuroendocrine.keyInsightDescription")}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h6 className="font-semibold text-purple-800 mb-2">
                  {t("neuroendocrine.actionItems.immediate.title")}
                </h6>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• {t("neuroendocrine.actionItems.immediate.item1")}</li>
                  <li>• {t("neuroendocrine.actionItems.immediate.item2")}</li>
                  <li>• {t("neuroendocrine.actionItems.immediate.item3")}</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h6 className="font-semibold text-purple-800 mb-2">
                  {t("neuroendocrine.actionItems.longterm.title")}
                </h6>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• {t("neuroendocrine.actionItems.longterm.item1")}</li>
                  <li>• {t("neuroendocrine.actionItems.longterm.item2")}</li>
                  <li>• {t("neuroendocrine.actionItems.longterm.item3")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
