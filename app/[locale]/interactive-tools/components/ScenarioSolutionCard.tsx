"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface ScenarioSolutionCardProps {
  solution: {
    id: string;
    title: string;
    description: string;
    href: string;
    icon: string;
    priority: string;
    iconColor?: string;
    anchorTextType?: string;
  };
  locale: string;
}

export default function ScenarioSolutionCard({
  solution,
  locale,
}: ScenarioSolutionCardProps) {
  const anchorT = useTranslations("anchorTexts");

  // 根据图标颜色确定背景色和文字色
  const getIconColors = (color?: string) => {
    switch (color) {
      case "orange":
        return { bg: "bg-orange-100", text: "text-orange-600" };
      case "red":
        return { bg: "bg-red-100", text: "text-red-600" };
      case "blue":
        return { bg: "bg-blue-100", text: "text-blue-600" };
      case "green":
        return { bg: "bg-green-100", text: "text-green-600" };
      case "purple":
        return { bg: "bg-purple-100", text: "text-purple-600" };
      case "pink":
        return { bg: "bg-pink-100", text: "text-pink-600" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600" };
    }
  };

  const iconColors = getIconColors(solution.iconColor);

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
      data-locale={locale}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div
            className={`w-12 h-12 ${iconColors.bg} rounded-lg flex items-center justify-center`}
          >
            <span className="text-2xl">{solution.icon}</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {solution.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">{solution.description}</p>
          <Link
            href={solution.href}
            className={`inline-flex items-center ${
              iconColors.text
            } hover:${iconColors.text.replace(
              "600",
              "800",
            )} font-medium text-sm transition-colors`}
            suppressHydrationWarning={true}
          >
            {solution.anchorTextType
              ? solution.anchorTextType.includes("teen.")
                ? anchorT(solution.anchorTextType)
                : anchorT(`solutions.${solution.anchorTextType}`)
              : solution.id === "office"
                ? anchorT("solutions.office")
                : solution.id === "social"
                  ? anchorT("solutions.social")
                  : solution.id === "workplace-cycle-management"
                    ? anchorT("solutions.workplace_cycle")
                    : solution.id === "student-cycle-wellness"
                      ? anchorT("solutions.student_cycle")
                      : solution.id === "fitness-cycle-balance"
                        ? anchorT("solutions.fitness_cycle")
                        : solution.id === "exercise"
                          ? anchorT("solutions.exercise")
                          : solution.id === "sleep"
                            ? anchorT("solutions.sleep")
                            : solution.id === "workplace-wellness"
                              ? anchorT("solutions.workplace_wellness")
                              : solution.id === "exercise-balance"
                                ? anchorT("solutions.exercise_balance")
                                : anchorT("solutions.workplace")}{" "}
            &gt;
          </Link>
        </div>
      </div>
    </div>
  );
}
