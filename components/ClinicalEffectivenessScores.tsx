"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";

interface EffectivenessScore {
  name: string;
  score: number; // 0-10
  color: string;
  gradientFrom: string;
  gradientTo: string;
  description: string;
}

const ClinicalEffectivenessScores: React.FC = () => {
  const t = useTranslations("clinicalEffectivenessScores");

  const scores: EffectivenessScore[] = [
    {
      name: t("scores.nsaids.name"),
      score: 6.2,
      color: "text-orange-500",
      gradientFrom: "from-orange-400",
      gradientTo: "to-orange-500",
      description: t("scores.nsaids.description"),
    },
    {
      name: t("scores.exercise.name"),
      score: 7.5,
      color: "text-green-500",
      gradientFrom: "from-green-400",
      gradientTo: "to-green-500",
      description: t("scores.exercise.description"),
    },
    {
      name: t("scores.ai.name"),
      score: 8.9,
      color: "text-purple-500",
      gradientFrom: "from-purple-600",
      gradientTo: "to-pink-500",
      description: t("scores.ai.description"),
    },
    {
      name: t("scores.acetaminophen.name"),
      score: 5.8,
      color: "text-yellow-500",
      gradientFrom: "from-yellow-400",
      gradientTo: "to-yellow-500",
      description: t("scores.acetaminophen.description"),
    },
  ];

  return (
    <div className="relative">
      <div className="glass dark:bg-slate-800 rounded-2xl p-8 shadow-2xl">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
          {t("title")}
        </h3>

        <div className="space-y-4">
          {scores.map((score, index) => {
            const widthPercentage = (score.score / 10) * 100;
            const isHighlighted =
              score.name.includes("AI") || score.name.includes("AI个性化");

            return (
              <div key={index} className="relative">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {score.name}
                  </span>
                  <span className={`${score.color} font-semibold`}>
                    {score.score}/10
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${
                      score.gradientFrom
                    } ${score.gradientTo} transition-all duration-500 ${
                      isHighlighted ? "animate-pulse" : ""
                    }`}
                    style={{ width: `${widthPercentage}%` }}
                  />
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {score.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <strong>{t("source.label")}</strong> {t("source.text")}
          </p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full opacity-20 animate-float pointer-events-none"></div>
      <div
        className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 animate-float pointer-events-none"
        style={{ animationDelay: "1s" }}
      ></div>
    </div>
  );
};

export default ClinicalEffectivenessScores;
