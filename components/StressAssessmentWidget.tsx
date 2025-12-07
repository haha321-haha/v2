"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { PrivacyNotice } from "./PrivacyNotice";
import {
  trackAssessmentStart,
  trackAssessmentComplete,
  // generateAnonymousUserId, // Reserved for future analytics
} from "@/lib/ab-test-tracking";
import BreathingExercise from "./BreathingExercise";
// 确保全局升级处理函数可用
import "@/lib/pro-upgrade-handler";

// Phase 2: 导入 store hooks
import {
  useWorkplaceWellnessActions,
  useWorkplaceWellnessStore,
} from "@/app/[locale]/interactive-tools/workplace-wellness/hooks/useWorkplaceWellnessStore";
import PaywallModal from "@/components/monetization/PaywallModal";

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

export default function StressAssessmentWidget() {
  const t = useTranslations("interactiveTools.stressManagement");
  const ui = useTranslations("ui");

  // Phase 2: 使用 store hooks 替代 localStorage
  const { addAssessmentResult, migrateAssessmentsFromLocalStorage } =
    useWorkplaceWellnessActions();
  const { assessmentHistory } = useWorkplaceWellnessStore();

  // Reserved for future analytics: const [userId] = useState(() => generateAnonymousUserId());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [stressScore, setStressScore] = useState(0);
  const [stressLevel, setStressLevel] = useState("");
  const [startTime] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return Date.now();
    }
    return 0;
  });
  const [showSOS, setShowSOS] = useState(false);
  const [primaryPainPoint, setPrimaryPainPoint] = useState<
    "work" | "emotion" | "pain" | "default"
  >("default");

  // Phase 2: 数据迁移 - 在组件挂载时执行一次
  useEffect(() => {
    if (assessmentHistory.totalAssessments === 0) {
      migrateAssessmentsFromLocalStorage();
    }
  }, [assessmentHistory.totalAssessments, migrateAssessmentsFromLocalStorage]);

  const FREE_QUESTIONS = 5; // 免费问题数量

  useEffect(() => {
    trackAssessmentStart("stress_assessment", "stress_assessment");
  }, []);

  // 确保全局支付函数在客户端可用（移到状态定义之后）
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 确保 pro-upgrade-handler 已加载
      import("@/lib/pro-upgrade-handler")
        .then(() => {
          console.log("✅ 支付处理函数已加载");
        })
        .catch((err) => {
          console.error("❌ 支付处理函数加载失败:", err);
        });
    }
  }, []); // 只在组件挂载时执行一次

  const questions = [
    // 免费问题 (1-5) - Work & Focus related
    {
      id: "q1",
      questionKey: "assessment.q1.question",
      optionKeys: [
        "assessment.q1.option1",
        "assessment.q1.option2",
        "assessment.q1.option3",
        "assessment.q1.option4",
      ],
      category: "work",
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
      category: "work",
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
      category: "work",
    },
    // Emotion related
    {
      id: "q4",
      questionKey: "assessment.q4.question",
      optionKeys: [
        "assessment.q4.option1",
        "assessment.q4.option2",
        "assessment.q4.option3",
        "assessment.q4.option4",
      ],
      category: "emotion",
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
      category: "emotion",
    },
    // 付费问题 (6-10) - Emotion & Pain related
    {
      id: "q6",
      questionKey: "assessment.q6.question",
      optionKeys: [
        "assessment.q6.option1",
        "assessment.q6.option2",
        "assessment.q6.option3",
        "assessment.q6.option4",
      ],
      category: "emotion",
    },
    {
      id: "q7",
      questionKey: "assessment.q7.question",
      optionKeys: [
        "assessment.q7.option1",
        "assessment.q7.option2",
        "assessment.q7.option3",
        "assessment.q7.option4",
      ],
      category: "pain",
    },
    {
      id: "q8",
      questionKey: "assessment.q8.question",
      optionKeys: [
        "assessment.q8.option1",
        "assessment.q8.option2",
        "assessment.q8.option3",
        "assessment.q8.option4",
      ],
      category: "pain",
    },
    {
      id: "q9",
      questionKey: "assessment.q9.question",
      optionKeys: [
        "assessment.q9.option1",
        "assessment.q9.option2",
        "assessment.q9.option3",
        "assessment.q9.option4",
      ],
      category: "pain",
    },
    {
      id: "q10",
      questionKey: "assessment.q10.question",
      optionKeys: [
        "assessment.q10.option1",
        "assessment.q10.option2",
        "assessment.q10.option3",
        "assessment.q10.option4",
      ],
      category: "pain",
    },
  ];

  const calculatePrimaryPainPoint = (
    currentAnswers: number[],
  ): "work" | "emotion" | "pain" | "default" => {
    let workScore = 0;
    let emotionScore = 0;
    let painScore = 0;

    currentAnswers.forEach((answer, index) => {
      if (answer === undefined) return;
      // Assuming higher answer index = higher severity (0-3)
      const score = answer;
      const category = questions[index].category;

      if (category === "work") workScore += score;
      else if (category === "emotion") emotionScore += score;
      else if (category === "pain") painScore += score;
    });

    // Normalize scores based on number of questions per category
    // Work: 3 questions, Emotion: 3 questions, Pain: 4 questions
    const normalizedWork = workScore / 3;
    const normalizedEmotion = emotionScore / 3;
    const normalizedPain = painScore / 4;

    if (normalizedWork >= normalizedEmotion && normalizedWork >= normalizedPain)
      return "work";
    if (
      normalizedEmotion >= normalizedWork &&
      normalizedEmotion >= normalizedPain
    )
      return "emotion";
    if (normalizedPain >= normalizedWork && normalizedPain >= normalizedEmotion)
      return "pain";
    return "default";
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    // 第5题（索引4）后显示付费墙
    if (currentQuestion === FREE_QUESTIONS - 1) {
      // 延迟一点让用户看到答案被选中，然后显示付费墙
      setTimeout(() => {
        const painPoint = calculatePrimaryPainPoint(newAnswers);
        setPrimaryPainPoint(painPoint);
        setShowPaywall(true);
      }, 300);
    } else if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        const score = calculateScore(newAnswers);
        const { level } = getStressLevel(score);
        const painPoint = calculatePrimaryPainPoint(newAnswers);
        setPrimaryPainPoint(painPoint);

        // Phase 2: Save assessment to store
        try {
          const assessmentRecord = {
            id: `assessment_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
            answers: newAnswers,
            stressScore: score,
            stressLevel: level,
            primaryPainPoint: painPoint as
              | "work"
              | "emotion"
              | "pain"
              | "default",
            isPremium: newAnswers.length > FREE_QUESTIONS,
            timestamp: Date.now(),
            completedAt: new Date().toISOString(),
          };

          addAssessmentResult(assessmentRecord);
          console.log("✅ 评估结果已保存到 store:", assessmentRecord);
        } catch (error) {
          console.error("❌ 评估结果保存失败:", error);
        }

        setStressScore(score);
        setStressLevel(level);
        setShowResults(true);
        // 计算持续时间（秒），使用开始时间或默认值
        const duration = Math.round(
          (Date.now() - (startTime || Date.now())) / 1000,
        );
        trackAssessmentComplete(
          "stress_assessment",
          "stress_assessment",
          score,
          duration,
        );
      }, 300);
    }
  };

  const handleUnlockPremium = async (
    planOrEvent?: string | React.MouseEvent<HTMLButtonElement>,
  ) => {
    const plan = typeof planOrEvent === "string" ? planOrEvent : "oneTime";
    const e = typeof planOrEvent === "object" ? planOrEvent : undefined;
    // 防止重复点击
    const isProcessing =
      (window as { __paymentProcessing?: boolean }).__paymentProcessing ||
      false;
    if (isProcessing) {
      console.log("⏳ 支付流程正在进行中，请稍候...");
      e?.preventDefault();
      return;
    }

    // 设置处理标记
    (window as { __paymentProcessing?: boolean }).__paymentProcessing = true;

    try {
      console.log("🔓 === 开始支付流程 ===");
      console.log("事件对象:", e);
      console.log("按钮元素:", e?.currentTarget);

      // 计算当前压力评分
      const currentAnswers = [...answers];
      const score = calculateScore(currentAnswers);

      console.log("📊 计算得分:", score);
      console.log("📋 当前答案:", currentAnswers);

      // 检查环境
      const hasWindow = typeof window !== "undefined";
      const hasHandleProUpgrade = hasWindow && !!window.handleProUpgrade;
      const locale =
        hasWindow && window.location.pathname.includes("/zh") ? "zh" : "en";

      console.log("🌍 环境检查:", {
        hasWindow,
        hasHandleProUpgrade,
        locale,
        plan: "oneTime",
      });

      // 构建请求数据
      const requestData = {
        plan: plan,
        painPoint: "stress_management_assessment",
        assessmentScore: score,
      };

      console.log("📤 支付请求数据:", requestData);

      // 直接调用API（更可靠）
      const response = await fetch("/api/lemonsqueezy/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log("📡 API响应状态:", response.status, response.statusText);

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorText: string;

        if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          errorText = errorData.error || JSON.stringify(errorData);
        } else {
          errorText = await response.text();
          // 如果返回的是 HTML，提供更友好的错误信息
          if (errorText.includes("<!DOCTYPE")) {
            errorText = `服务器返回了错误页面 (${response.status})。请检查 API 配置。`;
          }
        }

        console.error("❌ API错误响应:", {
          status: response.status,
          statusText: response.statusText,
          contentType,
          errorText: errorText.substring(0, 500), // 限制错误信息长度
        });
        throw new Error(
          `支付API错误: ${response.status} - ${errorText.substring(0, 200)}`,
        );
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const textData = await response.text();
        throw new Error(
          `API返回了非JSON响应: ${contentType}. 响应: ${textData.substring(
            0,
            200,
          )}`,
        );
      }

      const data = await response.json();
      console.log("📦 API响应数据:", data);

      if (!data.url) {
        console.error("❌ 响应缺少支付URL:", data);
        throw new Error("支付URL未返回");
      }

      console.log("✅ 跳转到支付页面:", data.url);

      // 关闭paywall并跳转
      setShowPaywall(false);
      window.location.href = data.url;
    } catch (error: unknown) {
      console.error("❌ === 支付流程失败 ===");
      const errorMessage =
        error instanceof Error ? error.message : "支付初始化失败，请稍后重试";
      console.error("错误消息:", errorMessage);
      if (error instanceof Error) {
        console.error("错误堆栈:", error.stack);
      }

      // 显示用户友好的错误信息
      alert(`支付失败: ${errorMessage}`);

      // 备用方案：跳转到定价页面
      console.log("🔄 使用备用方案：跳转到定价页面");
      const locale =
        typeof window !== "undefined" &&
        window.location.pathname.includes("/zh")
          ? "zh"
          : "en";
      window.location.href = `/${locale}/pricing`;
    } finally {
      // 清除处理标记
      (window as { __paymentProcessing?: boolean }).__paymentProcessing = false;
    }
  };

  const handleSkipPaywall = () => {
    // 获取当前所有的答案，包括最新的
    const currentAnswers = [...answers];
    // 确保answers数组有效，至少有5个答案
    if (!currentAnswers || currentAnswers.length < FREE_QUESTIONS) {
      return;
    }

    const score = calculateScore(currentAnswers);
    const { level } = getStressLevel(score);

    // Phase 2: Save assessment to store
    try {
      const assessmentRecord = {
        id: `assessment_free_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
        answers: currentAnswers,
        stressScore: score,
        stressLevel: level,
        primaryPainPoint: "default" as const, // Free assessment doesn't calculate pain point
        isPremium: false,
        timestamp: Date.now(),
        completedAt: new Date().toISOString(),
      };

      addAssessmentResult(assessmentRecord);
      console.log("✅ 免费评估结果已保存到 store:", assessmentRecord);
    } catch (error) {
      console.error("❌ 免费评估结果保存失败:", error);
    }

    // 先隐藏 paywall，然后显示结果
    setShowPaywall(false);
    setStressScore(score);
    setStressLevel(level);
    setShowResults(true);

    // 追踪评估完成
    const duration = Math.round(
      (Date.now() - (startTime || Date.now())) / 1000,
    );
    trackAssessmentComplete(
      "stress_assessment",
      "stress_assessment",
      score,
      duration,
    );
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowPaywall(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setShowPaywall(false);
    setStressScore(0);
    setStressLevel("");
  };

  const handleUnlockFromResults = () => {
    // 从结果页面打开付费墙
    const painPoint = calculatePrimaryPainPoint(answers);
    setPrimaryPainPoint(painPoint);
    setShowResults(false);
    setShowPaywall(true);
  };

  const calculateScore = (answersArray: number[]) => {
    const validAnswers = answersArray.filter((a) => a !== undefined);
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

  const convertAnswersToRadarData = (answers: number[]) => {
    // 简单的映射逻辑，实际项目可能需要更复杂的计算
    // 假设前3题是工作压力，中间3题是情绪压力，后4题是身体压力
    // 归一化到 0-100

    // Work: Q1-Q3
    const workScore =
      (answers.slice(0, 3).reduce((a, b) => a + (b || 0), 0) / 9) * 100;

    // Emotion: Q4-Q6
    const emotionScore =
      (answers.slice(3, 6).reduce((a, b) => a + (b || 0), 0) / 9) * 100;

    // Physical: Q7-Q10
    const physicalScore =
      (answers.slice(6, 10).reduce((a, b) => a + (b || 0), 0) / 12) * 100;

    // 计算sleep和social分数（基于answers）
    const sleepScore = answers.length > 6 ? (answers[6] || 0) * 33.33 : 0;
    const socialScore = answers.length > 7 ? (answers[7] || 0) * 33.33 : 0;

    // 归一化到 0-3 范围（StressRadarChart 期望的格式）
    return {
      work: Math.min(3, Math.round(workScore / 33.33)),
      sleep: Math.min(3, Math.round(sleepScore / 33.33)),
      emotion: Math.min(3, Math.round(emotionScore / 33.33)),
      physical: Math.min(3, Math.round(physicalScore / 33.33)),
      social: Math.min(3, Math.round(socialScore / 33.33)),
    };
  };

  const getPersonalizedRecommendations = (answers: number[]) => {
    // 简单的推荐逻辑
    const recommendations = [];
    const avgScore = calculateScore(answers) / 25; // 0-4 scale roughly

    if (avgScore <= 1) {
      recommendations.push(
        {
          emoji: "🌟",
          title: t("results.recommendations.low.maintain.title"),
          description: t("results.recommendations.low.maintain.description"),
        },
        {
          emoji: "📝",
          title: t("results.recommendations.low.track.title"),
          description: t("results.recommendations.low.track.description"),
        },
      );
    } else if (avgScore <= 2) {
      recommendations.push(
        {
          emoji: "🧘",
          title: t("results.recommendations.moderate.relax.title"),
          description: t("results.recommendations.moderate.relax.description"),
        },
        {
          emoji: "😴",
          title: t("results.recommendations.moderate.sleep.title"),
          description: t("results.recommendations.moderate.sleep.description"),
        },
      );
    } else {
      recommendations.push(
        {
          emoji: "🆘",
          title: t("results.recommendations.high.help.title"),
          description: t("results.recommendations.high.help.description"),
        },
        {
          emoji: "👥",
          title: t("results.recommendations.high.support.title"),
          description: t("results.recommendations.high.support.description"),
        },
      );
    }

    return recommendations;
  };

  const getPersonalizedActionSteps = (answers: number[]) => {
    const steps = [
      {
        title: "Establish Sleep Routine",
        description:
          "Go to bed and wake up at consistent times. Create a relaxing bedtime routine to improve sleep quality.",
      },
      {
        title: "Practice Stress Relief Techniques",
        description:
          "Try deep breathing exercises, meditation, or gentle yoga for 10-15 minutes daily to manage stress.",
      },
      {
        title: "Improve Work-Life Balance",
        description:
          "Set clear boundaries between work and personal time. Take regular breaks during work hours.",
      },
      {
        title: "Build Emotional Support Network",
        description:
          "Connect with friends, family, or support groups. Consider talking to a mental health professional if needed.",
      },
    ];

    // 根据用户的具体问题调整建议
    if (answers.length > 1 && answers[1] >= 2) {
      // 睡眠问题
      steps[0].description =
        "Focus on improving sleep hygiene - avoid screens 1 hour before bed, keep bedroom cool and dark.";
    }

    if (answers.length > 0 && answers[0] >= 2) {
      // 工作压力问题
      steps[2].description =
        "Break large tasks into smaller ones, delegate when possible, and practice saying no to additional responsibilities.";
    }

    if (answers.length > 3 && answers[3] >= 2) {
      // 情绪问题
      steps[1].description =
        "Practice mindfulness and emotional regulation techniques. Consider journaling your feelings.";
    }

    if (answers.length > 4 && answers[4] >= 2) {
      // 社交压力
      steps[3].description =
        "Join support groups or community activities that align with your interests and values.";
    }

    return steps;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  // 只有回答了超过免费问题数量（即6个或更多）才被认为是付费用户
  const isPremiumUser = answers.length > FREE_QUESTIONS;

  //  // 渲染主要内容（提取为函数以避免重复代码）
  const renderMainContent = () => {
    // SOS Modal
    if (showSOS) {
      return (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative">
            <button
              onClick={() => setShowSOS(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-center text-blue-800 mb-2">
                {t("sos.modalTitle")}
              </h3>
              <p className="text-center text-gray-600 mb-6">
                {t("sos.modalSubtitle")}
              </p>
              <BreathingExercise locale="en" />
            </div>
          </div>
        </div>
      );
    }

    // Paywall view
    if (showPaywall) {
      return (
        <PaywallModal
          painPoint={primaryPainPoint === "default" ? "work" : primaryPainPoint} // Fallback to work if default, or handle default in PaywallModal
          assessmentScore={calculateScore(answers)}
          onClose={handleSkipPaywall}
          onUpgrade={handleUnlockPremium}
        />
      );
    }

    // Results view
    if (showResults) {
      const { color } = getStressLevel(stressScore);

      return (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {t("results.title")}
            </h2>
            <p className="text-gray-600">{t("results.subtitle")}</p>
          </div>

          {/* Score Display */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {stressScore}
              </div>
              <div className="text-lg text-gray-700 mb-4">
                {t("results.score")}
              </div>
              <div
                className={`inline-block px-6 py-2 rounded-full text-white font-semibold bg-${color}-500`}
              >
                {t(`results.stressLevels.${stressLevel}`)}
              </div>
            </div>
          </div>

          {/* Radar Chart */}
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
              />
            </Suspense>
          </div>

          {/* Recommendations */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {t("results.basicRecommendations")}
            </h3>
            <div className="space-y-3">
              {getPersonalizedRecommendations(answers).map(
                (recommendation, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg"
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

          {/* 付费解锁提示 - 仅免费用户显示 */}
          {!isPremiumUser && (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white mb-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🔒</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    {t(`results.dynamicPromise.${primaryPainPoint}`)}
                  </h3>
                  <p className="text-purple-100 mb-4">
                    {t("results.unlockCompleteReport.description")}
                  </p>
                  <button
                    onClick={handleUnlockFromResults}
                    className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                  >
                    {t("results.unlockCompleteReport.button")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 完整报告内容（付费用户） */}
          {isPremiumUser && (
            <div className="space-y-6 mb-6">
              <div className="border-t pt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {t("results.detailedAnalysis.title")}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {t("results.detailedAnalysis.stressAnalysis.title")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t("results.detailedAnalysis.stressAnalysis.description")}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {t("results.detailedAnalysis.improvementFocus.title")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t(
                        "results.detailedAnalysis.improvementFocus.description",
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {t("results.personalizedActionPlan.title")}
                </h3>
                <div className="space-y-3">
                  {getPersonalizedActionSteps(answers).map((step, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <span className="text-xl">✓</span>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isPremiumUser && (
              <button
                onClick={handleUnlockFromResults}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                {t("results.unlockCompleteReport.button")}
              </button>
            )}
            <button onClick={handleRestart} className="btn-secondary px-8 py-3">
              {t("buttons.restartAssessment")}
            </button>
          </div>
        </div>
      );
    }

    // Assessment view
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 relative">
        {/* SOS Button */}
        <button
          onClick={() => setShowSOS(true)}
          className="absolute top-8 right-8 text-red-500 hover:text-red-600 font-semibold flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full border border-red-200 transition-colors"
        >
          <span className="text-lg">🆘</span>
          <span className="text-sm">{t("sos.button")}</span>
        </button>

        {/* Privacy Notice - only on first question */}
        {currentQuestion === 0 && (
          <div className="mb-6">
            <PrivacyNotice />
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              {ui("questionProgress", {
                current: currentQuestion + 1,
                total: questions.length,
              })}
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
              {ui("premiumQuestion")}
            </p>
          )}
        </div>

        {/* Question */}
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

        {/* Options */}
        <div className="space-y-3 mb-8">
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

        {/* Navigation */}
        {currentQuestion > 0 && (
          <div className="text-center">
            <button
              onClick={handlePrevious}
              className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              ← {t("previous")}
            </button>
          </div>
        )}
      </div>
    );
  };

  // 开发环境调试按钮
  if (process.env.NODE_ENV === "development") {
    return (
      <>
        {renderMainContent()}

        {/* 调试面板 */}
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg z-[10001] text-xs max-w-xs">
          <div className="font-bold mb-2">🔧 调试面板</div>
          <div className="mb-2">showPaywall: {showPaywall ? "✅" : "❌"}</div>
          <div className="mb-2">answers: {answers.length}</div>
          <button
            onClick={() => {
              console.log("=== 手动触发支付 ===");
              console.log(
                "按钮元素:",
                document.querySelector('[data-testid="unlock-premium"]'),
              );
              console.log(
                "handleUnlockPremium函数:",
                typeof handleUnlockPremium,
              );
              console.log(
                "window.handleProUpgrade:",
                typeof window.handleProUpgrade,
              );

              // 检查按钮是否存在
              const button = document.querySelector(
                '[data-testid="unlock-premium"]',
              ) as HTMLButtonElement;
              if (button) {
                console.log("✅ 按钮元素存在:", button);
                console.log("按钮样式:", getComputedStyle(button));
                console.log("按钮位置:", button.getBoundingClientRect());
                console.log("按钮可见性:", button.offsetParent !== null);

                // 手动触发点击
                button.click();
              } else {
                console.log("❌ 按钮元素不存在");
              }
            }}
            className="bg-red-500 text-white p-2 rounded mb-2 w-full"
          >
            手动触发支付
          </button>

          <button
            onClick={() => {
              console.log("=== 强制显示Paywall ===");
              if (answers.length < 5) {
                // 添加5个假答案
                const fakeAnswers = [1, 2, 3, 4, 5];
                setAnswers(fakeAnswers);
                setTimeout(() => {
                  setShowPaywall(true);
                }, 100);
              } else {
                setShowPaywall(true);
              }
            }}
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            强制显示Paywall
          </button>
        </div>
      </>
    );
  }

  return renderMainContent();
}
