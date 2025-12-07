"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface RelatedArticleCardProps {
  article: {
    id: string;
    title: string;
    description: string;
    href: string;
    category: string;
    readTime: string;
    priority: string;
    icon?: string;
    iconColor?: string;
    anchorTextType?: string;
  };
  locale: string;
}

export default function RelatedArticleCard({
  article,
  locale,
}: RelatedArticleCardProps) {
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
      default:
        return { bg: "bg-gray-100", text: "text-gray-600" };
    }
  };

  const iconColors = getIconColors(article.iconColor);

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
      data-locale={locale}
    >
      <div className="flex items-start space-x-4">
        {article.icon && (
          <div className="flex-shrink-0">
            <div
              className={`w-12 h-12 ${iconColors.bg} rounded-lg flex items-center justify-center`}
            >
              <span className="text-2xl">{article.icon}</span>
            </div>
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
              {article.category}
            </span>
            <span className="text-gray-500 text-xs flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {article.readTime}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">{article.description}</p>
          <Link
            href={article.href}
            className={`inline-flex items-center ${
              iconColors.text
            } hover:${iconColors.text.replace(
              "600",
              "800",
            )} font-medium text-sm transition-colors`}
            suppressHydrationWarning={true}
          >
            {article.anchorTextType
              ? anchorT(`articles.${article.anchorTextType}`)
              : anchorT("articles.related")}{" "}
            &gt;
          </Link>
        </div>
      </div>
    </div>
  );
}
