"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSafeTranslations } from "@/hooks/useSafeTranslations";
import {
  usePartnerHandbookStore,
  useStageActions,
} from "../stores/partnerHandbookStore";
import { Locale } from "../types/common";
import { QuizResult, QuizStage } from "../types/quiz";
import Breadcrumb from "@/components/Breadcrumb";
import { logInfo } from "@/lib/debug-logger";

// 动态导入相关组件 - 代码分割优化
const RelatedToolCard = dynamic(
  () => import("@/app/[locale]/interactive-tools/components/RelatedToolCard"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
    ),
  },
);

const RelatedArticleCard = dynamic(
  () =>
    import("@/app/[locale]/interactive-tools/components/RelatedArticleCard"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
    ),
  },
);

const ScenarioSolutionCard = dynamic(
  () =>
    import("@/app/[locale]/interactive-tools/components/ScenarioSolutionCard"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
    ),
  },
);

// 动态导入图标 - 按需加载
const ArrowLeft = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.ArrowLeft })),
  { ssr: false },
);
const AlertTriangle = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.AlertTriangle })),
  { ssr: false },
);

// 动态导入组件以优化性能
const PartnerUnderstandingQuiz = dynamic(
  () => import("./PartnerUnderstandingQuiz"),
  {
    loading: () => (
      <div className="quiz-container">
        <div className="loading-skeleton h-96 rounded-lg"></div>
      </div>
    ),
    ssr: false,
  },
);

const TrainingCampDisplay = dynamic(() => import("./TrainingCampDisplay"), {
  loading: () => (
    <div className="quiz-container">
      <div className="loading-skeleton h-96 rounded-lg"></div>
    </div>
  ),
  ssr: false,
});

const ResultsDisplay = dynamic(() => import("./ResultsDisplay"), {
  loading: () => (
    <div className="results-container">
      <div className="loading-skeleton h-96 rounded-lg"></div>
    </div>
  ),
  ssr: false,
});

const TrainingCampSchedule = dynamic(() => import("./TrainingCampSchedule"), {
  loading: () => (
    <div className="training-camp-container">
      <div className="loading-skeleton h-96 rounded-lg"></div>
    </div>
  ),
  ssr: false,
});

interface PartnerHandbookClientProps {
  locale: Locale;
}

type AppState = "intro" | "quiz" | "results" | "training";

export default function PartnerHandbookClient({
  locale,
}: PartnerHandbookClientProps) {
  const { t } = useSafeTranslations("partnerHandbook");
  const {
    currentLanguage,
    currentStage,
    setCurrentStage,
    completeStage,
    resetAllStages,
    stageProgress,
    isStageUnlocked,
    initializeMissingStages,
  } = usePartnerHandbookStore();

  // 从stageProgress中获取当前阶段的quizResult
  const quizResult = stageProgress[currentStage]?.result;

  const stageActions = useStageActions();
  const { clearAllTestData } = stageActions;

  const [currentState, setCurrentState] = useState<AppState>("intro");
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // 推荐数据配置
  const recommendations = React.useMemo(() => {
    const isZh = locale === "zh";

    return {
      relatedTools: [
        {
          id: "symptom-assessment",
          title: isZh ? "症状评估工具" : "Symptom Assessment",
          description: isZh
            ? "帮助伴侣了解痛经严重程度，提供针对性支持建议"
            : "Help partners understand pain severity and provide targeted support advice",
          href: `/${locale}/interactive-tools/symptom-assessment`,
          icon: "🔍",
          priority: "high",
          anchorTextType: "symptom_assessment",
        },
        {
          id: "pain-tracker",
          title: isZh ? "痛经追踪器" : "Pain Tracker",
          description: isZh
            ? "记录痛经模式，帮助伴侣理解疼痛规律和触发因素"
            : "Track pain patterns, help partners understand pain patterns and triggers",
          href: `/${locale}/interactive-tools/pain-tracker`,
          icon: "📊",
          priority: "high",
          anchorTextType: "pain_tracker",
        },
        {
          id: "period-pain-impact-calculator",
          title: isZh ? "痛经影响计算器" : "Pain Impact Calculator",
          description: isZh
            ? "评估痛经对生活的影响，让伴侣了解实际困扰"
            : "Assess period pain life impact, help partners understand real struggles",
          href: `/${locale}/interactive-tools/period-pain-impact-calculator`,
          icon: "🧮",
          priority: "high",
          anchorTextType: "calculator",
        },
      ],
      relatedArticles: [
        {
          id: "comprehensive-medical-guide-to-dysmenorrhea",
          title: isZh ? "痛经医疗综合指南" : "Medical Guide to Dysmenorrhea",
          description: isZh
            ? "帮助伴侣从医学角度理解痛经，提供科学支持"
            : "Help partners understand dysmenorrhea from medical perspective, provide scientific support",
          href: `/${locale}/articles/comprehensive-medical-guide-to-dysmenorrhea`,
          readTime: isZh ? "18分钟阅读" : "18 min read",
          category: isZh ? "医疗指南" : "Medical Guide",
          priority: "high",
          icon: "📋",
          anchorTextType: "medical_guide",
        },
        {
          id: "when-to-seek-medical-care-comprehensive-guide",
          title: isZh ? "何时就医完整指南" : "When to Seek Medical Care",
          description: isZh
            ? "识别需要就医的警示信号，伴侣可提供及时提醒"
            : "Identify warning signs requiring medical care, partners can provide timely reminders",
          href: `/${locale}/articles/when-to-seek-medical-care-comprehensive-guide`,
          readTime: isZh ? "15分钟阅读" : "15 min read",
          category: isZh ? "医疗指导" : "Medical Care",
          priority: "high",
          icon: "🏥",
          anchorTextType: "medical",
        },
        {
          id: "medication-guide",
          title: isZh ? "痛经用药指南" : "Medication Guide for Period Pain",
          description: isZh
            ? "了解安全用药知识，伴侣可协助用药管理"
            : "Understand safe medication knowledge, partners can assist medication management",
          href: `/${locale}/downloads/medication-guide`,
          readTime: isZh ? "12分钟阅读" : "12 min read",
          category: isZh ? "用药指导" : "Medication",
          priority: "medium",
          icon: "💊",
          anchorTextType: "medication",
        },
      ],
      scenarioSolutions: [
        {
          id: "social",
          title: isZh ? "社交场景管理" : "Social Scenario Management",
          description: isZh
            ? "学习在社交场合如何支持伴侣应对痛经不适"
            : "Learn how to support partner dealing with period pain in social settings",
          href: `/${locale}/scenario-solutions/social`,
          icon: "💃",
          priority: "high",
          anchorTextType: "social",
        },
        {
          id: "lifeStages",
          title: isZh ? "人生阶段管理" : "Life Stages Management",
          description: isZh
            ? "了解不同年龄段的经期需求和伴侣支持策略"
            : "Understand period needs across ages and partner support strategies",
          href: `/${locale}/scenario-solutions/lifeStages`,
          icon: "❤️",
          priority: "high",
          anchorTextType: "lifeStages",
        },
        {
          id: "office",
          title: isZh
            ? "办公环境健康管理"
            : "Office Environment Health Management",
          description: isZh
            ? "了解职场女性的经期挑战，提供工作日支持"
            : "Understand workplace women's period challenges, provide weekday support",
          href: `/${locale}/scenario-solutions/office`,
          icon: "💼",
          priority: "medium",
          anchorTextType: "office",
        },
      ],
    };
  }, [locale]);

  const isZh = locale === "zh";

  // 使用useCallback稳定函数引用
  const stableInitializeMissingStages = useCallback(() => {
    initializeMissingStages();
  }, [initializeMissingStages]);

  // 客户端检测和阶段初始化
  useEffect(() => {
    setIsClient(true);
    // 初始化缺失的阶段
    stableInitializeMissingStages();
  }, [stableInitializeMissingStages]);

  // 同步语言设置
  useEffect(() => {
    if (currentLanguage !== locale) {
      usePartnerHandbookStore.getState().setLanguage(locale);
    }
  }, [locale, currentLanguage]);

  // 安全的阶段解锁检查，避免Hydration错误
  const isStageUnlockedSafe = (
    stage: "stage2" | "stage3" | "stage4",
  ): boolean => {
    if (!isClient) {
      // 服务器端渲染时，默认返回false（锁定状态）
      return false;
    }
    return isStageUnlocked(stage);
  };

  // 检查各阶段测试是否完成
  const isStage1Completed = stageProgress.stage1?.status === "completed";
  const isStage2Completed = stageProgress.stage2?.status === "completed";

  // 初始化缺失的阶段
  React.useEffect(() => {
    const initializeStages = () => {
      const stages: QuizStage[] = ["stage1", "stage2", "stage3", "stage4"];
      let needsInitialization = false;

      stages.forEach((stage) => {
        if (!stageProgress[stage]) {
          needsInitialization = true;
        }
      });

      if (needsInitialization) {
        logInfo(
          "🔧 Initializing missing stages...",
          undefined,
          "PartnerHandbookClient",
        );
        stageActions.initializeMissingStages();
      }
    };

    initializeStages();
  }, [stageProgress, stageActions]);

  // 测试结果现在直接显示在页面上，不需要状态切换

  const handleStartQuiz = () => {
    // 滚动到测试区域
    const quizSection = document.getElementById("quiz-section");
    if (quizSection) {
      quizSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleQuizComplete = (result: QuizResult) => {
    completeStage("stage1", result);
    // 保持在intro状态，测试结果会直接显示在页面上
  };

  const handleStartTraining = () => {
    setIsLoading(true);
    setCurrentState("training");
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleRetakeQuiz = () => {
    resetAllStages();
    // 重置后，测试组件会重新显示
    // 不需要改变currentState，因为测试组件会根据isStage1Completed状态显示
  };

  const handleClearAllData = () => {
    if (
      confirm(
        locale === "zh"
          ? "确定要清除所有测试数据吗？这将重置所有进度。"
          : "Are you sure you want to clear all test data? This will reset all progress.",
      )
    ) {
      clearAllTestData();
      // 刷新页面以确保状态完全重置
      window.location.reload();
    }
  };

  const handleBackToIntro = () => {
    setCurrentState("intro");
  };

  const handleDayComplete = (dayId: string) => {
    usePartnerHandbookStore.getState().completeTraining(dayId);
  };

  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12"
      data-page="partner-communication-scenario"
    >
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            label: locale === "zh" ? "场景解决方案" : "Scenario Solutions",
            href: `/${locale}/scenario-solutions`,
          },
          { label: locale === "zh" ? "伴侣沟通" : "Partner Communication" },
        ]}
      />

      {/* 页面头部 */}
      <header className="text-center py-8 md:py-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          {t("pageTitle")}
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 max-w-3xl mx-auto px-4">
          {t("pageDescription")}
        </p>
      </header>

      {/* 主要内容区域 */}
      <main>
        {currentState === "intro" && (
          <div className="max-w-4xl mx-auto">
            {/* 介绍区域 */}
            <section className="bg-gradient-to-br from-primary-50 to-neutral-50 p-4 sm:p-6 md:p-8 rounded-xl mb-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800 mb-3 sm:mb-4">
                  {t("introTitle")}
                </h2>
                <p className="text-neutral-700 leading-relaxed text-sm sm:text-base">
                  {t("introDescription")}
                </p>
              </div>
            </section>

            {/* 4个阶段功能卡片 - 配置化设计 */}
            <section className="py-8 sm:py-10 md:py-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  {t("fourStagesTitle")}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {t("fourStagesDescription")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {/* 第一阶段：理解度测试 */}
                <button
                  onClick={handleStartQuiz}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary-200 group cursor-pointer hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <div className="w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center rounded-full bg-purple-50 text-purple-600 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-6 sm:w-8 h-6 sm:h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-neutral-800 mb-2 sm:mb-3 group-hover:text-primary-700 transition-colors">
                    {t("quiz.stages.stage1.title")}
                  </h3>
                  <p className="text-neutral-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                    {t("quiz.stages.stage1.description")}
                  </p>
                  <div className="text-xs text-gray-500 mb-3">
                    {t("quiz.stages.stage1.timeLimit")} •{" "}
                    {t("quiz.stages.stage1.difficulty")}
                  </div>
                  <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700 transition-colors text-sm sm:text-base">
                    <span className="mr-2">
                      {t("quiz.stages.stage1.buttonText")}
                    </span>
                    <svg
                      className="w-3 sm:w-4 h-3 sm:h-4 group-hover:translate-x-1 transition-transform"
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
                </button>

                {/* 第二阶段：专业深度测试 */}
                <button
                  onClick={() => {
                    if (isStageUnlockedSafe("stage2")) {
                      setCurrentStage("stage2");
                      setCurrentState("quiz");
                    }
                  }}
                  className={`rounded-xl p-4 sm:p-6 shadow-md transition-all duration-300 border group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    isStageUnlockedSafe("stage2")
                      ? "bg-white hover:shadow-lg hover:border-primary-200 hover:scale-105"
                      : "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                  }`}
                  disabled={!isStageUnlockedSafe("stage2")}
                >
                  <div
                    className={`w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center rounded-full mb-4 sm:mb-6 transition-transform duration-300 ${
                      isStageUnlockedSafe("stage2")
                        ? "bg-blue-50 text-blue-600 group-hover:scale-110"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <svg
                      className="w-6 sm:w-8 h-6 sm:h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3
                    className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-3 transition-colors ${
                      isStageUnlockedSafe("stage2")
                        ? "text-neutral-800 group-hover:text-primary-700"
                        : "text-gray-500"
                    }`}
                  >
                    {t("quiz.stages.stage2.title")}
                  </h3>
                  <p
                    className={`mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base ${
                      isStageUnlockedSafe("stage2")
                        ? "text-neutral-600"
                        : "text-gray-400"
                    }`}
                  >
                    {t("quiz.stages.stage2.description")}
                  </p>
                  <div
                    className={`text-xs mb-3 ${
                      isStageUnlockedSafe("stage2")
                        ? "text-gray-500"
                        : "text-gray-400"
                    }`}
                  >
                    {t("quiz.stages.stage2.timeLimit")} •{" "}
                    {t("quiz.stages.stage2.difficulty")}
                  </div>
                  <div
                    className={`font-medium text-sm sm:text-base ${
                      isStageUnlockedSafe("stage2")
                        ? "text-primary-600 group-hover:text-primary-700"
                        : "text-gray-400"
                    }`}
                  >
                    {isStageUnlockedSafe("stage2")
                      ? t("quiz.stages.stage2.buttonText")
                      : t("quiz.stages.stage2.unlockCondition")}
                  </div>
                </button>

                {/* 第三阶段：30天训练营 */}
                <button
                  onClick={() => {
                    if (isStageUnlockedSafe("stage3")) {
                      setCurrentState("training");
                    }
                  }}
                  className={`rounded-xl p-4 sm:p-6 shadow-md transition-all duration-300 border group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    isStageUnlockedSafe("stage3")
                      ? "bg-white hover:shadow-lg hover:border-primary-200 hover:scale-105"
                      : "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                  }`}
                  disabled={!isStageUnlockedSafe("stage3")}
                >
                  <div
                    className={`w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center rounded-full mb-4 sm:mb-6 transition-transform duration-300 ${
                      isStageUnlockedSafe("stage3")
                        ? "bg-pink-50 text-pink-600 group-hover:scale-110"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <svg
                      className="w-6 sm:w-8 h-6 sm:h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3
                    className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-3 transition-colors ${
                      isStageUnlockedSafe("stage3")
                        ? "text-neutral-800 group-hover:text-primary-700"
                        : "text-gray-500"
                    }`}
                  >
                    {t("quiz.stages.stage3.title")}
                  </h3>
                  <p
                    className={`mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base ${
                      isStageUnlockedSafe("stage3")
                        ? "text-neutral-600"
                        : "text-gray-400"
                    }`}
                  >
                    {t("quiz.stages.stage3.description")}
                  </p>
                  <div
                    className={`text-xs mb-3 ${
                      isStageUnlockedSafe("stage3")
                        ? "text-gray-500"
                        : "text-gray-400"
                    }`}
                  >
                    {t("quiz.stages.stage3.timeLimit")} •{" "}
                    {t("quiz.stages.stage3.difficulty")}
                  </div>
                  <div
                    className={`font-medium text-sm sm:text-base ${
                      isStageUnlockedSafe("stage3")
                        ? "text-primary-600 group-hover:text-primary-700"
                        : "text-gray-400"
                    }`}
                  >
                    {isStageUnlockedSafe("stage3")
                      ? t("quiz.stages.stage3.buttonText")
                      : t("quiz.stages.stage3.unlockCondition")}
                  </div>
                </button>

                {/* 第四阶段：个性化指导 */}
                <button
                  onClick={() => {
                    if (isStageUnlockedSafe("stage4")) {
                      // TODO: 实现个性化指导页面
                      logInfo(
                        "进入个性化指导",
                        undefined,
                        "PartnerHandbookClient",
                      );
                    }
                  }}
                  className={`rounded-xl p-4 sm:p-6 shadow-md transition-all duration-300 border group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    isStageUnlockedSafe("stage4")
                      ? "bg-white hover:shadow-lg hover:border-primary-200 hover:scale-105"
                      : "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                  }`}
                  disabled={!isStageUnlockedSafe("stage4")}
                >
                  <div
                    className={`w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center rounded-full mb-4 sm:mb-6 transition-transform duration-300 ${
                      isStageUnlockedSafe("stage4")
                        ? "bg-green-50 text-green-600 group-hover:scale-110"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <svg
                      className="w-6 sm:w-8 h-6 sm:h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3
                    className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-3 transition-colors ${
                      isStageUnlockedSafe("stage4")
                        ? "text-neutral-800 group-hover:text-primary-700"
                        : "text-gray-500"
                    }`}
                  >
                    {t("quiz.stages.stage4.title")}
                  </h3>
                  <p
                    className={`mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base ${
                      isStageUnlockedSafe("stage4")
                        ? "text-neutral-600"
                        : "text-gray-400"
                    }`}
                  >
                    {t("quiz.stages.stage4.description")}
                  </p>
                  <div
                    className={`text-xs mb-3 ${
                      isStageUnlockedSafe("stage4")
                        ? "text-gray-500"
                        : "text-gray-400"
                    }`}
                  >
                    {t("quiz.stages.stage4.timeLimit")} •{" "}
                    {t("quiz.stages.stage4.difficulty")}
                  </div>
                  <div
                    className={`font-medium text-sm sm:text-base ${
                      isStageUnlockedSafe("stage4")
                        ? "text-primary-600 group-hover:text-primary-700"
                        : "text-gray-400"
                    }`}
                  >
                    {isStageUnlockedSafe("stage4")
                      ? t("quiz.stages.stage4.buttonText")
                      : t("quiz.stages.stage4.unlockCondition")}
                  </div>
                </button>
              </div>
            </section>

            {/* 理解度测试 - 直接显示 */}
            <section id="quiz-section" className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  {t("stageTitles.stage1")}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {locale === "zh"
                    ? "通过5道基础题目，了解你对痛经的认知水平，获得个性化建议"
                    : "Understand your knowledge level through 5 basic questions and get personalized recommendations"}
                </p>
              </div>

              {!isStage1Completed || !stageProgress.stage1?.result ? (
                <PartnerUnderstandingQuiz
                  locale={locale}
                  stage="stage1"
                  onQuizComplete={handleQuizComplete}
                />
              ) : (
                <ResultsDisplay
                  result={stageProgress.stage1.result}
                  locale={locale}
                  stage="stage1"
                  onStartTraining={handleStartTraining}
                  onRetakeQuiz={handleRetakeQuiz}
                />
              )}
            </section>

            {/* 专业深度测试 - 直接显示 */}
            <section id="stage2-section" className="mb-16">
              {!isStage2Completed || !stageProgress.stage2?.result ? (
                <PartnerUnderstandingQuiz
                  locale={locale}
                  stage="stage2"
                  onQuizComplete={handleQuizComplete}
                />
              ) : (
                <ResultsDisplay
                  result={stageProgress.stage2.result}
                  locale={locale}
                  stage="stage2"
                  onStartTraining={handleStartTraining}
                  onRetakeQuiz={handleRetakeQuiz}
                />
              )}
            </section>

            {/* 30天训练营 - 直接显示 */}
            <section id="stage3-section" className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  {t("stageTitles.stage3")}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {locale === "zh"
                    ? "每天5分钟，循序渐进成为暖心伴侣"
                    : "5 minutes a day, progressively become a warm-hearted partner"}
                </p>
              </div>

              {/* 直接显示训练营内容 */}
              <TrainingCampDisplay locale={locale} />
            </section>

            {/* 相关推荐区域 */}
            <section className="bg-gradient-to-br from-pink-50 to-blue-50 mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="space-y-12">
                  {/* 相关工具区域 */}
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      {isZh ? "相关工具" : "Related Tools"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {recommendations.relatedTools.map((tool) => (
                        <RelatedToolCard
                          key={tool.id}
                          tool={tool}
                          locale={locale}
                        />
                      ))}
                    </div>
                  </section>

                  {/* 相关文章区域 */}
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      {isZh ? "相关文章" : "Related Articles"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {recommendations.relatedArticles.map((article) => (
                        <RelatedArticleCard
                          key={article.id}
                          article={article}
                          locale={locale}
                        />
                      ))}
                    </div>
                  </section>

                  {/* 场景解决方案区域 */}
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      {isZh ? "场景解决方案" : "Scenario Solutions"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {recommendations.scenarioSolutions.map((solution) => (
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
            </section>

            {/* 返回场景解决方案总览 */}
            <div className="text-center mt-12">
              <Link
                href={`/${locale}/scenario-solutions`}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {isZh ? "返回场景解决方案总览" : "Back to Scenario Solutions"}
              </Link>
            </div>

            {/* Medical Disclaimer - 移到返回按钮下方 */}
            <section className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg mt-8 mb-8">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-orange-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-orange-800 mb-2">
                    {t("disclaimer")}
                  </h3>
                  <p className="text-orange-700 text-sm leading-relaxed">
                    {t("disclaimerContent")}
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentState === "quiz" && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={handleBackToIntro}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {t("backToHome")}
              </button>
            </div>
            <PartnerUnderstandingQuiz
              locale={locale}
              stage={currentStage}
              onQuizComplete={handleQuizComplete}
            />
          </div>
        )}

        {currentState === "results" && quizResult && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={handleBackToIntro}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {t("backToHome")}
              </button>
            </div>
            <ResultsDisplay
              result={quizResult}
              locale={locale}
              stage={quizResult.stage || "stage1"}
              onStartTraining={handleStartTraining}
              onRetakeQuiz={handleRetakeQuiz}
            />
          </div>
        )}

        {currentState === "training" && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <button
                onClick={handleBackToIntro}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {t("backToHome")}
              </button>
            </div>
            <TrainingCampSchedule
              locale={locale}
              onDayComplete={handleDayComplete}
            />
          </div>
        )}
      </main>

      {/* 开发调试工具 */}
      {process.env.NODE_ENV === "development" && (
        <section className="bg-yellow-50 p-4 sm:p-6 md:p-8 rounded-xl border border-yellow-200 mt-8">
          <h3 className="text-base sm:text-lg font-semibold text-yellow-800 mb-3 sm:mb-4">
            {locale === "zh" ? "开发调试工具" : "Development Debug Tools"}
          </h3>
          <div className="space-y-3">
            <p className="text-yellow-700 text-xs sm:text-sm">
              {locale === "zh"
                ? "如果您发现测试结果没有变化，可能是因为浏览器缓存了之前的测试数据。点击下面的按钮可以清除所有测试数据并重新开始。"
                : "If you notice that test results are not changing, it might be because the browser cached previous test data. Click the button below to clear all test data and start fresh."}
            </p>
            <button
              onClick={handleClearAllData}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
            >
              {locale === "zh" ? "清除所有测试数据" : "Clear All Test Data"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
