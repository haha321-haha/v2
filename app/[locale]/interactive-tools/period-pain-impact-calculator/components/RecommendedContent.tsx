"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

// 动态导入相关组件 - 代码分割优化
const RelatedArticleCard = dynamic(
  () => import("../../components/RelatedArticleCard"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
    ),
  },
);

const RelatedToolCard = dynamic(
  () => import("../../components/RelatedToolCard"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
    ),
  },
);

const ScenarioSolutionCard = dynamic(
  () => import("../../components/ScenarioSolutionCard"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
    ),
  },
);

interface RecommendedContentProps {
  locale: "en" | "zh";
  severity?: "mild" | "moderate" | "severe" | "emergency";
}

// 痛经影响计算器专用推荐数据配置
const getRecommendationsBySeverity = (
  locale: string,
  t: ReturnType<typeof useTranslations>,
  severity?: "mild" | "moderate" | "severe" | "emergency",
) => {
  // 推荐文章推荐
  const relatedArticles = [
    {
      id: "menstrual-stress-management",
      title: t("recommendations.articles.menstrualStressManagement.title"),
      description: t(
        "recommendations.articles.menstrualStressManagement.description",
      ),
      href: `/${locale}/articles/menstrual-stress-management-complete-guide`,
      category: t(
        "recommendations.articles.menstrualStressManagement.category",
      ),
      readTime: t(
        "recommendations.articles.menstrualStressManagement.readTime",
      ),
      priority:
        severity === "emergency"
          ? "high"
          : severity === "severe"
            ? "high"
            : "medium",
      icon: "💼",
      iconColor: "blue",
      anchorTextType: "workplace_health",
    },
    {
      id: "menstrual-sleep-quality",
      title: t("recommendations.articles.menstrualSleepQuality.title"),
      description: t(
        "recommendations.articles.menstrualSleepQuality.description",
      ),
      href: `/${locale}/articles/menstrual-sleep-quality-improvement-guide`,
      category: t("recommendations.articles.menstrualSleepQuality.category"),
      readTime: t("recommendations.articles.menstrualSleepQuality.readTime"),
      priority: severity === "severe" ? "high" : "medium",
      icon: "😴",
      iconColor: "purple",
      anchorTextType: "pain_management",
    },
    {
      id: "anti-inflammatory-diet",
      title: t("recommendations.articles.antiInflammatoryDiet.title"),
      description: t(
        "recommendations.articles.antiInflammatoryDiet.description",
      ),
      href: `/${locale}/articles/anti-inflammatory-diet-period-pain`,
      category: t("recommendations.articles.antiInflammatoryDiet.category"),
      readTime: t("recommendations.articles.antiInflammatoryDiet.readTime"),
      priority: "medium",
      icon: "🥗",
      iconColor: "green",
      anchorTextType: "quick_relief",
    },
  ];

  // 相关工具推荐
  const relatedTools = [
    {
      id: "symptom-assessment",
      title: t("recommendations.tools.symptomAssessment.title"),
      description: t("recommendations.tools.symptomAssessment.description"),
      href: `/${locale}/interactive-tools/symptom-assessment`,
      category: t("recommendations.tools.symptomAssessment.category"),
      difficulty: t("recommendations.tools.symptomAssessment.difficulty"),
      estimatedTime: t("recommendations.tools.symptomAssessment.estimatedTime"),
      priority: "high",
      icon: "🔍",
      iconColor: "purple",
      anchorTextType: "assessment",
    },
    {
      id: "pain-tracker",
      title: t("recommendations.tools.painTracker.title"),
      description: t("recommendations.tools.painTracker.description"),
      href: `/${locale}/interactive-tools/pain-tracker`,
      category: t("recommendations.tools.painTracker.category"),
      difficulty: t("recommendations.tools.painTracker.difficulty"),
      estimatedTime: t("recommendations.tools.painTracker.estimatedTime"),
      priority:
        severity === "emergency"
          ? "high"
          : severity === "severe"
            ? "high"
            : "medium",
      icon: "📊",
      iconColor: "red",
      anchorTextType: "pain_tracker",
    },
  ];

  // 场景解决方案推荐
  const scenarioSolutions = [
    {
      id: "emergency-kit",
      title: t("recommendations.scenarios.emergencyKit.title"),
      description: t("recommendations.scenarios.emergencyKit.description"),
      href: `/${locale}/scenario-solutions/emergency-kit`,
      icon: "🚨",
      priority:
        severity === "emergency"
          ? "high"
          : severity === "severe"
            ? "high"
            : "medium",
      iconColor: "red",
      anchorTextType: "relief",
    },
    {
      id: "office",
      title: t("recommendations.scenarios.office.title"),
      description: t("recommendations.scenarios.office.description"),
      href: `/${locale}/scenario-solutions/office`,
      icon: "💼",
      priority: "medium",
      iconColor: "blue",
      anchorTextType: "office",
    },
  ];

  return { relatedArticles, relatedTools, scenarioSolutions };
};

export default function RecommendedContent({
  locale,
  severity,
}: RecommendedContentProps) {
  const t = useTranslations("periodPainImpactCalculator");
  const { relatedArticles, relatedTools, scenarioSolutions } =
    getRecommendationsBySeverity(locale, t, severity);

  return (
    <div className="bg-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* 推荐文章区域 - 与symptom-assessment保持一致 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("relatedContent.articles")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((article) => (
                <RelatedArticleCard
                  key={article.id}
                  article={article}
                  locale={locale}
                />
              ))}
            </div>
          </section>

          {/* 相关工具区域 - 统一为3列 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("relatedContent.tools")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTools.map((tool) => (
                <RelatedToolCard key={tool.id} tool={tool} locale={locale} />
              ))}
            </div>
          </section>

          {/* 场景解决方案区域 - 统一为3列 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("relatedContent.scenarios")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scenarioSolutions.map((solution) => (
                <ScenarioSolutionCard
                  key={solution.id}
                  solution={solution}
                  locale={locale}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
