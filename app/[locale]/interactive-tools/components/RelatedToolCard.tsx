"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface RelatedToolCardProps {
  tool: {
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

export default function RelatedToolCard({
  tool,
  locale,
}: RelatedToolCardProps) {
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

  const iconColors = getIconColors(tool.iconColor);

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
            <span className="text-2xl">{tool.icon}</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {tool.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
          <Link
            href={tool.href}
            className={`inline-flex items-center ${
              iconColors.text
            } hover:${iconColors.text.replace(
              "600",
              "800",
            )} font-medium text-sm transition-colors`}
            suppressHydrationWarning={true}
          >
            {tool.anchorTextType
              ? anchorT(`tools.${tool.anchorTextType}`)
              : tool.id === "pain-tracker"
                ? anchorT("tools.pain_tracker")
                : tool.id === "symptom-assessment"
                  ? anchorT("tools.symptom_assessment")
                  : tool.id === "constitution-test"
                    ? anchorT("tools.constitution")
                    : tool.id === "nutrition-recommendation-generator"
                      ? anchorT("tools.nutrition_generator")
                      : tool.id === "cycle-tracker"
                        ? anchorT("tools.tracker")
                        : anchorT("tools.assessment")}{" "}
            &gt;
          </Link>
        </div>
      </div>
    </div>
  );
}
