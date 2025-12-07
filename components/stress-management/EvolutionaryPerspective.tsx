"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Lightbulb, Shield, Clock, Heart } from "lucide-react";

interface EvolutionaryPerspectiveProps {
  locale: string;
}

export default function EvolutionaryPerspective({
  locale,
}: EvolutionaryPerspectiveProps) {
  const t = useTranslations("stressManagement");
  const [showDetails, setShowDetails] = useState(false);

  const insights = [
    {
      icon: Shield,
      title: locale === "zh" ? "保护机制" : "Protective Mechanism",
      description:
        locale === "zh"
          ? "身体暂停生育功能以保护生存"
          : "Body pauses reproduction to protect survival",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Clock,
      title: locale === "zh" ? "时机选择" : "Timing Choice",
      description:
        locale === "zh"
          ? "等待更安全的时机进行繁殖"
          : "Wait for safer timing for reproduction",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Heart,
      title: locale === "zh" ? "资源保护" : "Resource Protection",
      description:
        locale === "zh"
          ? "节省能量用于应对威胁"
          : "Save energy for dealing with threats",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg p-6 mb-8 border-l-4 border-amber-400">
      {/* Header with Lightbulb Icon */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-6 h-6 text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {t("evolutionary.title")}
          </h3>
          <p className="text-gray-600">{t("evolutionary.subtitle")}</p>
        </div>
      </div>

      {/* Main Insight */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full mb-3">
            <span className="text-2xl">🧬</span>
          </div>
          <h4 className="text-xl font-bold text-gray-800 mb-2">
            {t("evolutionary.mainTitle")}
          </h4>
          <p className="text-gray-600">{t("evolutionary.mainDescription")}</p>
        </div>

        {/* Key Insights Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`${insight.bgColor} rounded-lg p-4 text-center`}
            >
              <insight.icon
                className={`w-8 h-8 ${insight.color} mx-auto mb-2`}
              />
              <h5 className="font-semibold text-gray-800 mb-1">
                {insight.title}
              </h5>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </div>
          ))}
        </div>

        {/* Evolutionary Story */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 mb-4">
          <h5 className="font-bold text-amber-800 mb-2">
            {t("evolutionary.storyTitle")}
          </h5>
          <p className="text-amber-700 text-sm">
            {t("evolutionary.storyContent")}
          </p>
        </div>

        {/* Modern Context */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4 mb-4">
          <h5 className="font-bold text-blue-800 mb-2">
            {t("evolutionary.modernTitle")}
          </h5>
          <p className="text-blue-700 text-sm">
            {t("evolutionary.modernContent")}
          </p>
        </div>

        {/* Key Realization */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
          <h5 className="font-bold text-green-800 mb-2">
            {t("evolutionary.realizationTitle")}
          </h5>
          <div className="space-y-2">
            <p className="text-green-700 text-sm">
              ✨ {t("evolutionary.realization1")}
            </p>
            <p className="text-green-700 text-sm">
              ✨ {t("evolutionary.realization2")}
            </p>
            <p className="text-green-700 text-sm">
              ✨ {t("evolutionary.realization3")}
            </p>
          </div>
        </div>
      </div>

      {/* Practical Application */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h4 className="text-lg font-bold text-gray-800 mb-4">
          {t("evolutionary.practicalTitle")}
        </h4>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-4">
          <p className="text-indigo-700 text-sm mb-3">
            {t("evolutionary.practicalDescription")}
          </p>
          <div className="bg-white rounded-lg p-3 border-l-4 border-indigo-400">
            <p className="text-gray-700 italic">
              &quot;{t("evolutionary.selfTalk")}&quot;
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h5 className="font-semibold text-blue-800 mb-2">
              {t("evolutionary.action1.title")}
            </h5>
            <p className="text-blue-700 text-sm">
              {t("evolutionary.action1.description")}
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h5 className="font-semibold text-purple-800 mb-2">
              {t("evolutionary.action2.title")}
            </h5>
            <p className="text-purple-700 text-sm">
              {t("evolutionary.action2.description")}
            </p>
          </div>
        </div>
      </div>

      {/* Toggle Details Button */}
      <div className="text-center mt-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2 mx-auto"
        >
          {showDetails ? (
            <>
              <span>{t("hideDetails")}</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </>
          ) : (
            <>
              <span>{t("learnMore")}</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Additional Details */}
      {showDetails && (
        <div className="mt-6 bg-white rounded-lg p-6 shadow-sm border-t">
          <h4 className="text-lg font-bold text-gray-800 mb-4">
            {t("evolutionary.detailsTitle")}
          </h4>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-2">
                {t("evolutionary.detail1.title")}
              </h5>
              <p className="text-gray-600 text-sm">
                {t("evolutionary.detail1.content")}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-2">
                {t("evolutionary.detail2.title")}
              </h5>
              <p className="text-gray-600 text-sm">
                {t("evolutionary.detail2.content")}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-2">
                {t("evolutionary.detail3.title")}
              </h5>
              <p className="text-gray-600 text-sm">
                {t("evolutionary.detail3.content")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
