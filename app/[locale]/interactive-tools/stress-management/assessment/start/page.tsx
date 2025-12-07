"use client";

import { useState, useEffect, Suspense } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { PHQ9Result } from "@/lib/phq9-types";

// 动态导入重型组件以优化性能
const PHQ9Assessment = dynamic(
  () =>
    import("@/components/PHQ9Assessment").then((mod) => ({
      default: mod.PHQ9Assessment,
    })),
  {
    loading: () => (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    ),
    ssr: false,
  },
);

const PHQ9Results = dynamic(
  () =>
    import("@/components/PHQ9Assessment").then((mod) => ({
      default: mod.PHQ9Results,
    })),
  {
    loading: () => (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    ),
    ssr: false,
  },
);

const StressRadarChart = dynamic(
  () =>
    import("@/components/StressRadarChart").then((mod) => ({
      default: mod.StressRadarChart,
    })),
  {
    loading: () => (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    ),
    ssr: false,
  },
);
// LocalStorageManager removed - using localStorage directly
import {
  useABTestTracking,
  trackAssessmentStart,
  trackAssessmentComplete,
  trackPHQ9Start,
  trackPHQ9Complete,
  trackPaywallView,
  trackPaywallClick,
  trackRadarChartInteraction,
  trackRecommendationClick,
  generateAnonymousUserId,
} from "@/lib/ab-test-tracking";
// Dynamically import feedback components
const UserFeedback = dynamic(
  () =>
    import("@/components/UserFeedback").then((mod) => ({
      default: mod.UserFeedback,
    })),
  {
    loading: () => (
      <div className="flex justify-center items-center p-4">
        <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
      </div>
    ),
  },
);

export default function StressAssessmentStartPage() {
  const t = useTranslations("interactiveTools.stressManagement");
  const params = useParams();
  const locale = params.locale as string;

  // Day 4 增强：A/B测试数据收集
  const [userId] = useState(() => generateAnonymousUserId());
  useABTestTracking(userId);

  // 评估状态
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPHQ9, setShowPHQ9] = useState(false);
  const [showPHQ9Results, setShowPHQ9Results] = useState(false);
  const [phq9Result, setPhq9Result] = useState<PHQ9Result | null>(null);
  const [stressScore, setStressScore] = useState(0);

  // Day 4: 追踪评估开始
  useEffect(() => {
    trackAssessmentStart(userId, "stress_assessment");
  }, [userId]);

  const FREE_QUESTIONS = 5; // 免费问题数量（Day 3增强：从3题提升到5题）

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    // Day 3增强：第5题后显示付费墙（原第3题）
    if (currentQuestion === FREE_QUESTIONS - 1) {
      setShowPaywall(true);
    } else if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        setShowResults(true);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowPaywall(false);
    }
  };

  const handleUnlockPremium = () => {
    // 模拟付费解锁（实际支付接口待开通）
    alert(t("alerts.paymentComingSoon"));
    setShowPaywall(false);
    // 免费用户也可以继续，但显示降级内容
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSkipPaywall = () => {
    // 免费用户：只显示基础结果
    const score = calculateScore();
    const { level } = getStressLevel(score);

    // Day 4: 追踪付费墙交互
    trackPaywallClick(userId, "skip");

    // Save assessment to localStorage
    try {
      const assessmentData = {
        answers,
        score,
        stressLevel: level,
        isPremium: false,
        timestamp: Date.now(),
      };
      const existing = localStorage.getItem("stress_assessments");
      const assessments = existing ? JSON.parse(existing) : [];
      assessments.push(assessmentData);
      localStorage.setItem("stress_assessments", JSON.stringify(assessments));
    } catch {
      // Failed to save assessment to localStorage
    }

    setStressScore(score);
    setShowResults(true);
  };

  // 动态生成问题列表，使用翻译键
  const questions = [
    {
      id: "q1",
      questionKey: "assessment.q1.question",
      optionKeys: [
        "assessment.q1.option1",
        "assessment.q1.option2",
        "assessment.q1.option3",
        "assessment.q1.option4",
      ],
    },
    {
      id: "q2",
      questionKey: "assessment.q2.question",
      optionKeys: [
        "assessment.q2.option1",
        "assessment.q2.option2",
        "assessment.q2.option3",
        "assessment.q2.option4",
      ],
    },
    {
      id: "q3",
      questionKey: "assessment.q3.question",
      optionKeys: [
        "assessment.q3.option1",
        "assessment.q3.option2",
        "assessment.q3.option3",
        "assessment.q3.option4",
      ],
    },
    {
      id: "q4",
      questionKey: "assessment.q4.question",
      optionKeys: [
        "assessment.q4.option1",
        "assessment.q4.option2",
        "assessment.q4.option3",
        "assessment.q4.option4",
      ],
    },
    {
      id: "q5",
      questionKey: "assessment.q5.question",
      optionKeys: [
        "assessment.q5.option1",
        "assessment.q5.option2",
        "assessment.q5.option3",
        "assessment.q5.option4",
      ],
    },
  ];

  // PHQ-9 相关处理函数
  const handleStartPHQ9 = () => {
    // Day 4: 追踪PHQ-9评估开始
    trackPHQ9Start(userId);

    setShowResults(false);
    setShowPHQ9(true);
  };

  const handlePHQ9Complete = (result: PHQ9Result) => {
    // Day 4: 追踪PHQ-9评估完成
    trackPHQ9Complete(userId, result.totalScore, result.severity);

    setPhq9Result(result);

    // Note: PHQ-9 results are handled by the PHQ9Assessment component

    setShowPHQ9(false);
    setShowPHQ9Results(true);
  };

  const handlePHQ9Previous = () => {
    setShowPHQ9(false);
    setShowResults(true);
  };

  const handleRestartAll = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setShowPaywall(false);
    setShowPHQ9(false);
    setShowPHQ9Results(false);
    setPhq9Result(null);
    setStressScore(0);
  };

  // Day 4: 追踪评估完成
  useEffect(() => {
    if (showResults && stressScore > 0) {
      // Calculate duration (simplified - in real app, track start time)
      const duration = 0; // Duration in seconds
      trackAssessmentComplete(
        userId,
        "stress_assessment",
        stressScore,
        duration,
      );
    }
  }, [showResults, stressScore, userId]);

  // Day 4: 追踪付费墙查看
  useEffect(() => {
    if (showPaywall) {
      trackPaywallView(userId);
    }
  }, [showPaywall, userId]);

  const calculateScore = () => {
    const validAnswers = answers.filter((a) => a !== undefined);
    if (validAnswers.length === 0) return 0;
    const total = validAnswers.reduce((sum, answer) => sum + answer, 0);
    return Math.round((total / (validAnswers.length * 3)) * 100);
  };

  const getStressLevel = (score: number) => {
    if (score < 25) return { level: "low", color: "green" };
    if (score < 50) return { level: "moderate", color: "yellow" };
    if (score < 75) return { level: "high", color: "orange" };
    return { level: "severe", color: "red" };
  };

  // 将评估答案转换为雷达图数据
  const convertAnswersToRadarData = (answers: number[]) => {
    return {
      work: answers[0] || 0,
      sleep: answers[2] || 0,
      emotion: answers[3] || 0,
      physical: answers[4] || 0,
      social: answers[1] || 0,
    };
  };

  // Day 3增强：个性化建议生成
  const getPersonalizedRecommendations = (answers: number[]) => {
    const recommendations = [];
    const avgScore =
      answers.reduce((sum, answer) => sum + answer, 0) / answers.length;

    // Recommendations based on overall stress level
    if (avgScore <= 1) {
      recommendations.push(
        {
          emoji: "🌟",
          title: t("assessment.personalizedRecommendations.low.maintain.title"),
          description: t(
            "assessment.personalizedRecommendations.low.maintain.description",
          ),
        },
        {
          emoji: "📊",
          title: t("assessment.personalizedRecommendations.low.monitor.title"),
          description: t(
            "assessment.personalizedRecommendations.low.monitor.description",
          ),
        },
        {
          emoji: "💪",
          title: t("assessment.personalizedRecommendations.low.enhance.title"),
          description: t(
            "assessment.personalizedRecommendations.low.enhance.description",
          ),
        },
      );
    } else if (avgScore <= 2) {
      recommendations.push(
        {
          emoji: "🧘",
          title: t(
            "assessment.personalizedRecommendations.moderate.relax.title",
          ),
          description: t(
            "assessment.personalizedRecommendations.moderate.relax.description",
          ),
        },
        {
          emoji: "😴",
          title: t(
            "assessment.personalizedRecommendations.moderate.sleep.title",
          ),
          description: t(
            "assessment.personalizedRecommendations.moderate.sleep.description",
          ),
        },
        {
          emoji: "🏃",
          title: t(
            "assessment.personalizedRecommendations.moderate.exercise.title",
          ),
          description: t(
            "assessment.personalizedRecommendations.moderate.exercise.description",
          ),
        },
      );
    } else {
      recommendations.push(
        {
          emoji: "🆘",
          title: t("assessment.personalizedRecommendations.high.help.title"),
          description: t(
            "assessment.personalizedRecommendations.high.help.description",
          ),
        },
        {
          emoji: "👥",
          title: t("assessment.personalizedRecommendations.high.support.title"),
          description: t(
            "assessment.personalizedRecommendations.high.support.description",
          ),
        },
        {
          emoji: "🏥",
          title: t("assessment.personalizedRecommendations.high.health.title"),
          description: t(
            "assessment.personalizedRecommendations.high.health.description",
          ),
        },
      );
    }

    return recommendations;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  // PHQ-9 评估页面
  if (showPHQ9) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <nav className="text-sm text-neutral-600 mb-8">
            <Link href={`/${locale}`} className="hover:text-primary-600">
              {t("common.breadcrumb.home")}
            </Link>
            <span className="mx-2">›</span>
            <Link
              href={`/${locale}/interactive-tools`}
              className="hover:text-primary-600"
            >
              {t("common.breadcrumb.interactiveTools")}
            </Link>
            <span className="mx-2">›</span>
            <Link
              href={`/${locale}/interactive-tools/stress-management`}
              className="hover:text-primary-600"
            >
              {t("title")}
            </Link>
            <span className="mx-2">›</span>
            <Link
              href={`/${locale}/interactive-tools/stress-management/assessment/start`}
              className="hover:text-primary-600"
            >
              {t("assessment.title")}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-neutral-800">{t("results.resultLabel")}</span>
          </nav>

          <Suspense
            fallback={
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            }
          >
            <PHQ9Assessment
              onComplete={handlePHQ9Complete}
              onPrevious={handlePHQ9Previous}
            />
          </Suspense>
        </div>
      </div>
    );
  }

  // PHQ-9 结果页面
  if (showPHQ9Results && phq9Result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Suspense
            fallback={
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            }
          >
            <PHQ9Results
              result={phq9Result}
              onRestart={handleRestartAll}
              onContinue={() => {
                window.location.href = `/${locale}/interactive-tools/stress-management`;
              }}
            />
          </Suspense>
        </div>
      </div>
    );
  }

  // Stress assessment results page
  if (showResults) {
    const score = calculateScore();
    const { level, color } = getStressLevel(score);
    const isBasicResult = answers.length <= FREE_QUESTIONS;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* 面包屑 */}
          <nav className="text-sm text-neutral-600 mb-8">
            <Link href={`/${locale}`} className="hover:text-primary-600">
              {t("common.breadcrumb.home")}
            </Link>
            <span className="mx-2">›</span>
            <Link
              href={`/${locale}/interactive-tools`}
              className="hover:text-primary-600"
            >
              {t("common.breadcrumb.interactiveTools")}
            </Link>
            <span className="mx-2">›</span>
            <Link
              href={`/${locale}/interactive-tools/stress-management`}
              className="hover:text-primary-600"
            >
              {t("title")}
            </Link>
            <span className="mx-2">›</span>
            <Link
              href={`/${locale}/interactive-tools/stress-management/assessment/start`}
              className="hover:text-primary-600"
            >
              {t("assessment.title")}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-neutral-800">{t("results.resultLabel")}</span>
          </nav>

          {/* 结果卡片 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {t("results.title")}
              </h1>
              <p className="text-gray-600">{t("results.subtitle")}</p>
            </div>

            {/* 压力评分 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 mb-2">
                  {score}
                </div>
                <div className="text-lg text-gray-700 mb-4">
                  {t("results.scoreLabel")}
                </div>
                <div
                  className={`inline-block px-6 py-2 rounded-full text-white font-semibold bg-${color}-500`}
                >
                  {t(`results.stressLevels.${level}`)}
                </div>
              </div>
            </div>

            {/* Day 3增强：雷达图可视化 */}
            <div className="mb-6">
              <Suspense
                fallback={
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                }
              >
                <StressRadarChart
                  scores={convertAnswersToRadarData(answers)}
                  className="border-2 border-blue-200"
                  onInteraction={(type, data) => {
                    // Day 4: 追踪雷达图交互
                    trackRadarChartInteraction(userId, type, data);
                  }}
                />
              </Suspense>
            </div>

            {/* 基础建议 */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {t("results.basicRecommendations")}
              </h3>
              <div className="space-y-3">
                {getPersonalizedRecommendations(answers).map(
                  (recommendation, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => {
                        // Day 4: 追踪建议点击
                        trackRecommendationClick(
                          userId,
                          String(index),
                          recommendation.title,
                        );
                      }}
                    >
                      <span className="text-2xl">{recommendation.emoji}</span>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {recommendation.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {recommendation.description}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* 付费解锁提示 */}
            {isBasicResult && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🔒</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      {t("paywall.unlock.title")}
                    </h3>
                    <p className="text-purple-100 mb-4">
                      {t("paywall.unlock.description")}
                    </p>
                    <button
                      onClick={handleUnlockPremium}
                      className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                    >
                      {t("paywall.unlock.button")} ¥29.9
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 完整报告内容（付费用户） */}
            {!isBasicResult && (
              <div className="space-y-6">
                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {t("results.detailedAnalysis")}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {t("results.stressSources")}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t("results.stressSourcesDescription")}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {t("results.improvementFocus")}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t("results.improvementFocusDescription")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {t("ui.personalizedRecommendations")}
                  </h3>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                      >
                        <span className="text-xl">✓</span>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-1">
                            {t("ui.recommendationItem").replace(
                              "{index}",
                              i.toString(),
                            )}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {t("ui.recommendationCustom")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PHQ-9 继续评估选项 */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white mb-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🧠</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    {t("phq9.assessmentPrompt.title")}
                  </h3>
                  <p className="text-purple-100 mb-4">
                    {t("phq9.assessmentPrompt.description")}
                  </p>
                  <button
                    onClick={handleStartPHQ9}
                    className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                  >
                    {t("phq9.assessmentPrompt.button")}
                  </button>
                </div>
              </div>
            </div>

            {/* Day 4: 用户反馈收集 */}
            <div className="mt-6">
              <Suspense
                fallback={
                  <div className="flex justify-center items-center p-4">
                    <div className="animate-pulse bg-gray-200 h-8 w-full rounded"></div>
                  </div>
                }
              >
                <UserFeedback
                  userId={userId}
                  feature={t("assessment.title")}
                  page="stress_assessment_results"
                />
              </Suspense>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleRestartAll}
                className="flex-1 btn-secondary py-3"
              >
                {t("buttons.restartAssessment")}
              </button>
              <Link
                href={`/${locale}/interactive-tools/stress-management`}
                className="flex-1 btn-primary py-3 text-center"
              >
                {t("buttons.backToHome")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 付费墙
  if (showPaywall) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t("paywall.title")}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {t("paywall.subtitle")}
              </p>
            </div>

            {/* 付费功能对比 */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 border-2 border-gray-200 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {t("paywall.comparison.free.title")}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✓</span>
                    {t("paywall.comparison.free.features.questions")}
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✓</span>
                    {t("paywall.comparison.free.features.score")}
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✓</span>
                    {t("paywall.comparison.free.features.radar")}
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✓</span>
                    {t("paywall.comparison.free.features.recommendations")}
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <span className="text-gray-300">✗</span>
                    {t("paywall.comparison.free.features.analysis")}
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <span className="text-gray-300">✗</span>
                    {t("paywall.comparison.free.features.personalized")}
                  </li>
                </ul>
              </div>

              <div className="p-6 border-2 border-orange-500 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {t("paywall.comparison.premium.title")}
                  </h3>
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {t("paywall.comparison.premium.badge")}
                  </span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-orange-500">✓</span>
                    {t("paywall.comparison.premium.features.report")}
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-orange-500">✓</span>
                    {t("paywall.comparison.premium.features.phq9")}
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-orange-500">✓</span>
                    {t("paywall.comparison.premium.features.management")}
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-orange-500">✓</span>
                    {t("paywall.comparison.premium.features.insights")}
                  </li>
                </ul>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {t("paywall.comparison.premium.badge")}
                  </div>
                  <p className="text-sm text-gray-600">
                    {t("paywall.description")}
                  </p>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <button
                onClick={handleSkipPaywall}
                className="flex-1 btn-secondary py-3"
              >
                {t("buttons.viewFreeResults")}
              </button>
              <button
                onClick={handleUnlockPremium}
                className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                {t("buttons.comingSoon")}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
              {t("ui.thanksMessage")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 评估问卷
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 面包屑 */}
        <nav className="text-sm text-neutral-600 mb-8">
          <Link href={`/${locale}`} className="hover:text-primary-600">
            {t("common.breadcrumb.home")}
          </Link>
          <span className="mx-2">›</span>
          <Link
            href={`/${locale}/interactive-tools`}
            className="hover:text-primary-600"
          >
            {t("common.breadcrumb.interactiveTools")}
          </Link>
          <span className="mx-2">›</span>
          <Link
            href={`/${locale}/interactive-tools/stress-management`}
            className="hover:text-primary-600"
          >
            {t("title")}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-neutral-800">{t("results.resultLabel")}</span>
        </nav>

        {/* 隐私声明 - 仅在第一题显示 */}
        {currentQuestion === 0 && <PrivacyNotice />}

        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              {t("ui.questionProgress")
                .replace("{current}", (currentQuestion + 1).toString())
                .replace("{total}", questions.length.toString())}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {currentQuestion >= FREE_QUESTIONS && (
            <p className="text-xs text-purple-600 mt-1 font-semibold">
              {t("ui.advancedQuestion")}
            </p>
          )}
        </div>

        {/* 问题卡片 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
              <span className="text-2xl font-bold text-white">
                {currentQuestion + 1}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t(questions[currentQuestion].questionKey)}
            </h2>
            <p className="text-gray-600">{t("assessment.selectOption")}</p>
          </div>

          {/* 选项 */}
          <div className="space-y-3">
            {questions[currentQuestion].optionKeys.map((optionKey, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  answers[currentQuestion] === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion] === index
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {answers[currentQuestion] === index && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-800 font-medium">
                    {t(optionKey)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 导航按钮 */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← {t("previous")}
          </button>
          <Link
            href={`/${locale}/interactive-tools/stress-management/assessment`}
            className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            {t("backToTools")}
          </Link>
        </div>

        {/* 提示信息 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            💡 <strong>{t("common.tip")}:</strong>
            {currentQuestion < FREE_QUESTIONS
              ? `${t("common.freeQuestions")} ${FREE_QUESTIONS} ${t(
                  "common.questionsAvailable",
                )}`
              : t("common.advancedAssessment")}
          </p>
        </div>
      </div>
    </div>
  );
}
