"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Breadcrumb from "@/components/Breadcrumb";

// 动态导入组件 - 代码分割优化
const SymptomAssessmentTool = dynamic(
  () => import("../components/SymptomAssessmentTool"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const RelatedArticleCard = dynamic(
  () => import("../components/RelatedArticleCard"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
    ),
  },
);

const RelatedToolCard = dynamic(() => import("../components/RelatedToolCard"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />,
});

const ScenarioSolutionCard = dynamic(
  () => import("../components/ScenarioSolutionCard"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
    ),
  },
);

interface Props {
  params: { locale: string };
}

// 症状评估工具专用推荐数据配置 - 使用翻译系统
const getSymptomAssessmentRecommendations = (
  locale: string,
  recT: ReturnType<typeof useTranslations>,
) => {
  // 推荐文章
  const relatedArticles = [
    {
      id: "comprehensive-medical-guide",
      title:
        locale === "zh"
          ? "痛经综合医疗指南"
          : "Comprehensive Medical Guide to Dysmenorrhea",
      description:
        locale === "zh"
          ? "专业医疗视角解析痛经，包含症状诊断和治疗方案"
          : "Professional medical perspective on dysmenorrhea, including symptom diagnosis and treatment options",
      href: `/${locale}/articles/comprehensive-medical-guide-to-dysmenorrhea`,
      category: locale === "zh" ? "医疗指南" : "Medical Guide",
      readTime: locale === "zh" ? "15分钟阅读" : "15 min read",
      priority: "high",
      icon: "🏥",
      iconColor: "red",
      anchorTextType: "medical_guide",
    },
    {
      id: "natural-relief-methods",
      title:
        locale === "zh"
          ? "家庭自然疼痛缓解方法"
          : "Home Natural Menstrual Pain Relief",
      description:
        locale === "zh"
          ? "自然、安全的居家疼痛缓解方法，无药物副作用"
          : "Natural, safe home pain relief methods without medication side effects",
      href: `/${locale}/articles/home-natural-menstrual-pain-relief`,
      category: locale === "zh" ? "自然疗法" : "Natural Therapy",
      readTime: locale === "zh" ? "10分钟阅读" : "10 min read",
      priority: "high",
      icon: "🌿",
      iconColor: "green",
      anchorTextType: "natural",
    },
    {
      id: "menstrual-pain-faq",
      title:
        locale === "zh"
          ? "痛经常见问题专家解答"
          : "Menstrual Pain FAQ - Expert Answers",
      description:
        locale === "zh"
          ? "医学专家解答关于痛经的常见问题和疑虑"
          : "Medical experts answer common questions and concerns about menstrual pain",
      href: `/${locale}/articles/menstrual-pain-faq-expert-answers`,
      category: locale === "zh" ? "常见问题" : "FAQ",
      readTime: locale === "zh" ? "8分钟阅读" : "8 min read",
      priority: "medium",
      icon: "❓",
      iconColor: "blue",
      anchorTextType: "comprehensive",
    },
  ];

  // 相关工具推荐
  const relatedTools = [
    {
      id: "pain-tracker",
      title: recT("relatedTools.painTracker.title"),
      description: recT("relatedTools.painTracker.description"),
      href: `/${locale}/interactive-tools/pain-tracker`,
      category: recT("relatedTools.painTracker.category"),
      difficulty: recT("relatedTools.painTracker.difficulty"),
      estimatedTime: recT("relatedTools.painTracker.estimatedTime"),
      priority: "high",
      icon: "📊",
      iconColor: "red",
      anchorTextType: "start_tracking",
    },
    {
      id: "constitution-test",
      title: recT("relatedTools.constitutionTest.title"),
      description: recT("relatedTools.constitutionTest.description"),
      href: `/${locale}/interactive-tools/constitution-test`,
      category: recT("relatedTools.constitutionTest.category"),
      difficulty: recT("relatedTools.constitutionTest.difficulty"),
      estimatedTime: recT("relatedTools.constitutionTest.estimatedTime"),
      priority: "high",
      icon: "🌿",
      iconColor: "green",
      anchorTextType: "start_test",
    },
    {
      id: "period-pain-impact-calculator",
      title: recT("relatedTools.impactCalculator.title"),
      description: recT("relatedTools.impactCalculator.description"),
      href: `/${locale}/interactive-tools/period-pain-impact-calculator`,
      category: recT("relatedTools.impactCalculator.category"),
      difficulty: recT("relatedTools.impactCalculator.difficulty"),
      estimatedTime: recT("relatedTools.impactCalculator.estimatedTime"),
      priority: "medium",
      icon: "📈",
      iconColor: "orange",
      anchorTextType: "start_assessment",
    },
  ];

  // 场景解决方案推荐
  const scenarioSolutions = [
    {
      id: "emergency-kit",
      title: recT("scenarioSolutions.emergencyKit.title"),
      description: recT("scenarioSolutions.emergencyKit.description"),
      href: `/${locale}/scenario-solutions/emergency-kit`,
      icon: "🚨",
      priority: "high",
      iconColor: "red",
      anchorTextType: "view_guide",
    },
    {
      id: "office",
      title: recT("scenarioSolutions.office.title"),
      description: recT("scenarioSolutions.office.description"),
      href: `/${locale}/scenario-solutions/office`,
      icon: "💼",
      priority: "medium",
      iconColor: "blue",
      anchorTextType: "view_solution",
    },
    {
      id: "teen-health",
      title: recT("scenarioSolutions.teenHealth.title"),
      description: recT("scenarioSolutions.teenHealth.description"),
      href: `/${locale}/teen-health`,
      icon: "👧",
      priority: "medium",
      iconColor: "pink",
      anchorTextType: "view_zone",
    },
  ];

  return { relatedArticles, relatedTools, scenarioSolutions };
};

function SymptomAssessmentContent({ locale }: { locale: string }) {
  const t = useTranslations("interactiveTools");
  const breadcrumbT = useTranslations("interactiveTools.breadcrumb");
  const recT = useTranslations("interactiveTools.symptomAssessment");
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<string>("simplified");

  // 使用 useEffect 确保客户端和服务器端一致
  useEffect(() => {
    const modeParam = searchParams.get("mode");
    setMode(modeParam || "simplified");
  }, [searchParams]);

  // 评估模式配置（用于顶部三张模式卡片）
  const modeCards = [
    {
      id: "simplified",
      icon: "⚡",
      title: t("symptomAssessment.modes.simplified"),
      description:
        locale === "zh"
          ? "快速三问简化评估，适合需要先大致了解症状严重程度的用户。"
          : "Quick 3‑question assessment for a fast overview of your symptom severity.",
    },
    {
      id: "detailed",
      icon: "📋",
      title: t("symptomAssessment.modes.detailed"),
      description:
        locale === "zh"
          ? "包含更多维度的详细评估，帮助你系统梳理症状模式与影响。"
          : "More in‑depth multi‑dimension assessment to understand patterns and impact.",
    },
    {
      id: "medical",
      icon: "👩‍⚕️",
      title: t("symptomAssessment.modes.medical"),
      description:
        locale === "zh"
          ? "面向医疗专业视角的进阶评估，综合症状与职场影响。"
          : "Advanced assessment designed for a more medical, workplace‑aware perspective.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 text-neutral-800 font-sans">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 面包屑导航：放在主标题上方，紧接导航栏下方 */}
          <Breadcrumb
            items={[
              {
                label: breadcrumbT("interactiveTools"),
                href: `/${locale}/interactive-tools`,
              },
              { label: breadcrumbT("symptomAssessment") },
            ]}
          />

          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t("symptomAssessment.title")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("symptomAssessment.description")}
            </p>
            {/* 显示当前评估模式 */}
            <div className="mt-4">
              <span className="inline-block bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-sm font-medium">
                {mode === "simplified" &&
                  t("symptomAssessment.modes.simplified")}
                {mode === "detailed" && t("symptomAssessment.modes.detailed")}
                {mode === "medical" && t("symptomAssessment.modes.medical")}
              </span>
            </div>
          </div>

          {/* 评估模式选择卡片（简化版 / 详细版 / 医疗专业版） */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">
              {locale === "zh" ? "选择评估模式" : "Choose Your Assessment Mode"}
            </h2>
            <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
              {locale === "zh"
                ? "你可以先用简化版快速了解整体情况，再根据需要切换到详细版或医疗专业版做更深入的评估。"
                : "You can start with the simplified mode for a quick overview, then switch to detailed or medical modes for deeper insights if needed."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {modeCards.map((card) => (
                <Link
                  key={card.id}
                  href={`/${locale}/interactive-tools/symptom-assessment?mode=${card.id}`}
                  className={`flex flex-col h-full p-6 rounded-xl border-2 transition-all duration-200 ${
                    mode === card.id
                      ? "border-violet-500 bg-violet-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-violet-300 hover:shadow-sm"
                  }`}
                >
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {card.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* 症状评估工具 */}
          <SymptomAssessmentTool locale={locale} mode={mode} />

          {/* 返回按钮 - 页面底部 */}
          <div className="mt-8 flex justify-center">
            <Link
              href={`/${locale}/interactive-tools`}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-300"
            >
              ← {t("sections.back")}
            </Link>
          </div>
        </div>
      </div>

      {/* 相关推荐区域 */}
      <div className="bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-12">
            {/* 推荐文章区域 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {t("sections.relatedArticles")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getSymptomAssessmentRecommendations(
                  locale,
                  recT,
                ).relatedArticles.map((article) => (
                  <RelatedArticleCard
                    key={article.id}
                    article={article}
                    locale={locale}
                  />
                ))}
              </div>
            </section>

            {/* 相关工具区域 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {t("sections.relatedTools")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getSymptomAssessmentRecommendations(
                  locale,
                  recT,
                ).relatedTools.map((tool) => (
                  <RelatedToolCard key={tool.id} tool={tool} locale={locale} />
                ))}
              </div>
            </section>

            {/* 场景解决方案区域 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {t("sections.scenarioSolutions")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getSymptomAssessmentRecommendations(
                  locale,
                  recT,
                ).scenarioSolutions.map((solution) => (
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
    </div>
  );
}

export default function SymptomAssessmentClient({ params: { locale } }: Props) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 text-neutral-800 font-sans">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SymptomAssessmentContent locale={locale} />
    </Suspense>
  );
}
