/**
 * 营养推荐生成器 - 主组件
 * 基于ziV1d3d的NutritionApp类进行Next.js集成
 */

"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import type { Language } from "../types";
import {
  generateRecommendations,
  type ZIV1D3DRecommendationResult,
} from "../utils/recommendationEngine";
import { getUIContent } from "../utils/uiContent";
import { PerformanceMonitor, debounce } from "../utils/performance";

type SelectionState = {
  menstrualPhase: string | null;
  healthGoals: Set<string>;
  holisticHealthConstitution: Set<string>;
};

type SelectionUpdate = Partial<SelectionState>;

// 动态导入组件 - 代码分割优化
const NutritionApp = dynamic(() => import("./NutritionApp"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
});

const ResultsDisplay = dynamic(() => import("./ResultsDisplay"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
});

const LoadingState = dynamic(() => import("./LoadingState"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />,
});

const NoSelectionState = dynamic(() => import("./NoSelectionState"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />,
});

const ErrorBoundary = dynamic(() => import("./ErrorBoundary"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />,
});

const AccessibilityWrapper = dynamic(() => import("./AccessibilityWrapper"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />,
});

import "../styles/nutrition-generator.css";

export default function NutritionGenerator() {
  const performanceMonitor = PerformanceMonitor.getInstance();
  const locale = useLocale() as Language; // 从URL获取当前语言
  const [selections, setSelections] = useState<SelectionState>({
    menstrualPhase: null as string | null,
    healthGoals: new Set<string>(),
    holisticHealthConstitution: new Set<string>(),
  });
  const [results, setResults] = useState<ZIV1D3DRecommendationResult | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // 客户端渲染检查 - 修复hydration错误
  useEffect(() => {
    setIsClient(true);
    performanceMonitor.startMeasure("nutrition-generator-init");
    return () => {
      performanceMonitor.endMeasure("nutrition-generator-init");
    };
  }, [performanceMonitor]);

  // 语言切换已移除，现在使用URL路由进行语言切换

  // 基于ziV1d3d的防抖选择更新
  const debouncedSelectionsChange = debounce(
    (newSelections: SelectionUpdate) => {
      setSelections((prev) => ({
        ...prev,
        ...newSelections,
      }));
      // 清除之前的结果
      setResults(null);
      setError(null);
    },
    100,
  );

  const handleSelectionsChange = (newSelections: SelectionUpdate) => {
    debouncedSelectionsChange(newSelections);
  };

  // 生成推荐 - 基于ziV1d3d的handleGenerate方法
  const handleGenerate = async () => {
    // 基于ziV1d3d的性能监控
    performanceMonitor.startMeasure("generate-recommendations");

    // 检查是否有选择
    const hasSelection =
      selections.menstrualPhase !== null ||
      selections.healthGoals.size > 0 ||
      selections.holisticHealthConstitution.size > 0;

    if (!hasSelection) {
      setError(getUIContent("noSelection", locale));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 使用ziV1d3d的推荐引擎逻辑
      const recommendationResults = generateRecommendations(selections, locale);
      setResults(recommendationResults);

      // 基于ziV1d3d的滚动到结果功能
      if (recommendationResults) {
        setTimeout(() => {
          const resultsContainer = document.getElementById("results-container");
          if (resultsContainer) {
            resultsContainer.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成推荐时发生错误");
    } finally {
      setIsLoading(false);
      performanceMonitor.endMeasure("generate-recommendations");
    }
  };

  // 防止hydration错误，只在客户端渲染
  if (!isClient) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AccessibilityWrapper
        role="main"
        ariaLabel="Nutrition Recommendation Generator"
        ariaDescribedBy="nutrition-generator-description"
      >
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
          {/* 头部 - 基于ziV1d3d的header结构 */}
          <header className="mb-8 md:mb-12">
            <div className="text-center">
              <h1
                id="main-title"
                className="text-3xl md:text-4xl font-bold text-primary-500 mb-4"
              >
                {getUIContent("mainTitle", locale)}
              </h1>
              <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                {locale === "zh"
                  ? "基于月经周期、健康目标和整体健康体质的个性化营养建议生成器，提供科学专业的饮食指导，结合现代营养学与整体健康理论，为女性提供精准的营养建议和生活方式指导，帮助优化生理期健康管理"
                  : "Personalized nutrition recommendations for your menstrual cycle, health goals, Holistic Health body pattern. Scientific guidance combining modern and Holistic Health principles."}
              </p>
            </div>
          </header>

          {/* 主要内容 - 基于ziV1d3d的main结构 */}
          <main>
            {/* 选择容器 - 基于ziV1d3d的selection-container */}
            <section className="space-y-8">
              <NutritionApp
                language={locale}
                selections={selections}
                onSelectionsChange={handleSelectionsChange}
              />
            </section>

            {/* 生成按钮 - 基于ziV1d3d的generate-btn */}
            <div className="mt-10 text-center">
              <button
                id="generate-btn"
                onClick={handleGenerate}
                disabled={isLoading}
                className="bg-primary-500 text-white font-bold py-3 px-8 rounded-full hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-500/50 flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <span id="generate-btn-text">
                  {isLoading
                    ? locale === "zh"
                      ? "正在生成..."
                      : "Generating..."
                    : getUIContent("generateBtn", locale)}
                </span>
              </button>
            </div>

            {/* 结果容器 - 基于ziV1d3d的results-container */}
            <section id="results-container" className="mt-12">
              {isLoading ? (
                <LoadingState language={locale} />
              ) : results ? (
                <ResultsDisplay results={results} language={locale} />
              ) : (
                <NoSelectionState language={locale} />
              )}
            </section>
          </main>

          {/* 错误提示 */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {locale === "zh" ? "发生错误" : "Error Occurred"}
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </AccessibilityWrapper>
    </ErrorBoundary>
  );
}
