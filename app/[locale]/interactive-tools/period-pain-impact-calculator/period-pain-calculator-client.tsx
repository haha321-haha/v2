"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { usePainImpactCalculator } from "./hooks/usePainImpactCalculator";
import QuestionRenderer from "./components/QuestionRenderer";
import AssessmentResults from "./components/AssessmentResults";
import RecommendedContent from "./components/RecommendedContent";
import { AssessmentAnswer } from "./types";

// 动态导入 Breadcrumb 组件以避免 vendor chunks 问题
const Breadcrumb = dynamic(() => import("@/components/Breadcrumb"), {
  ssr: true,
  loading: () => <div className="mb-6 h-6 animate-pulse bg-gray-200 rounded" />,
});

interface PeriodPainCalculatorClientProps {
  params: { locale: string };
}

export default function PeriodPainCalculatorClient({
  params,
}: PeriodPainCalculatorClientProps) {
  const router = useRouter();
  const currentLocale = params.locale as "en" | "zh";
  const t = useTranslations("periodPainImpactCalculator");
  const breadcrumbT = useTranslations("interactiveTools.breadcrumb");

  const {
    currentSession,
    currentQuestionIndex,
    currentQuestion,
    progress,
    totalQuestions,
    startAssessment,
    answerQuestion,
    goToPreviousQuestion,
    goToNextQuestion,
    completeAssessment,
    resetAssessment,
    result,
    isLoading,
    error,
  } = usePainImpactCalculator();

  // 处理问题回答
  const handleAnswer = (answer: AssessmentAnswer) => {
    answerQuestion(answer);
  };

  // 完成评估
  const handleCompleteAssessment = () => {
    completeAssessment();
  };

  // 重新开始
  const handleReset = () => {
    resetAssessment();
  };

  // 返回工具列表
  const handleBack = () => {
    router.push(`/${currentLocale}/interactive-tools`);
  };

  // 如果评估完成，显示结果页面
  // 检查 result 或 currentSession 的 completedAt 来确定是否完成
  const isAssessmentComplete =
    result || (currentSession?.completedAt && currentSession?.result);

  // 如果没有会话，自动创建会话并显示第一题（更直观的UX）
  useEffect(() => {
    if (!currentSession && !isAssessmentComplete) {
      startAssessment(currentLocale);
    }
  }, [currentSession, isAssessmentComplete, startAssessment, currentLocale]); // 包含所有依赖项

  // 如果没有会话且评估未完成，显示加载状态（自动创建会话中）
  if (!currentSession && !isAssessmentComplete) {
    return (
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 lg:p-16 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isAssessmentComplete && result) {
    return (
      <AssessmentResults
        result={result}
        locale={currentLocale}
        onReset={handleReset}
      />
    );
  }

  // 显示评估问题
  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-5xl mx-auto">
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            {
              label: breadcrumbT("interactiveTools"),
              href: `/${currentLocale}/interactive-tools`,
            },
            { label: t("breadcrumbCurrent") },
          ]}
        />

        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 lg:p-16">
          {/* 进度条 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium text-gray-900">
                {t("progressTitle")}
              </h2>
              <span className="text-sm text-gray-600">
                {currentSession?.answers.length || 0} / {totalQuestions}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-900 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 问题区域 */}
          <div className="min-h-[300px]">
            {currentQuestion && (
              <QuestionRenderer
                question={currentQuestion}
                answer={currentSession.answers.find(
                  (a) => a.questionId === currentQuestion.id,
                )}
                onAnswer={handleAnswer}
              />
            )}
          </div>

          {/* 错误信息 */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-800">{error}</div>
            </div>
          )}

          {/* 导航按钮 */}
          <div className="flex justify-between mt-8">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-3 font-semibold rounded-lg shadow-md transition duration-300 ${
                currentQuestionIndex === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t("previousButton")}
            </button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                onClick={goToNextQuestion}
                className="px-6 py-3 bg-purple-900 text-white font-semibold rounded-lg shadow-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-900 focus:ring-offset-2 transition duration-300"
              >
                {t("nextButton")}
              </button>
            ) : (
              <button
                onClick={handleCompleteAssessment}
                disabled={isLoading}
                className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? t("loadingButton") : t("completeButton")}
              </button>
            )}
          </div>

          {/* 返回按钮 */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleBack}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-300"
            >
              ← {t("backButton")}
            </button>
          </div>
        </div>
      </div>

      {/* 评估进行中的推荐内容 - 提升SEO和用户体验 */}
      <RecommendedContent locale={currentLocale} severity={undefined} />
    </main>
  );
}
