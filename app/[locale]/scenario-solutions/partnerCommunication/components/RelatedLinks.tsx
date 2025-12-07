"use client";

import React from "react";
import Link from "next/link";
import { useSafeTranslations } from "@/hooks/useSafeTranslations";
import { RelatedLink, Locale } from "../types/common";

interface RelatedLinksProps {
  locale: Locale;
  className?: string;
  showTitle?: boolean;
  maxItems?: number;
}

export default function RelatedLinks({
  locale,
  className = "",
  showTitle = true,
  maxItems = 5,
}: RelatedLinksProps) {
  const { t } = useSafeTranslations("partnerHandbook.relatedLinks");
  const { t: tCommon } = useSafeTranslations("partnerHandbook");

  // 相关链接配置
  const relatedLinks: RelatedLink[] = [
    {
      id: "scenarioSolutions",
      title: t("scenarioSolutions.title"),
      description: t("scenarioSolutions.description"),
      url: `/${locale}/scenario-solutions`,
      relevance: "high",
      icon: "🎯",
    },
    {
      id: "naturalTherapies",
      title: t("naturalTherapies.title"),
      description: t("naturalTherapies.description"),
      url: `/${locale}/natural-therapies`,
      relevance: "high",
      icon: "🌿",
    },
    {
      id: "interactiveTools",
      title: t("interactiveTools.title"),
      description: t("interactiveTools.description"),
      url: `/${locale}/interactive-tools`,
      relevance: "medium",
      icon: "🛠️",
    },
    {
      id: "healthGuide",
      title: t("healthGuide.title"),
      description: t("healthGuide.description"),
      url: `/${locale}/health-guide`,
      relevance: "medium",
      icon: "📚",
    },
    {
      id: "downloads",
      title: t("downloads.title"),
      description: t("downloads.description"),
      url: `/${locale}/downloads`,
      relevance: "required",
      icon: "📄",
    },
  ];

  const getRelevanceClasses = (relevance: string) => {
    switch (relevance) {
      case "high":
        return "border-l-4 border-primary-500";
      case "medium":
        return "border-l-4 border-blue-500";
      case "low":
        return "border-l-4 border-neutral-400";
      case "required":
        return "border-l-4 border-red-500";
      default:
        return "border-l-4 border-neutral-400";
    }
  };

  const getRelevanceBadge = (relevance: string) => {
    switch (relevance) {
      case "high":
        return {
          text: tCommon("highlyRelevant"),
          class: "bg-primary-100 text-primary-800",
        };
      case "medium":
        return {
          text: tCommon("moderatelyRelevant"),
          class: "bg-blue-100 text-blue-800",
        };
      case "low":
        return {
          text: tCommon("lowRelevance"),
          class: "bg-neutral-100 text-neutral-800",
        };
      case "required":
        return { text: tCommon("required"), class: "bg-red-100 text-red-800" };
      default:
        return { text: "", class: "" };
    }
  };

  const displayedLinks = relatedLinks.slice(0, maxItems);

  return (
    <div className={`related-links-section ${className}`}>
      {showTitle && (
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {tCommon("relatedRecommendations")}
          </h3>
          <p className="text-gray-600">{tCommon("exploreMoreContent")}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {displayedLinks.map((link) => {
          const relevanceBadge = getRelevanceBadge(link.relevance);

          return (
            <Link
              key={link.id}
              href={link.url}
              className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer ${getRelevanceClasses(
                link.relevance,
              )}`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{link.icon}</span>
                {relevanceBadge.text && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${relevanceBadge.class}`}
                  >
                    {relevanceBadge.text}
                  </span>
                )}
              </div>

              <h4 className="font-semibold text-gray-800 mb-2">{link.title}</h4>

              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {link.description}
              </p>

              <div className="flex items-center text-primary-600 text-sm font-medium">
                <span>{tCommon("learnMore")}</span>
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 查看更多文章按钮 */}
      <div className="text-center">
        <ViewMoreArticlesButton locale={locale} variant="primary" size="lg" />
      </div>
    </div>
  );
}

// 导入ViewMoreArticlesButton组件
import ViewMoreArticlesButton from "./ViewMoreArticlesButton";
