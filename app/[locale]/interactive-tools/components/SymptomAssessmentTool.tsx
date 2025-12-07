"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Play,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  // AlertTriangle, // temporarily unused
  // FileText, // unused
  Heart,
  Brain,
  Activity,
  // Settings, // temporarily unused
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { useSymptomAssessment } from "../shared/hooks/useSymptomAssessment";
import { useNotifications } from "../shared/hooks/useNotifications";
import { useUserPreferences } from "../shared/hooks/useUserPreferences";
import { useAssessmentHistory } from "../shared/hooks/useAssessmentHistory";
import { usePersonalizedRecommendations } from "../shared/hooks/usePersonalizedRecommendations";
import NotificationContainer from "../shared/components/NotificationContainer";
// import LoadingSpinner from "../shared/components/LoadingSpinner"; // unused
// import SettingsModal from '../shared/components/SettingsModal';
import {
  AssessmentAnswer,
  AssessmentResult,
  SelectedAnswerValue,
  SelectedAnswersState,
  SessionMeta,
  AssessmentAnalyticsRecord,
} from "../shared/types";
import { logWarn } from "@/lib/debug-logger";
import { useSafeTranslations } from "@/hooks/useSafeTranslations";

interface SymptomAssessmentToolProps {
  locale: string;
  mode?: string;
}

type ReferenceData = NonNullable<AssessmentResult["referenceData"]>;

const normalizeAnswerValues = (value?: SelectedAnswerValue): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item));
  return [String(value)];
};

const optionValueToString = (value: string | number): string => String(value);

export default function SymptomAssessmentTool({
  locale,
  mode = "simplified",
}: SymptomAssessmentToolProps) {
  const { t } = useSafeTranslations("interactiveTools.symptomAssessment");
  const tTool = useTranslations("interactiveTools.symptomAssessmentTool");
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswersState>(
    {},
  );
  // const [showSettings, setShowSettings] = useState(false); // Temporarily disabled
  const [sessionData, setSessionData] = useState<SessionMeta>({
    sessionId: "",
    startTime: "",
    endTime: "",
    completionTime: 0,
    upgraded: false,
  });

  const {
    currentSession,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    // isComplete, // unused
    result,
    // isLoading, // unused
    // error, // unused
    startAssessment,
    answerQuestion,
    goToPreviousQuestion,
    goToNextQuestion,
    completeAssessment,
    resetAssessment,
  } = useSymptomAssessment();

  // 生成会话ID
  const generateSessionId = () => {
    return `symptom_assessment_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  };

  // 记录评估数据（匿名）
  // Wrap in useCallback to prevent unnecessary recreations
  const recordAssessmentData = useCallback(
    (completed: boolean = false) => {
      try {
        const startTime = sessionData.startTime || new Date().toISOString();
        const calculationBase =
          completed && sessionData.startTime
            ? Date.now() - new Date(sessionData.startTime).getTime()
            : 0;

        const data: AssessmentAnalyticsRecord = {
          sessionId: sessionData.sessionId || generateSessionId(),
          type: "symptom",
          startTime,
          endTime: completed ? new Date().toISOString() : "",
          duration: calculationBase,
          completionTime: completed
            ? sessionData.completionTime + calculationBase
            : sessionData.completionTime,
          answers: selectedAnswers,
          score: result?.score || 0,
          profile: result?.severity || "",
          completed,
          upgraded: sessionData.upgraded,
          locale,
          timestamp: Date.now(),
        };

        // 保存到localStorage（仅用于本地分析，不上传服务器）
        const existingData = JSON.parse(
          localStorage.getItem("assessmentAnalytics") || "[]",
        );
        existingData.push(data);

        // 只保留最近100次记录，避免localStorage过大
        if (existingData.length > 100) {
          existingData.splice(0, existingData.length - 100);
        }

        localStorage.setItem(
          "assessmentAnalytics",
          JSON.stringify(existingData),
        );
      } catch (error) {
        logWarn(
          "Failed to persist assessment analytics",
          error,
          "SymptomAssessmentTool",
        );
      }
    },
    [sessionData, selectedAnswers, result, locale],
  );

  // 组件加载时初始化会话数据
  useEffect(() => {
    setSessionData((prev) => ({
      ...prev,
      sessionId: generateSessionId(),
      startTime: new Date().toISOString(),
    }));
  }, []);

  //  Personalized features
  const { preferences } = useUserPreferences();
  const { history, trends, saveAssessmentResult } = useAssessmentHistory();
  const { recommendations, generateRecommendations } =
    usePersonalizedRecommendations();

  // 监听result变化并保存到历史记录
  useEffect(() => {
    if (result && preferences.trackAssessmentHistory) {
      saveAssessmentResult(result);
    }
  }, [result, preferences.trackAssessmentHistory, saveAssessmentResult]);

  // 监听评估完成并记录数据
  useEffect(() => {
    if (result) {
      // 评估完成，记录数据
      recordAssessmentData(true);
    } else if (currentSession && Object.keys(selectedAnswers).length > 0) {
      // 评估进行中，记录部分数据
      recordAssessmentData(false);
    }
  }, [result, currentSession, selectedAnswers, recordAssessmentData]);

  // 保存进度到localStorage
  const saveProgress = (answers: SelectedAnswersState) => {
    const progressData = {
      answers: answers,
      timestamp: Date.now(),
      locale: locale,
      mode: mode,
    };
    try {
      localStorage.setItem(
        "symptomAssessmentProgress",
        JSON.stringify(progressData),
      );
    } catch (error) {
      logWarn(
        "Failed to save symptom assessment progress",
        error,
        "SymptomAssessmentTool",
      );
    }
  };

  // 从localStorage恢复进度
  // Wrap in useCallback to prevent unnecessary recreations
  const loadProgress = useCallback(() => {
    try {
      const saved = localStorage.getItem("symptomAssessmentProgress");
      if (saved) {
        const progressData = JSON.parse(saved) as {
          answers: SelectedAnswersState;
          timestamp: number;
          locale: string;
          mode: string;
        };
        // 检查数据是否过期（24小时）
        const isExpired =
          Date.now() - progressData.timestamp > 24 * 60 * 60 * 1000;
        if (
          !isExpired &&
          progressData.locale === locale &&
          progressData.mode === mode
        ) {
          return progressData.answers || {};
        } else {
          // 清除过期数据
          localStorage.removeItem("symptomAssessmentProgress");
        }
      }
    } catch (error) {
      logWarn(
        "Failed to load saved symptom assessment progress",
        error,
        "SymptomAssessmentTool",
      );
    }
    return {};
  }, [locale, mode]);

  // 初始化时恢复进度
  useEffect(() => {
    if (!currentSession) {
      const savedAnswers = loadProgress();
      if (Object.keys(savedAnswers).length > 0) {
        setSelectedAnswers(savedAnswers);
      }
    }
  }, [currentSession, loadProgress]);

  // 生成个性化建议
  useEffect(() => {
    if (result && preferences.personalizedRecommendations) {
      const context = {
        currentAssessment: result
          ? {
              id: `assessment_${Date.now()}`,
              sessionId: result.sessionId || `session_${Date.now()}`,
              type: result.type || "symptom",
              mode: "detailed" as const,
              locale: locale,
              score: result.score || 0,
              maxScore: result.maxScore || 10,
              percentage: result.percentage || 0,
              severity: result.severity || "mild",
              completedAt: new Date().toISOString(),
              summary: result.message || "",
              recommendations: result.recommendations || [],
            }
          : null,
        history,
        trends,
        preferences,
        locale,
      };
      generateRecommendations(context);
    }
  }, [
    result,
    preferences.personalizedRecommendations,
    history,
    trends,
    preferences,
    locale,
    generateRecommendations,
  ]);

  // 确保locale变化时重置assessment，避免使用错误locale的旧session
  useEffect(() => {
    if (currentSession) {
      const sessionMode = currentSession.mode || "simplified";
      if (currentSession.locale !== locale || sessionMode !== mode) {
        resetAssessment();
      }
    }
  }, [locale, mode, currentSession, resetAssessment]);

  const {
    notifications,
    removeNotification,
    addSuccessNotification,
    addErrorNotification,
  } = useNotifications();

  const handleStartAssessment = () => {
    // Clear any existing session first to ensure fresh start with correct locale
    resetAssessment();
    // 清除保存的进度
    try {
      localStorage.removeItem("symptomAssessmentProgress");
    } catch (error) {
      logWarn(
        "Failed to clear symptom assessment progress before starting",
        error,
        "SymptomAssessmentTool",
      );
    }
    startAssessment(locale, mode);
  };

  // 重新评估（清除所有数据）
  const handleRestart = () => {
    resetAssessment();
    // 清除保存的进度和会话数据
    try {
      localStorage.removeItem("symptomAssessmentProgress");
      localStorage.removeItem("assessmentAnalytics");
    } catch (error) {
      logWarn(
        "Failed to clear storage during symptom assessment restart",
        error,
        "SymptomAssessmentTool",
      );
    }
    // 重置状态
    setSelectedAnswers({});
    setSessionData({
      sessionId: "",
      startTime: "",
      endTime: "",
      completionTime: 0,
      upgraded: false,
    });
  };

  const handleAnswerChange = (value: SelectedAnswerValue) => {
    if (!currentQuestion) return;

    const newAnswers = {
      ...selectedAnswers,
      [currentQuestion.id]: value,
    };

    setSelectedAnswers(newAnswers);

    const answer: AssessmentAnswer = {
      questionId: currentQuestion.id,
      value,
      timestamp: new Date().toISOString(),
    };

    answerQuestion(answer);

    // 保存进度
    saveProgress(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex >= totalQuestions - 1) {
      // 已经是最后一题，完成评估
      // Type assertion: SafeTranslationFn is runtime-compatible with TranslationFunction
      // Use unknown as intermediate type for safer type assertion
      const assessmentResult = completeAssessment(
        t as unknown as Parameters<typeof completeAssessment>[0],
      );

      if (assessmentResult) {
        addSuccessNotification(
          t("messages.assessmentComplete"),
          t("messages.assessmentCompleteDesc"),
        );
        // 强制重新渲染以显示结果
        setTimeout(() => {
          // The result will render automatically
        }, 100);
      } else {
        addErrorNotification(
          t("messages.assessmentFailed"),
          t("messages.assessmentFailedDesc"),
        );
      }
    } else {
      goToNextQuestion();
    }
  };

  const handlePrevious = () => {
    goToPreviousQuestion();
  };

  const isCurrentQuestionAnswered = () => {
    if (!currentQuestion) return false;
    const answer = selectedAnswers[currentQuestion.id];

    if (currentQuestion.validation?.required) {
      if (currentQuestion.type === "multi") {
        return Array.isArray(answer) && answer.length > 0;
      }
      return answer !== undefined && answer !== null && answer !== "";
    }

    return true;
  };

  // Start screen
  if (!currentSession) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-8 animate-fade-in">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto transform hover:scale-105 transition-all duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-slide-up">
              {t("title")}
            </h2>
            <p className="text-lg text-gray-600 mb-6 animate-slide-up delay-100">
              {t("subtitle")}
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 border border-blue-200 animate-slide-up delay-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              {t("start.title")}
            </h3>
            <p className="text-blue-800 mb-4 leading-relaxed">
              {mode === "simplified" && t("start.descriptionSimplified")}
              {mode === "detailed" && t("start.descriptionDetailed")}
              {mode === "medical" && t("start.descriptionMedical")}
              {!["simplified", "detailed", "medical"].includes(mode) &&
                t("start.description")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {(() => {
                try {
                  // 直接使用翻译键而不是数组
                  const features = [
                    t("start.feature1"),
                    t("start.feature2"),
                    t("start.feature3"),
                    t("start.feature4"),
                  ];

                  return features.map((feature: string, index: number) => {
                    const icons = [Heart, Brain, CheckCircle, Activity];
                    const Icon = icons[index] || Heart;
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 hover:bg-white/80 transition-colors duration-200 animate-slide-up"
                        style={{ animationDelay: `${300 + index * 100}ms` }}
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-blue-800 font-medium">
                          {feature}
                        </span>
                      </div>
                    );
                  });
                } catch (error) {
                  logWarn(
                    "Failed to render feature highlights",
                    error,
                    "SymptomAssessmentTool",
                  );
                  return null;
                }
              })()}
            </div>
          </div>

          <div className="text-center animate-slide-up delay-500">
            <button
              onClick={handleStartAssessment}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 inline-flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <Play className="w-5 h-5" />
              <span>{t("start.startButton")}</span>
            </button>

            <p className="text-sm text-gray-500 mt-4 max-w-md mx-auto leading-relaxed">
              {t("start.disclaimer")}
            </p>
          </div>

          {/* Personalized Dashboard */}
          {preferences.trackAssessmentHistory && history.length > 0 && (
            <div className="mt-8 animate-slide-up delay-600">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-indigo-900 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    {tTool("trends.title")}
                  </h3>
                  {/* Settings button temporarily disabled */}
                  {/* <button
                    onClick={() => setShowSettings(true)}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button> */}
                </div>

                {trends && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-indigo-600">
                        {trends.totalAssessments}
                      </div>
                      <div className="text-sm text-indigo-700">
                        {tTool("trends.totalAssessments")}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {trends.averageScore}%
                      </div>
                      <div className="text-sm text-purple-700">
                        {tTool("trends.averageScore")}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center">
                        <TrendingUp
                          className={`w-5 h-5 mr-1 ${
                            trends.scoreTrend === "improving"
                              ? "text-green-600"
                              : trends.scoreTrend === "declining"
                                ? "text-red-600"
                                : "text-gray-600"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            trends.scoreTrend === "improving"
                              ? "text-green-600"
                              : trends.scoreTrend === "declining"
                                ? "text-red-600"
                                : "text-gray-600"
                          }`}
                        >
                          {trends.scoreTrend === "improving"
                            ? tTool("trends.improving")
                            : trends.scoreTrend === "declining"
                              ? tTool("trends.declining")
                              : tTool("trends.stable")}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {tTool("trends.scoreTrend")}
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <p className="text-sm text-indigo-700">
                    {tTool("trends.lastAssessment")}
                    {new Date(
                      trends?.lastAssessmentDate || "",
                    ).toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <NotificationContainer
          notifications={notifications}
          onRemove={removeNotification}
        />

        {/* <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          locale={locale}
        /> */}
      </div>
    );
  }

  // Results screen
  if (result) {
    const referenceData = (result.referenceData || {}) as ReferenceData;
    const isSevere = result.severity === "severe" || result.emergency;
    const highScore = (result.percentage || 0) >= 70;
    const hasWorkplaceScore =
      typeof (referenceData as { workplaceScore?: number }).workplaceScore ===
      "number";
    const highWorkImpact =
      (result.mode === "medical" && hasWorkplaceScore) ||
      result.type === "workplace";

    return (
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 rounded-xl p-8 animate-fade-in">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto transform hover:scale-105 transition-all duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-slide-up">
              {t("result.title")}
            </h2>
          </div>

          {/* Score and Severity - 卡片化，与体质测试结果风格一致 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              className="card text-center transform hover:scale-105 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: "100ms" }}
            >
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-700 mb-2">
                  {t("result.yourScore")}
                </h3>
                <p className="text-3xl font-extrabold text-blue-600">
                  {result.score}/{result.maxScore}
                </p>
                <p className="text-xs text-blue-500 mt-1">
                  {Math.round(result.percentage)}%
                </p>
              </div>
            </div>

            <div
              className="card text-center transform hover:scale-105 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-violet-700 mb-2">
                  {t("result.severity")}
                </h3>
                <p className="text-xl font-bold text-violet-600">
                  {t(`severity.${result.severity}`)}
                </p>
              </div>
            </div>

            <div
              className="card text-center transform hover:scale-105 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: "300ms" }}
            >
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-700 mb-2">
                  {t("result.riskLevel")}
                </h3>
                <p className="text-xl font-bold text-green-600">
                  {result.type === "symptom"
                    ? t("severity.moderate")
                    : t(`severity.${result.type}`)}
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div
            className="mb-8 animate-slide-up"
            style={{ animationDelay: "400ms" }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              {t("result.summary")}
            </h3>
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-700 leading-relaxed">{result.message}</p>
            </div>
          </div>

          {/* 智能分流：下一步路径推荐 */}
          <div
            className="mb-8 animate-slide-up"
            style={{ animationDelay: "450ms" }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-violet-500 rounded-full mr-2"></span>
              {t("result.nextStepsRecommendations.title")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highWorkImpact && (
                <div className="bg-gradient-to-r from-violet-50 to-blue-50 p-5 rounded-lg border border-violet-200">
                  <h4 className="text-lg font-semibold text-violet-900 mb-2">
                    {t("result.nextStepsRecommendations.workImpact.title")}
                  </h4>
                  <p className="text-sm text-gray-700 mb-4">
                    {t(
                      "result.nextStepsRecommendations.workImpact.description",
                    )}
                  </p>
                  <Link
                    href={`/${locale}/interactive-tools/period-pain-impact-calculator`}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium hover:from-violet-700 hover:to-indigo-700 transition-colors"
                  >
                    {t("result.nextStepsRecommendations.workImpact.cta")}
                  </Link>
                </div>
              )}

              {(isSevere || highScore) && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-5 rounded-lg border border-red-200">
                  <h4 className="text-lg font-semibold text-red-900 mb-2">
                    {t(
                      "result.nextStepsRecommendations.medicalConsultation.title",
                    )}
                  </h4>
                  <p className="text-sm text-gray-700 mb-4">
                    {t(
                      "result.nextStepsRecommendations.medicalConsultation.description",
                    )}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/${locale}/articles/comprehensive-medical-guide-to-dysmenorrhea`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-red-300 text-red-800 text-sm font-medium hover:bg-red-50 transition-colors"
                    >
                      {t(
                        "result.nextStepsRecommendations.medicalConsultation.medicalGuideCTA",
                      )}
                    </Link>
                    <Link
                      href={`/${locale}/scenario-solutions/emergency-kit`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-red-300 text-red-800 text-sm font-medium hover:bg-red-50 transition-colors"
                    >
                      {t(
                        "result.nextStepsRecommendations.medicalConsultation.emergencyKitCTA",
                      )}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div
            className="mb-8 animate-slide-up"
            style={{ animationDelay: "500ms" }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {t("result.recommendations")}
            </h3>
            <div className="space-y-4">
              {result.recommendations.map((recommendation, index) => (
                <div
                  key={recommendation.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-slide-up"
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {recommendation.title}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        recommendation.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : recommendation.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {t(`priority.${recommendation.priority}`)}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {recommendation.description}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    <strong>{t("result.timeframe")}</strong>{" "}
                    {recommendation.timeframe}
                  </p>

                  {recommendation.actionSteps && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">
                        {t("result.actionSteps")}
                      </h5>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {(() => {
                          // Handle both array and string types for actionSteps
                          const steps = Array.isArray(
                            recommendation.actionSteps,
                          )
                            ? recommendation.actionSteps
                            : typeof recommendation.actionSteps === "string"
                              ? [recommendation.actionSteps]
                              : [];

                          return steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ));
                        })()}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
            style={{ animationDelay: "800ms" }}
          >
            <button
              onClick={handleRestart}
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              {t("result.retakeAssessment")}
            </button>
            <button
              onClick={() =>
                addSuccessNotification(
                  t("messages.resultsSaved"),
                  t("messages.resultsSavedDesc"),
                )
              }
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
            >
              {t("result.saveResults")}
            </button>
            {/* Settings button temporarily disabled */}
            {/* <button
              onClick={() => setShowSettings(true)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <Settings className="w-4 h-4 inline mr-2" />
              {tTool("settings")}
            </button> */}
          </div>

          {/* Personalized Recommendations */}
          {preferences.personalizedRecommendations &&
            recommendations.length > 0 && (
              <div
                className="mt-8 animate-slide-up"
                style={{ animationDelay: "900ms" }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  {tTool("recommendations.title")}
                </h3>
                <div className="space-y-4">
                  {recommendations.slice(0, 3).map((rec, index) => (
                    <div
                      key={rec.id}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-6 hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-slide-up"
                      style={{ animationDelay: `${1000 + index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-purple-900">
                          {rec.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              rec.priority === "high"
                                ? "bg-red-100 text-red-700"
                                : rec.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {rec.priority === "high"
                              ? tTool("recommendations.priority.high")
                              : rec.priority === "medium"
                                ? tTool("recommendations.priority.medium")
                                : tTool("recommendations.priority.low")}
                          </span>
                          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                            {rec.confidence}% {tTool("recommendations.match")}
                          </span>
                        </div>
                      </div>
                      <p className="text-purple-800 mb-3 leading-relaxed">
                        {rec.description}
                      </p>
                      <p className="text-sm text-purple-600 mb-3">
                        <strong>{tTool("recommendations.reason")}</strong>
                        {rec.reason}
                      </p>
                      <p className="text-sm text-purple-500 mb-3">
                        <strong>{tTool("recommendations.timeframe")}</strong>
                        {rec.timeframe}
                      </p>
                      {rec.actionSteps && rec.actionSteps.length > 0 && (
                        <div>
                          <h5 className="font-medium text-purple-900 mb-2">
                            {tTool("recommendations.actionSteps")}
                          </h5>
                          <ul className="list-disc list-inside text-sm text-purple-700 space-y-1">
                            {rec.actionSteps.map((step, stepIndex) => (
                              <li key={stepIndex}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        <NotificationContainer
          notifications={notifications}
          onRemove={removeNotification}
        />

        {/* <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          locale={locale}
        /> */}
      </div>
    );
  }

  // Question screen
  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 lg:p-8 mobile-safe-area animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto transform hover:scale-105 transition-all duration-300">
        {/* Progress Bar - 移动端优化 */}
        <div className="mb-6 sm:mb-8 animate-slide-up">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              {t("progress.questionOf", {
                current: Math.min(currentQuestionIndex + 1, totalQuestions),
                total: totalQuestions,
              })}
            </span>
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              {Math.round(Math.min(progress, 100))}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 sm:h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question - 移动端优化 */}
        {currentQuestion && (
          <div
            className="mb-6 sm:mb-8 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-tight">
              {currentQuestion.title}
            </h2>
            {currentQuestion.description && (
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                {currentQuestion.description}
              </p>
            )}

            {/* Question Input - 移动端优化 */}
            <div className="space-y-2 sm:space-y-3">
              {currentQuestion.type === "single" && currentQuestion.options && (
                <div className="space-y-2 sm:space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition-all duration-300 mobile-touch-target transform hover:scale-105 animate-slide-up ${
                        selectedAnswers[currentQuestion.id] === option.value
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-300 hover:border-gray-400 active:bg-gray-50 hover:shadow-sm"
                      }`}
                      style={{ animationDelay: `${200 + index * 100}ms` }}
                    >
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        value={option.value}
                        checked={
                          selectedAnswers[currentQuestion.id] === option.value
                        }
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 mr-3 flex-shrink-0 ${
                          selectedAnswers[currentQuestion.id] === option.value
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedAnswers[currentQuestion.id] ===
                          option.value && (
                          <div className="w-2.5 h-2.5 sm:w-2 sm:h-2 bg-white rounded-full mx-auto mt-0.5" />
                        )}
                      </div>
                      {option.icon && (
                        <span className="text-lg sm:text-base mr-2 sm:mr-3 flex-shrink-0">
                          {option.icon}
                        </span>
                      )}
                      <span className="text-sm sm:text-base text-gray-900 leading-relaxed">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === "multi" && currentQuestion.options && (
                <div className="space-y-2 sm:space-y-3">
                  {currentQuestion.options.map((option) => {
                    const currentValues = normalizeAnswerValues(
                      selectedAnswers[currentQuestion.id],
                    );
                    const isSelected = currentValues.includes(
                      optionValueToString(option.value),
                    );

                    return (
                      <label
                        key={option.value}
                        className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors mobile-touch-target ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400 active:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            let newValues: string[];

                            const isNoneOption =
                              option.value === "none" ||
                              option.value === "no_treatment";
                            const filteredValues = currentValues.filter(
                              (v) => v !== "none" && v !== "no_treatment",
                            );

                            if (isNoneOption) {
                              newValues = e.target.checked
                                ? [optionValueToString(option.value)]
                                : [];
                            } else {
                              newValues = e.target.checked
                                ? [
                                    ...filteredValues,
                                    optionValueToString(option.value),
                                  ]
                                : filteredValues.filter(
                                    (v) =>
                                      v !== optionValueToString(option.value),
                                  );
                            }

                            handleAnswerChange(newValues);
                          }}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 sm:w-4 sm:h-4 rounded border-2 mr-3 flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-white" />
                          )}
                        </div>
                        {option.icon && (
                          <span className="text-lg sm:text-base mr-2 sm:mr-3 flex-shrink-0">
                            {option.icon}
                          </span>
                        )}
                        <span className="text-sm sm:text-base text-gray-900 leading-relaxed">
                          {option.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === "scale" && (
                <div className="space-y-6">
                  <div className="px-4 pain-scale-container">
                    <input
                      type="range"
                      min={currentQuestion.validation?.min || 1}
                      max={currentQuestion.validation?.max || 10}
                      value={(() => {
                        const answer = selectedAnswers[currentQuestion.id];
                        if (typeof answer === "number") return answer;
                        if (typeof answer === "string") {
                          const num = Number(answer);
                          return isNaN(num)
                            ? currentQuestion.validation?.min || 1
                            : num;
                        }
                        return currentQuestion.validation?.min || 1;
                      })()}
                      onChange={(e) =>
                        handleAnswerChange(parseInt(e.target.value))
                      }
                      className="w-full pain-scale cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-neutral-600 mt-2">
                      <span className="text-xs sm:text-sm">
                        {t("painScale.levels.none")}
                      </span>
                      <span className="text-xs sm:text-sm">
                        {t("painScale.levels.mild")}
                      </span>
                      <span className="text-xs sm:text-sm">
                        {t("painScale.levels.moderate")}
                      </span>
                      <span className="text-xs sm:text-sm">
                        {t("painScale.levels.severe")}
                      </span>
                      <span className="text-xs sm:text-sm">
                        {t("painScale.levels.extreme")}
                      </span>
                    </div>
                  </div>

                  {/* 当前选择的值显示 - 与中医体质测试保持一致的样式 */}
                  <div className="text-center">
                    <div className="inline-flex items-center bg-gradient-to-r from-blue-100 via-blue-50 to-purple-100 px-8 py-4 rounded-2xl shadow-lg border border-blue-200">
                      <span className="text-xl font-bold text-blue-800">
                        {t("painScale.title")}
                        <span className="text-3xl font-extrabold text-blue-600 mx-2">
                          {selectedAnswers[currentQuestion.id] ||
                            currentQuestion.validation?.min ||
                            1}
                        </span>
                        <span className="text-base font-medium text-blue-700 ml-2">
                          (
                          {(() => {
                            const answerValue =
                              selectedAnswers[currentQuestion.id];
                            const value =
                              typeof answerValue === "number"
                                ? answerValue
                                : typeof answerValue === "string"
                                  ? Number(answerValue) ||
                                    currentQuestion.validation?.min ||
                                    1
                                  : currentQuestion.validation?.min || 1;
                            if (value <= 2) return t("painScale.levels.none");
                            if (value <= 4) return t("painScale.levels.mild");
                            if (value <= 6)
                              return t("painScale.levels.moderate");
                            if (value <= 8) return t("painScale.levels.severe");
                            return t("painScale.levels.extreme");
                          })()}
                          )
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* 疼痛程度说明 - 与中医体质测试保持一致的样式 */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl overflow-hidden border border-blue-200 shadow-sm">
                    <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                      <span>📖</span>
                      <span className="ml-2">{t("painScale.reference")}</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-blue-700">
                      <div className="flex items-start break-words bg-white p-3 rounded-lg shadow-sm">
                        <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>
                          <strong>0-2:</strong>{" "}
                          {t("painScale.descriptions.0-2")}
                        </span>
                      </div>
                      <div className="flex items-start break-words bg-white p-3 rounded-lg shadow-sm">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>
                          <strong>3-4:</strong>{" "}
                          {t("painScale.descriptions.3-4")}
                        </span>
                      </div>
                      <div className="flex items-start break-words bg-white p-3 rounded-lg shadow-sm">
                        <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>
                          <strong>5-7:</strong>{" "}
                          {t("painScale.descriptions.5-7")}
                        </span>
                      </div>
                      <div className="flex items-start break-words bg-white p-3 rounded-lg shadow-sm">
                        <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>
                          <strong>8-10:</strong>{" "}
                          {t("painScale.descriptions.8-10")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation - 移动端优化 */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 mt-6 sm:mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center justify-center sm:justify-start px-4 py-3 sm:py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed mobile-touch-target order-2 sm:order-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm sm:text-base">
              {t("navigation.previous")}
            </span>
          </button>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 order-1 sm:order-2">
            {!currentQuestion?.validation?.required && (
              <button
                onClick={handleNext}
                className="px-4 sm:px-6 py-3 sm:py-2 text-gray-600 hover:text-gray-900 mobile-touch-target text-sm sm:text-base"
              >
                {t("navigation.skip")}
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 sm:py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center mobile-touch-target text-sm sm:text-base"
            >
              {currentQuestionIndex >= totalQuestions - 1 ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t("navigation.finish")}
                </>
              ) : (
                <>
                  {t("navigation.next")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {/* Error display temporarily disabled - error state not available */}
        {/* {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )} */}
      </div>

      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />

      {/* <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        locale={locale}
      /> */}
    </div>
  );
}
