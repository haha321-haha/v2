"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Question,
  AssessmentAnswer,
  AssessmentSession,
  AssessmentResult,
} from "../types";
import { getQuestionsByMode } from "../data/assessmentQuestions";
import {
  calculateSymptomImpact,
  calculateDetailedImpact,
  calculateMedicalImpact,
} from "../data/calculationAlgorithms";

type Locale = "zh" | "en";
import { saveToStorage, loadFromStorage, createStorageKey } from "../utils";
import { logError, logInfo } from "@/lib/debug-logger";

type AnswerValue = AssessmentAnswer["value"];
type AnswerMap = Record<string, AnswerValue>;
type TranslationFunction = ReturnType<typeof useTranslations>;

interface UseSymptomAssessmentReturn {
  // Current session
  currentSession: AssessmentSession | null;
  currentQuestionIndex: number;
  currentQuestion: Question | null;
  isComplete: boolean;

  // Progress
  progress: number;
  totalQuestions: number;

  // Actions
  startAssessment: (locale: string, mode?: string) => void;
  answerQuestion: (answer: AssessmentAnswer) => void;
  goToQuestion: (index: number) => void;
  goToPreviousQuestion: () => void;
  goToNextQuestion: () => void;
  completeAssessment: (
    t?: TranslationFunction,
    locale?: string,
  ) => AssessmentResult | null;
  resetAssessment: () => void;

  // Results
  result: AssessmentResult | null;

  // State
  isLoading: boolean;
  error: string | null;
}

export const useSymptomAssessment = (
  userId?: string,
): UseSymptomAssessmentReturn => {
  const [currentSession, setCurrentSession] =
    useState<AssessmentSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storageKey = createStorageKey(
    userId || "anonymous",
    "assessment_session",
  );

  // Load saved session on mount
  useEffect(() => {
    const savedSession = loadFromStorage<AssessmentSession>(storageKey);
    if (savedSession && !savedSession.completedAt) {
      setCurrentSession(savedSession);
      setCurrentQuestionIndex(savedSession.answers.length);
    }
  }, [storageKey]);

  // Save session whenever it changes
  useEffect(() => {
    if (currentSession) {
      saveToStorage(storageKey, currentSession);
    }
  }, [currentSession, storageKey]);

  const questions = useMemo(
    () =>
      currentSession
        ? getQuestionsByMode(
            currentSession.locale,
            currentSession.mode || "simplified",
          )
        : [],
    [currentSession],
  );
  const currentQuestion = questions[currentQuestionIndex] || null;
  const isComplete = currentQuestionIndex >= questions.length;
  const progress =
    questions.length > 0
      ? Math.min((currentQuestionIndex / questions.length) * 100, 100)
      : 0;

  const startAssessment = useCallback(
    (locale: string, mode: string = "simplified") => {
      const sessionId = `assessment_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const newSession: AssessmentSession = {
        id: sessionId,
        answers: [],
        startedAt: new Date().toISOString(),
        locale,
        mode,
      };

      setCurrentSession(newSession);
      setCurrentQuestionIndex(0);
      setResult(null);
      setError(null);
    },
    [],
  );

  const answerQuestion = useCallback(
    (answer: AssessmentAnswer) => {
      if (!currentSession) return;

      setCurrentSession((prev) => {
        if (!prev) return prev;

        // Remove any existing answer for this question
        const filteredAnswers = prev.answers.filter(
          (a) => a.questionId !== answer.questionId,
        );

        // Add the new answer
        const updatedAnswers = [...filteredAnswers, answer];

        return {
          ...prev,
          answers: updatedAnswers,
        };
      });
    },
    [currentSession],
  );

  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index <= questions.length) {
        setCurrentQuestionIndex(index);
      }
    },
    [questions.length],
  );

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const completeAssessment = useCallback(
    (
      t?: TranslationFunction,
      currentLocale?: string,
    ): AssessmentResult | null => {
      logInfo(
        "completeAssessment called",
        {
          currentSession: !!currentSession,
          answersCount: currentSession?.answers.length,
          questionsCount: questions.length,
          currentLocale,
        },
        "useSymptomAssessment",
      );

      if (!currentSession) {
        logError(
          "No current session to complete assessment",
          undefined,
          "useSymptomAssessment",
        );
        return null;
      }

      setIsLoading(true);

      try {
        // 使用基于参考代码的计算算法
        const effectiveLocale: Locale =
          (currentLocale as Locale) ||
          (currentSession.locale as Locale) ||
          "zh";

        // 将答案转换为参考代码格式
        const answersForCalculation: AnswerMap = {};
        currentSession.answers.forEach((answer) => {
          answersForCalculation[answer.questionId] = answer.value;
        });

        logInfo(
          "Answers for calculation",
          answersForCalculation,
          "useSymptomAssessment",
        );

        // 根据评估模式选择计算函数
        // AnswerMap (Record<string, AnswerValue>) 在运行时与 SymptomAssessmentInputs/MedicalAssessmentInputs 兼容
        // 但 TypeScript 无法自动推断这种兼容性，所以需要使用类型断言
        // 使用 unknown 作为中间类型，比 any 更安全
        let calculationResult;
        if (currentSession.mode === "medical") {
          // 医疗专业版：使用综合评估（症状+职场）
          // Type assertion: AnswerMap is runtime-compatible with MedicalAssessmentInputs
          calculationResult = calculateMedicalImpact(
            answersForCalculation as unknown as Parameters<
              typeof calculateMedicalImpact
            >[0],
            effectiveLocale,
          );
        } else if (currentSession.mode === "detailed") {
          // 详细版：使用详细症状评估
          calculationResult = calculateDetailedImpact(
            answersForCalculation as unknown as Parameters<
              typeof calculateDetailedImpact
            >[0],
            effectiveLocale,
          );
        } else {
          // 简化版：使用基础症状评估
          calculationResult = calculateSymptomImpact(
            answersForCalculation as unknown as Parameters<
              typeof calculateSymptomImpact
            >[0],
            effectiveLocale,
          );
        }

        logInfo(
          "Calculation result",
          calculationResult,
          "useSymptomAssessment",
        );

        // 构建结果对象
        const assessmentResult: AssessmentResult = {
          sessionId: currentSession.id,
          type:
            currentSession.mode === "medical" &&
            answersForCalculation.concentration
              ? "workplace"
              : "symptom",
          severity: calculationResult.isSevere ? "severe" : "moderate",
          score: calculationResult.score || 0,
          maxScore: 100,
          percentage: calculationResult.score || 0,
          recommendations: [],
          emergency: calculationResult.isSevere || false,
          message:
            effectiveLocale === "zh" ? "评估完成" : "Assessment Complete",
          summary: calculationResult.summary?.join("; ") || "",
          completedAt: new Date().toISOString(),
          locale: effectiveLocale,
          mode: currentSession.mode || "simplified",
          // 添加参考代码的结果数据
          referenceData: calculationResult,
        };

        // 将建议转换为Recommendation格式
        if (calculationResult.recommendations) {
          const { immediate = [], longTerm = [] } =
            calculationResult.recommendations;

          immediate.forEach((rec: string, index: number) => {
            assessmentResult.recommendations.push({
              id: `immediate_${index}`,
              category: "immediate",
              title:
                effectiveLocale === "zh" ? "即时缓解建议" : "Immediate Relief",
              description: rec,
              priority: "high",
              timeframe:
                effectiveLocale === "zh" ? "立即可用" : "Immediately Available",
              actionSteps: [rec],
            });
          });

          longTerm.forEach((rec: string, index: number) => {
            assessmentResult.recommendations.push({
              id: `longterm_${index}`,
              category: "longterm",
              title:
                effectiveLocale === "zh"
                  ? "长期管理建议"
                  : "Long-term Management",
              description: rec,
              priority: "medium",
              timeframe: effectiveLocale === "zh" ? "持续实施" : "Ongoing",
              actionSteps: [rec],
            });
          });
        }

        // 如果是职场评估，添加职场建议
        if (calculationResult.suggestions) {
          calculationResult.suggestions.forEach(
            (suggestion: string, index: number) => {
              assessmentResult.recommendations.push({
                id: `workplace_${index}`,
                category: "workplace",
                title:
                  effectiveLocale === "zh"
                    ? "职场支持建议"
                    : "Workplace Support",
                description: suggestion,
                priority: "medium",
                timeframe:
                  effectiveLocale === "zh" ? "建议实施" : "Recommended",
                actionSteps: [suggestion],
              });
            },
          );
        }

        logInfo(
          "Final assessment result",
          assessmentResult,
          "useSymptomAssessment",
        );

        setResult(assessmentResult);
        setCurrentSession((prev) =>
          prev
            ? {
                ...prev,
                result: assessmentResult,
                completedAt: new Date().toISOString(),
              }
            : null,
        );

        return assessmentResult;
      } catch (err) {
        logError("Failed to complete assessment", err, "useSymptomAssessment");
        const effectiveLocale = currentLocale || currentSession?.locale;
        const isEnglish = effectiveLocale === "en";
        setError(
          t
            ? t("messages.assessmentFailed")
            : isEnglish
              ? "An error occurred while completing the assessment. Please try again."
              : "评估完成时出现错误，请重试。",
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [currentSession, questions],
  );

  const resetAssessment = useCallback(() => {
    setCurrentSession(null);
    setCurrentQuestionIndex(0);
    setResult(null);
    setError(null);
    // Clear saved session
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return {
    // Current session
    currentSession,
    currentQuestionIndex,
    currentQuestion,
    isComplete,

    // Progress
    progress,
    totalQuestions: questions.length,

    // Actions
    startAssessment,
    answerQuestion,
    goToQuestion,
    goToPreviousQuestion,
    goToNextQuestion,
    completeAssessment,
    resetAssessment,

    // Results
    result,

    // State
    isLoading,
    error,
  };
};
